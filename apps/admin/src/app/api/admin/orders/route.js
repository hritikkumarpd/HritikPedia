import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { hasPermission, PERMISSIONS } from '@hritikpedia/shared/permissions';
import { query, transaction } from '@hritikpedia/shared/db';

export async function GET(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_admin_session');
  const user = token ? verifyToken(token) : null;
  if (!user || !hasPermission(user.role, PERMISSIONS.COMMERCE_VIEW_ORDERS)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await query(`
      SELECT o.id, o.order_id, o.amount, o.currency, o.status, o.payment_id, o.created_at,
             u.name as student_name, u.email as student_email,
             n.title as note_title, n.slug as note_slug
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN notes n ON o.note_id = n.id
      ORDER BY o.created_at DESC
      LIMIT 100
    `);

    return NextResponse.json({ orders: res.rows });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  // Refund action
  const token = extractTokenFromRequest(request, 'hritikpedia_admin_session');
  const user = token ? verifyToken(token) : null;
  if (!user || !hasPermission(user.role, PERMISSIONS.COMMERCE_REFUND)) {
    return NextResponse.json({ error: 'Unauthorized to issue refunds' }, { status: 403 });
  }

  try {
    const { orderId, reason } = await request.json();

    const orderRes = await query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
    if (orderRes.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderRes.rows[0];

    await transaction(async (txQuery) => {
      // Mark order refunded
      await txQuery(`UPDATE orders SET status = 'refunded', updated_at = NOW() WHERE id = $1`, [order.id]);

      // Revoke entitlement
      await txQuery(
        `UPDATE entitlements SET status = 'revoked' WHERE user_id = $1 AND note_id = $2`,
        [order.user_id, order.note_id]
      );

      // Audit log
      await txQuery(
        `INSERT INTO audit_logs (actor_id, actor_email, action, entity_type, entity_id, details, created_at)
         VALUES ($1, $2, 'order:refunded', 'order', $3, $4, NOW())`,
        [user.userId, user.email, String(order.id), JSON.stringify({ orderId, reason: reason || 'Admin refund' })]
      );
    });

    return NextResponse.json({ success: true, message: 'Refund recorded and access revoked successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Refund processing failed' }, { status: 500 });
  }
}
