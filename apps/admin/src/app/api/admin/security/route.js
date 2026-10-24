import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { hasPermission, PERMISSIONS } from '@hritikpedia/shared/permissions';
import { query } from '@hritikpedia/shared/db';

export async function GET(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_admin_session');
  const user = token ? verifyToken(token) : null;
  if (!user || !hasPermission(user.role, PERMISSIONS.SECURITY_MONITOR)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const securityEventsRes = await query(`
      SELECT se.id, se.event_type, se.ip_address, se.user_agent, se.details, se.created_at,
             u.email as user_email
      FROM security_events se
      LEFT JOIN users u ON se.user_id = u.id
      ORDER BY se.created_at DESC
      LIMIT 100
    `);

    const auditLogsRes = await query(`
      SELECT al.id, al.actor_email, al.action, al.entity_type, al.entity_id, al.details, al.created_at
      FROM audit_logs al
      ORDER BY al.created_at DESC
      LIMIT 100
    `);

    return NextResponse.json({
      securityEvents: securityEventsRes.rows,
      auditLogs: auditLogsRes.rows,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to query security logs' }, { status: 500 });
  }
}
