import { NextResponse } from 'next/server';
import { isValidEmail } from '@hritikpedia/shared/validation';
import { checkRateLimit, recordSecurityEvent, SECURITY_EVENT_TYPES } from '@hritikpedia/shared/audit';
import { query } from '@hritikpedia/shared/db';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(`newsletter_${ip}`, 10, 60);

  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before subscribing again.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email, consent } = body;
    const rawSource = typeof body.source === 'string' ? body.source.trim() : 'website';
    const source = /^[a-zA-Z0-9_-]{1,50}$/.test(rawSource) ? rawSource : 'website';

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: 'Explicit consent is required to join the newsletter.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    await query(
      `INSERT INTO newsletter_subscribers (email, source, consent_given, status, created_at)
       VALUES ($1, $2, TRUE, 'active', NOW())
       ON CONFLICT (email) DO UPDATE
       SET status = 'active', consent_given = TRUE, source = $2, unsubscribed_at = NULL, updated_at = NOW()`,
      [cleanEmail, source]
    );

    // GDPR-style consent audit trail (best-effort; never blocks the signup)
    try {
      await query(
        `INSERT INTO consent_records (email, consent_type, granted, ip_address, user_agent)
         VALUES ($1, 'newsletter', TRUE, $2, $3)`,
        [cleanEmail, ip, request.headers.get('user-agent') || 'Unknown']
      );
    } catch {
      // Consent table may not be migrated yet — subscriber is already stored
    }

    return NextResponse.json({
      success: true,
      message: 'You have been successfully subscribed to Hritikpedia academic updates.',
    });
  } catch (err) {
    console.error('Newsletter subscribe error:', err);
    return NextResponse.json(
      { error: 'We could not save your subscription right now. Please try again.' },
      { status: 500 }
    );
  }
}
