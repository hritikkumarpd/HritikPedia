import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { isAdmin, ROLE_PERMISSIONS } from '@hritikpedia/shared/permissions';

export async function GET(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_admin_session');
  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || !payload.userId || !isAdmin(payload.role)) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const permissions = ROLE_PERMISSIONS[payload.role] || [];

  return NextResponse.json({
    user: {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      permissions,
    },
  });
}
