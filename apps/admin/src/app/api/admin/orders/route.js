import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { hasPermission, PERMISSIONS } from '@hritikpedia/shared/permissions';
import { query, transaction } from '@hritikpedia/shared/db';
import { refundRazorpayPayment, formatINR } from '@hritikpedia/shared/payment';

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

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const orderRes = await query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
    if (orderRes.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderRes.rows[0];

    if (order.status === 'refunded') {
      return NextResponse.json({ error: 'This order has already been refunded.' }, { status: 400 });
    }

    if (order.status !== 'paid') {
      return NextResponse.json(
        { error: 'Only paid orders can be refunded.' },
        { status: 400 }
      );
    }

    // Local development orders never touched Razorpay, so there is no money to
    // return. Real orders must be refunded through Razorpay before we revoke
    // access locally.
    const isMockOrder =
      String(order.order_id).startsWith('order_dev_') ||
      String(order.payment_id || '').startsWith('pay_dev_');

    let refundInfo = { provider: 'mock', id: null, status: 'simulated' };

    if (!isMockOrder) {
      if (!order.payment_id) {
        return NextResponse.json(
          {
            error:
              'This order has no Razorpay payment ID, so an automatic refund is not possible. Reconcile the payment manually.',
          },
          { status: 400 }
        );
      }

      try {
        const refund = await refundRazorpayPayment({
          paymentId: order.payment_id,
          amountInRupees: Number(order.amount),
          notes: {
            orderId: order.order_id,
            reason: reason || 'Admin refund',
          },
        });
        refundInfo = {
          provider: 'razorpay',
          id: refund?.id || null,
          status: refund?.status || 'processed',
        };
      } catch (refundErr) {
        console.error('Razorpay refund failed:', refundErr);
        return NextResponse.json(
          {
            error:
              refundErr.message ||
              'Razorpay refund failed. The order was not changed and access was not revoked.',
          },
          { status: 502 }
        );
      }
    }

    try {
      await transaction(async (txQuery) => {
        await txQuery(`UPDATE orders SET status = 'refunded', updated_at = NOW() WHERE id = $1`, [
          order.id,
        ]);

        await txQuery(
          `UPDATE entitlements SET status = 'revoked' WHERE user_id = $1 AND note_id = $2`,
          [order.user_id, order.note_id]
        );

        await txQuery(
          `INSERT INTO audit_logs (actor_id, actor_email, action, entity_type, entity_id, details, created_at)
           VALUES ($1, $2, 'order:refunded', 'order', $3, $4, NOW())`,
          [
            user.userId,
            user.email,
            String(order.id),
            JSON.stringify({
              orderId,
              reason: reason || 'Admin refund',
              amount: Number(order.amount),
              refundProvider: refundInfo.provider,
              refundId: refundInfo.id,
              refundStatus: refundInfo.status,
            }),
          ]
        );
      });
    } catch (dbErr) {
      console.error('Refund recorded externally but local order update failed:', dbErr);
      return NextResponse.json(
        {
          error:
            refundInfo.provider === 'razorpay'
              ? `Razorpay refund ${refundInfo.id} was initiated, but updating the local order failed. Reconcile this order immediately.`
              : 'The local order could not be updated. Please retry.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      refundProvider: refundInfo.provider,
      refundId: refundInfo.id,
      message:
        refundInfo.provider === 'razorpay'
          ? `Refund of ${formatINR(Number(order.amount))} initiated via Razorpay${
              refundInfo.id ? ` (${refundInfo.id})` : ''
            } and access revoked.`
          : `Test order ${orderId} marked refunded and access revoked. No live money was moved.`,
    });
  } catch (err) {
    console.error('Refund processing error:', err);
    return NextResponse.json({ error: 'Refund processing failed' }, { status: 500 });
  }
}
