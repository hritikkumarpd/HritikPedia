import { NextResponse } from 'next/server';
import { query } from '@hritikpedia/shared/db';
import { verifyPassword, signToken, shouldUseSecureCookies } from '@hritikpedia/shared/auth';
import { isValidEmail } from '@hritikpedia/shared/validation';
import { checkRateLimit, recordSecurityEvent, SECURITY_EVENT_TYPES } from '@hritikpedia/shared/audit';
import { verifyCaptcha } from '@hritikpedia/shared/captcha';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  const rate = checkRateLimit(`auth_login_${ip}`, 12, 60);
  if (!rate.allowed) {
    await recordSecurityEvent({
      eventType: SECURITY_EVENT_TYPES.RATE_LIMIT_EXCEEDED,
      ipAddress: ip,
      userAgent,
      details: { endpoint: '/api/auth/login' },
    });
    return NextResponse.json(
      { error: 'Too many login attempts. Please wait a moment.' },
      { status: 429 }
    );
  }

  try {
    const { email, password, captchaToken } = await request.json();

    // Enforce CAPTCHA bot defense
    const captchaCheck = await verifyCaptcha({
      token: captchaToken,
      ipAddress: ip,
      action: 'login',
    });
    if (!captchaCheck.success) {
      return NextResponse.json({ error: captchaCheck.error || 'Security verification failed' }, { status: 400 });
    }

    if (!isValidEmail(email) || !password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Look up user in database
    const userResult = await query(
      'SELECT id, email, password_hash, name, role, is_active FROM users WHERE email = $1',
      [cleanEmail]
    );

    if (userResult.rows.length === 0) {
      await recordSecurityEvent({
        eventType: SECURITY_EVENT_TYPES.AUTH_LOGIN_FAILED,
        ipAddress: ip,
        userAgent,
        details: { email: cleanEmail, reason: 'user_not_found' },
      });
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      await recordSecurityEvent({
        eventType: SECURITY_EVENT_TYPES.AUTH_LOGIN_FAILED,
        userId: user.id,
        ipAddress: ip,
        userAgent,
        details: { email: cleanEmail, reason: 'account_inactive' },
      });
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact support@hritikpedia.com.' },
        { status: 403 }
      );
    }

    const passwordMatch = await verifyPassword(password, user.password_hash);
    if (!passwordMatch) {
      await recordSecurityEvent({
        eventType: SECURITY_EVENT_TYPES.AUTH_LOGIN_FAILED,
        userId: user.id,
        ipAddress: ip,
        userAgent,
        details: { email: cleanEmail, reason: 'invalid_password' },
      });
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Login successful
    await recordSecurityEvent({
      eventType: SECURITY_EVENT_TYPES.AUTH_LOGIN_SUCCESS,
      userId: user.id,
      ipAddress: ip,
      userAgent,
      details: { email: cleanEmail, role: user.role },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set('hritikpedia_session', token, {
      httpOnly: true,
      secure: shouldUseSecureCookies(),
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Authentication failed due to a server error' }, { status: 500 });
  }
}
