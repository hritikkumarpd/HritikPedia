import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { isValidEmail } from '@hritikpedia/shared/validation';
import { checkRateLimit, recordSecurityEvent, SECURITY_EVENT_TYPES } from '@hritikpedia/shared/audit';
import { verifyCaptcha } from '@hritikpedia/shared/captcha';
import { query } from '@hritikpedia/shared/db';
import { dispatchEmail } from '@hritikpedia/shared/messaging';

const RESET_TOKEN_TTL_MINUTES = 30;

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

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

    // Look up the account. The HTTP response stays identical either way so the
    // endpoint cannot be used to enumerate registered email addresses.
    const userRes = await query(
      'SELECT id, name FROM users WHERE email = $1 AND is_active = TRUE LIMIT 1',
      [cleanEmail]
    );

    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

      // Invalidate any outstanding unused tokens for this account.
      await query(
        `UPDATE password_reset_tokens
         SET used_at = NOW()
         WHERE user_id = $1 AND used_at IS NULL`,
        [user.id]
      );

      await query(
        `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
         VALUES ($1, $2, $3)`,
        [user.id, tokenHash, expiresAt.toISOString()]
      );

      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
      const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;
      const safeName = user.name || 'Student';

      const emailResult = await dispatchEmail({
        to: cleanEmail,
        subject: 'Reset your Hritikpedia password',
        html: `
          <div style="font-family:-apple-system,'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#3f4550">
            <h2 style="color:#16191d;font-size:20px;margin:0 0 12px">Reset your password</h2>
            <p>Hi ${safeName},</p>
            <p>We received a request to reset the password for your Hritikpedia account.</p>
            <p style="margin:28px 0">
              <a href="${resetUrl}" style="background:#16191d;color:#fffdf8;padding:12px 22px;border-radius:3px;text-decoration:none;font-weight:700">
                Reset password
              </a>
            </p>
            <p style="font-size:13px;color:#6d727d;border-left:3px solid #c2410c;padding-left:10px">This link expires in ${RESET_TOKEN_TTL_MINUTES} minutes and can be used only once.</p>
            <p style="font-size:13px;color:#6d727d">If you did not request this, you can safely ignore this email — your password will not change.</p>
            <p style="font-size:12px;color:#b9b1a0;word-break:break-all">${resetUrl}</p>
          </div>
        `,
        text: `Reset your Hritikpedia password (valid ${RESET_TOKEN_TTL_MINUTES} minutes): ${resetUrl}`,
      });

      if (!emailResult.success) {
        console.error('Password reset email delivery failed for user:', user.id);
      }
    }

    return NextResponse.json({
      success: true,
      message:
        'If an account exists with this email address, password reset instructions have been dispatched.',
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ error: 'Unable to process request at this time' }, { status: 500 });
  }
}
