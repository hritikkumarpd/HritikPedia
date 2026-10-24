import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { query, transaction } from '@hritikpedia/shared/db';
import { verifyPaymentSignature } from '@hritikpedia/shared/payment';
import { recordSecurityEvent, SECURITY_EVENT_TYPES } from '@hritikpedia/shared/audit';
import { alertNewOrder } from '@hritikpedia/shared/alerts';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  const token = extractTokenFromRequest(request, 'hritikpedia_session');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = verifyToken(token);
  if (!user || !user.userId) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
  }

  try {
    const { orderId, paymentId, signature } = await request.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: 'Missing payment signature verification parameters' }, { status: 400 });
    }

    // 1. Verify Cryptographic Signature
    const isValidSignature = verifyPaymentSignature({ orderId, paymentId, signature });

    if (!isValidSignature) {
      await recordSecurityEvent({
        eventType: SECURITY_EVENT_TYPES.PAYMENT_SIGNATURE_FAILED,
        userId: user.userId,
        ipAddress: ip,
        userAgent,
        details: { orderId, paymentId },
      });
      return NextResponse.json({ error: 'Invalid payment signature. Access denied.' }, { status: 400 });
    }

    // 2. Fetch order to verify ownership & note_id
    const orderRes = await query(
      'SELECT id, user_id, note_id, amount, status FROM orders WHERE order_id = $1',
      [orderId]
    );

    if (orderRes.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found in records' }, { status: 404 });
    }

    const order = orderRes.rows[0];

    // Ensure user matches order user_id
    if (order.user_id !== user.userId) {
      return NextResponse.json({ error: 'Unauthorized order verification attempt' }, { status: 403 });
    }

    // 3. Transactional Entitlement Grant & Order Update
    await transaction(async (txQuery) => {
      // Update order status to paid
      await txQuery(
        `UPDATE orders
         SET status = 'paid', payment_id = $1, payment_signature = $2, updated_at = NOW()
         WHERE id = $3`,
        [paymentId, signature, order.id]
      );

      // Insert entitlement idempotently
      await txQuery(
        `INSERT INTO entitlements (user_id, note_id, order_id, status, granted_at)
         VALUES ($1, $2, $3, 'active', NOW())
         ON CONFLICT (user_id, note_id) DO UPDATE SET status = 'active'`,
        [order.user_id, order.note_id, order.id]
      );
    });

    // 4. Log successful audit event
    await recordSecurityEvent({
      eventType: SECURITY_EVENT_TYPES.PAYMENT_CAPTURED,
      userId: user.userId,
      ipAddress: ip,
      userAgent,
      details: { orderId, paymentId, noteId: order.note_id, amount: order.amount },
    });

    // Fetch note slug to redirect reader
    const noteRes = await query('SELECT slug, title FROM notes WHERE id = $1', [order.note_id]);
    const noteSlug = noteRes.rows[0]?.slug;
    const noteTitle = noteRes.rows[0]?.title || 'Study Note';

    // Real-time Webhook Notification to Telegram/Discord/Slack
    alertNewOrder({
      orderId,
      studentName: user.name || 'Learner',
      studentEmail: user.email,
      noteTitle,
      amount: order.amount,
      paymentId,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Payment verified and lifetime study access unlocked!',
      orderId,
      paymentId,
      readerUrl: `/reader/${noteSlug}`,
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    return NextResponse.json({ error: 'Failed to verify payment and unlock access' }, { status: 500 });
  }
}
