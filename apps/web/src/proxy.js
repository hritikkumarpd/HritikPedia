import { NextResponse } from 'next/server';
import { verifyToken } from '@hritikpedia/shared/auth';

const SESSION_COOKIE = 'hritikpedia_session';

export function proxy(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload || !payload.userId) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
