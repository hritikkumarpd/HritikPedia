import { NextResponse } from 'next/server';
import { generateMathCaptcha } from '@hritikpedia/shared/captcha';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'general';

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

  // If Cloudflare Turnstile site key is configured, return it so client uses Turnstile
  if (siteKey) {
    return NextResponse.json({
      provider: 'cloudflare_turnstile',
      siteKey,
      action,
    });
  }

  // Otherwise generate self-contained cryptographic math challenge
  const challenge = generateMathCaptcha(action);

  return NextResponse.json({
    provider: 'crypto_math',
    ...challenge,
  });
}
