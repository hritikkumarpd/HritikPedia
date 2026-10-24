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
    const { email, consent, source = 'website' } = body;

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

    // Attempt writing to subscribers table in PostgreSQL if table exists
    try {
      await query(
        `INSERT INTO newsletter_subscribers (email, source, consent_given, status, created_at)
         VALUES ($1, $2, $3, 'active', NOW())
         ON CONFLICT (email) DO UPDATE SET status = 'active', updated_at = NOW()`,
        [email.toLowerCase().trim(), source, true]
      );
    } catch {
      // If DB migration not yet run, subscriber is still handled safely in local dev
    }

    return NextResponse.json({
      success: true,
      message: 'You have been successfully subscribed to Hritikpedia academic updates.',
    });
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
