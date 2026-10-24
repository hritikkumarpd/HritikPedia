import { NextResponse } from 'next/server';
import { query } from '@hritikpedia/shared/db';
import { verifyPassword, signToken } from '@hritikpedia/shared/auth';
import { isAdmin } from '@hritikpedia/shared/permissions';
import { checkRateLimit, recordSecurityEvent, SECURITY_EVENT_TYPES } from '@hritikpedia/shared/audit';
import { verifyCaptcha } from '@hritikpedia/shared/captcha';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  // Strict rate limit on admin portal: 6 attempts per minute
  const rate = checkRateLimit(`admin_auth_${ip}`, 6, 60);
  if (!rate.allowed) {
    await recordSecurityEvent({
      eventType: SECURITY_EVENT_TYPES.RATE_LIMIT_EXCEEDED,
      ipAddress: ip,
      userAgent,
      details: { endpoint: '/api/admin/auth/login' },
    });
    return NextResponse.json(
      { error: 'Too many admin authentication attempts. Security lockout active.' },
      { status: 429 }
    );
  }

  try {
    const { email, password, captchaToken } = await request.json();

    // Enforce CAPTCHA bot defense on administrative console
    const captchaCheck = await verifyCaptcha({
      token: captchaToken,
      ipAddress: ip,
      action: 'admin_login',
    });
    if (!captchaCheck.success) {
      return NextResponse.json({ error: captchaCheck.error || 'Administrative human verification failed' }, { status: 400 });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Query user
    const res = await query(
      'SELECT id, email, password_hash, name, role, is_active FROM users WHERE email = $1',
      [cleanEmail]
    );

    if (res.rows.length === 0) {
      await recordSecurityEvent({
        eventType: SECURITY_EVENT_TYPES.AUTH_LOGIN_FAILED,
        ipAddress: ip,
        userAgent,
        details: { portal: 'admin', email: cleanEmail, reason: 'user_not_found' },
      });
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    const user = res.rows[0];

    // Check if user has an authorized admin role
    if (!isAdmin(user.role)) {
      await recordSecurityEvent({
        eventType: SECURITY_EVENT_TYPES.ACCESS_DENIED_ADMIN,
        userId: user.id,
        ipAddress: ip,
        userAgent,
        details: { email: cleanEmail, role: user.role, reason: 'insufficient_role' },
      });
      return NextResponse.json(
        { error: 'Access denied. Account is not authorized for administrative portal.' },
        { status: 403 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 });
    }

    const match = await verifyPassword(password, user.password_hash);
    if (!match) {
      await recordSecurityEvent({
        eventType: SECURITY_EVENT_TYPES.AUTH_LOGIN_FAILED,
        userId: user.id,
        ipAddress: ip,
        userAgent,
        details: { portal: 'admin', email: cleanEmail, reason: 'invalid_password' },
      });
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    await recordSecurityEvent({
      eventType: SECURITY_EVENT_TYPES.AUTH_LOGIN_SUCCESS,
      userId: user.id,
      ipAddress: ip,
      userAgent,
      details: { portal: 'admin', email: cleanEmail, role: user.role },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set('hritikpedia_admin_session', token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours for admin sessions
    });

    return response;
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: 'Internal administrative auth error' }, { status: 500 });
  }
}
