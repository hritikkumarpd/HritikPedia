import { NextResponse } from 'next/server';
import { isValidEmail } from '@hritikpedia/shared/validation';
import { checkRateLimit, recordSecurityEvent, SECURITY_EVENT_TYPES } from '@hritikpedia/shared/audit';
import { verifyCaptcha } from '@hritikpedia/shared/captcha';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(`pwd_reset_${ip}`, 5, 60);

  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many recovery requests. Please wait before trying again.' },
      { status: 429 }
    );
  }

  try {
    const { email, captchaToken } = await request.json();

    // Enforce CAPTCHA bot defense on password reset
    const captchaCheck = await verifyCaptcha({
      token: captchaToken,
      ipAddress: ip,
      action: 'forgot_password',
    });
    if (!captchaCheck.success) {
      return NextResponse.json({ error: captchaCheck.error || 'Security verification failed' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    await recordSecurityEvent({
      eventType: SECURITY_EVENT_TYPES.AUTH_PASSWORD_RESET,
      ipAddress: ip,
      details: { email: cleanEmail },
    });

    // In local zero-budget development, log recovery link to server console
    console.log(`[PASSWORD RECOVERY] Reset instructions generated for: ${cleanEmail}`);

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({
      success: true,
      message:
        'If an account exists with this email address, password reset instructions have been dispatched.',
    });
  } catch {
    return NextResponse.json({ error: 'Unable to process request at this time' }, { status: 500 });
  }
}
