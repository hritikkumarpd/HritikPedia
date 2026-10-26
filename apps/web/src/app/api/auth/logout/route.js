import { NextResponse } from 'next/server';
import { shouldUseSecureCookies } from '@hritikpedia/shared/auth';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.set('hritikpedia_session', '', {
    httpOnly: true,
    secure: shouldUseSecureCookies(),
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });
  return response;
}
