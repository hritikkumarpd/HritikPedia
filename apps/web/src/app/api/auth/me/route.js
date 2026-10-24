import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';

export async function GET(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_session');

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    },
  });
}
