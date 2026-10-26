import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken, verifyPassword, hashPassword } from '@hritikpedia/shared/auth';
import { query } from '@hritikpedia/shared/db';
import { isValidPassword } from '@hritikpedia/shared/validation';

export async function GET(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_session');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || !payload.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const userRes = await query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [payload.userId]);
    if (userRes.rows.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user: userRes.rows[0] });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

export async function PUT(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_session');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || !payload.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, currentPassword, newPassword } = await request.json();

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 150) {
        return NextResponse.json({ error: 'Please enter a valid full name (2-150 characters)' }, { status: 400 });
      }
    }

    if (name && name.trim().length >= 2) {
      await query('UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2', [name.trim(), payload.userId]);
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
      }

      const userRes = await query('SELECT password_hash FROM users WHERE id = $1', [payload.userId]);
      if (userRes.rows.length === 0) {
        return NextResponse.json({ error: 'User account not found' }, { status: 404 });
      }

      const validCurrent = await verifyPassword(currentPassword, userRes.rows[0].password_hash);

      if (!validCurrent) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      if (!isValidPassword(newPassword)) {
        return NextResponse.json({ error: 'New password must be at least 8 characters long and contain letters and numbers' }, { status: 400 });
      }

      const newHash = await hashPassword(newPassword);
      await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, payload.userId]);
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (err) {
    console.error('Update settings error:', err);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
