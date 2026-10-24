import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { hasPermission, PERMISSIONS, ROLES } from '@hritikpedia/shared/permissions';
import { query } from '@hritikpedia/shared/db';

export async function GET(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_admin_session');
  const user = token ? verifyToken(token) : null;
  if (!user || !hasPermission(user.role, PERMISSIONS.USERS_VIEW)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await query(`
      SELECT id, name, email, role, is_active, email_verified, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 100
    `);
    return NextResponse.json({ users: res.rows });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_admin_session');
  const user = token ? verifyToken(token) : null;
  if (!user || !hasPermission(user.role, PERMISSIONS.ROLES_ASSIGN)) {
    return NextResponse.json({ error: 'Unauthorized to change roles' }, { status: 403 });
  }

  try {
    const { targetUserId, newRole, isActive } = await request.json();

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 });
    }

    if (newRole && !Object.values(ROLES).includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 });
    }

    const updates = [];
    const params = [];
    let pIdx = 1;

    if (newRole) {
      updates.push(`role = $${pIdx++}`);
      params.push(newRole);
    }

    if (typeof isActive === 'boolean') {
      updates.push(`is_active = $${pIdx++}`);
      params.push(isActive);
    }

    updates.push(`updated_at = NOW()`);
    params.push(targetUserId);

    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${pIdx}`,
      params
    );

    // Audit log
    await query(
      `INSERT INTO audit_logs (actor_id, actor_email, action, entity_type, entity_id, details, created_at)
       VALUES ($1, $2, 'user:updated', 'user', $3, $4, NOW())`,
      [user.userId, user.email, String(targetUserId), JSON.stringify({ newRole, isActive })]
    );

    return NextResponse.json({ success: true, message: 'User updated successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
