import { NextResponse } from 'next/server';
import { verifyToken } from '@hritikpedia/shared/auth';
import { isAdmin } from '@hritikpedia/shared/permissions';

const ADMIN_SESSION_COOKIE = 'hritikpedia_admin_session';

// Paths that must stay reachable without an authenticated admin session.
const PUBLIC_PATHS = [
  '/login',
  '/api/admin/auth/login',
  '/api/admin/auth/captcha',
  '/api/admin/health',
];

function isPublicPath(pathname) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload || !payload.userId || !isAdmin(payload.role)) {
    // API calls receive a clean 401 instead of an HTML redirect.
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match every request except Next.js internals and static assets.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf)$).*)',
  ],
};
