import { NextResponse } from 'next/server';
import { query } from '@hritikpedia/shared/db';
import { hashPassword, signToken, shouldUseSecureCookies } from '@hritikpedia/shared/auth';
import { isValidEmail, isValidPassword } from '@hritikpedia/shared/validation';
import { checkRateLimit, recordSecurityEvent, SECURITY_EVENT_TYPES } from '@hritikpedia/shared/audit';
import { ROLES } from '@hritikpedia/shared/permissions';
import { verifyCaptcha } from '@hritikpedia/shared/captcha';
import { alertNewStudent } from '@hritikpedia/shared/alerts';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  const rate = checkRateLimit(`auth_reg_${ip}`, 10, 60);
  if (!rate.allowed) {
    await recordSecurityEvent({
      eventType: SECURITY_EVENT_TYPES.RATE_LIMIT_EXCEEDED,
      ipAddress: ip,
      userAgent,
      details: { endpoint: '/api/auth/register' },
    });
    return NextResponse.json(
      { error: 'Too many registration attempts. Please wait a minute.' },
      { status: 429 }
    );
  }

  try {
    const { name, email, password, captchaToken } = await request.json();

    // Enforce CAPTCHA bot defense
    const captchaCheck = await verifyCaptcha({
      token: captchaToken,
      ipAddress: ip,
      action: 'register',
    });
    if (!captchaCheck.success) {
      return NextResponse.json({ error: captchaCheck.error || 'Security verification failed' }, { status: 400 });
    }

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters long' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long and include letters and numbers' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please log in.' },
        { status: 409 }
      );
    }

    // Hash password securely
    const hashedPassword = await hashPassword(password);

    // CRITICAL SECURITY: Public registration ALWAYS assigns 'student' role
    const newUser = await query(
      `INSERT INTO users (email, password_hash, name, role, is_active, email_verified, created_at)
       VALUES ($1, $2, $3, $4, TRUE, TRUE, NOW())
       RETURNING id, email, name, role`,
      [cleanEmail, hashedPassword, name.trim(), ROLES.STUDENT]
    );

    const user = newUser.rows[0];

    await recordSecurityEvent({
      eventType: SECURITY_EVENT_TYPES.AUTH_REGISTER,
      userId: user.id,
      ipAddress: ip,
      userAgent,
      details: { email: cleanEmail, role: ROLES.STUDENT },
    });

    // Real-time notification for community growth
    alertNewStudent({ name: user.name, email: user.email, userId: user.id }).catch(() => {});

    // Create session token
    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set secure HttpOnly cookie
    response.cookies.set('hritikpedia_session', token, {
      httpOnly: true,
      secure: shouldUseSecureCookies(),
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Registration failed due to a server error' }, { status: 500 });
  }
}
