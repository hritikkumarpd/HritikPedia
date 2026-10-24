import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { query } from '@hritikpedia/shared/db';

export async function GET(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_session');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload || !payload.userId) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
  }

  try {
    const ordersResult = await query(
      `SELECT o.id, o.order_id, o.amount, o.currency, o.status, o.payment_id, o.created_at,
              n.title as note_title, n.slug as note_slug
       FROM orders o
       JOIN notes n ON o.note_id = n.id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [payload.userId]
    );

    return NextResponse.json({
      purchases: ordersResult.rows,
    });
  } catch (err) {
    console.error('Error fetching purchases:', err);
    return NextResponse.json({ purchases: [] });
  }
}
