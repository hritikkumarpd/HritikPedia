import { NextResponse } from 'next/server';
import { generateMathCaptcha } from '@hritikpedia/shared/captcha';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'admin_login';

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
  const secretKey =
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || process.env.CAPTCHA_SECRET_KEY || '';

  // Only advertise Turnstile when the server can actually verify its tokens.
  if (siteKey && secretKey) {
    return NextResponse.json({
      provider: 'cloudflare_turnstile',
      siteKey,
      action,
    });
  }

  const challenge = generateMathCaptcha(action);

  return NextResponse.json({
    provider: 'crypto_math',
    ...challenge,
  });
}
