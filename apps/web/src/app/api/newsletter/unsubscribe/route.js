import { NextResponse } from 'next/server';
import { query } from '@hritikpedia/shared/db';
import { checkRateLimit } from '@hritikpedia/shared/audit';
import { verifyUnsubscribeToken } from '@hritikpedia/shared/messaging';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(`newsletter_unsubscribe_${ip}`, 20, 60);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const email = verifyUnsubscribeToken(body.token);

    if (!email) {
      return NextResponse.json(
        { error: 'This unsubscribe link is invalid or has expired. Please contact support.' },
        { status: 400 }
      );
    }

    const updated = await query(
      `UPDATE newsletter_subscribers
       SET status = 'unsubscribed', consent_given = FALSE, unsubscribed_at = NOW(), updated_at = NOW()
       WHERE email = $1
       RETURNING id`,
      [email]
    );

    // Best-effort consent audit trail. The opt-out above is the source of truth.
    try {
      await query(
        `INSERT INTO consent_records (email, consent_type, granted, ip_address, user_agent)
         VALUES ($1, 'newsletter', FALSE, $2, $3)`,
        [email, ip, request.headers.get('user-agent') || 'Unknown']
      );
    } catch {
      // Consent history table is optional for the opt-out to take effect.
    }

    return NextResponse.json({
      success: true,
      message:
        updated.rows.length > 0
          ? 'You have been unsubscribed from Hritikpedia academic emails.'
          : 'This address is not subscribed to Hritikpedia emails.',
    });
  } catch (err) {
    console.error('Newsletter unsubscribe error:', err);
    return NextResponse.json(
      { error: 'We could not process the unsubscribe request right now. Please try again.' },
      { status: 500 }
    );
  }
}
