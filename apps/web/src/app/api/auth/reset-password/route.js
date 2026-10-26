import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { hashPassword } from '@hritikpedia/shared/auth';
import { isValidPassword } from '@hritikpedia/shared/validation';
import { query, transaction } from '@hritikpedia/shared/db';
import { checkRateLimit, recordSecurityEvent, SECURITY_EVENT_TYPES } from '@hritikpedia/shared/audit';

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(`pwd_reset_confirm_${ip}`, 10, 60);

  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait before trying again.' },
      { status: 429 }
    );
  }

  try {
    const { token, password } = await request.json();

    if (!token || typeof token !== 'string' || token.length < 32) {
      return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 });
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        {
          error:
            'Password must be at least 8 characters and include at least one letter and one number or symbol.',
        },
        { status: 400 }
      );
    }

    const tokenHash = hashToken(token);
    const tokenRes = await query(
      `SELECT id, user_id, expires_at, used_at
       FROM password_reset_tokens
       WHERE token_hash = $1
       LIMIT 1`,
      [tokenHash]
    );

    if (tokenRes.rows.length === 0) {
      return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 });
    }

    const resetToken = tokenRes.rows[0];
    if (resetToken.used_at) {
      return NextResponse.json({ error: 'This reset link has already been used.' }, { status: 400 });
    }
    if (new Date(resetToken.expires_at) <= new Date()) {
      return NextResponse.json({ error: 'This reset link has expired. Please request a new one.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    await transaction(async (txQuery) => {
      await txQuery('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
        passwordHash,
        resetToken.user_id,
      ]);

      await txQuery(
        `UPDATE password_reset_tokens
         SET used_at = NOW()
         WHERE user_id = $1 AND used_at IS NULL`,
        [resetToken.user_id]
      );
    });

    await recordSecurityEvent({
      eventType: SECURITY_EVENT_TYPES.AUTH_PASSWORD_RESET,
      userId: resetToken.user_id,
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || 'Unknown',
      details: { completed: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Your password has been reset. You can now log in with your new password.',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({ error: 'Unable to reset your password right now.' }, { status: 500 });
  }
}
