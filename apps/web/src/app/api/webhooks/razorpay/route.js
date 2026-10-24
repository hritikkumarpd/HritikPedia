import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@hritikpedia/shared/payment';
import { query, transaction } from '@hritikpedia/shared/db';
import { recordSecurityEvent, SECURITY_EVENT_TYPES } from '@hritikpedia/shared/audit';

export async function POST(request) {
  const signature = request.headers.get('x-razorpay-signature');

  try {
    const rawBody = await request.text();

    // 1. Verify Webhook Signature
    const isValid = verifyWebhookSignature({ rawBody, signature });
    if (!isValid) {
      await recordSecurityEvent({
        eventType: SECURITY_EVENT_TYPES.WEBHOOK_INVALID,
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
        details: { signatureProvided: !!signature },
      });
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventId = event.event_id || event.id || `evt_${Date.now()}`;
    const eventType = event.event;

    // 2. Deduplication check in payment_events table
    const checkEvent = await query('SELECT id FROM payment_events WHERE event_id = $1', [eventId]);
    if (checkEvent.rows.length > 0) {
      // Already processed, return 200 idempotently
      return NextResponse.json({ status: 'already_processed' }, { status: 200 });
    }

    // 3. Process supported events
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity || event.payload?.order?.entity;
      const orderId = paymentEntity?.order_id || paymentEntity?.id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        const orderRes = await query(
          'SELECT id, user_id, note_id, status FROM orders WHERE order_id = $1',
          [orderId]
        );

        if (orderRes.rows.length > 0) {
          const order = orderRes.rows[0];

          await transaction(async (txQuery) => {
            // Update order status if not already marked paid
            await txQuery(
              `UPDATE orders SET status = 'paid', payment_id = $1, updated_at = NOW() WHERE id = $2`,
              [paymentId, order.id]
            );

            // Ensure entitlement is active
            await txQuery(
              `INSERT INTO entitlements (user_id, note_id, order_id, status, granted_at)
               VALUES ($1, $2, $3, 'active', NOW())
               ON CONFLICT (user_id, note_id) DO UPDATE SET status = 'active'`,
              [order.user_id, order.note_id, order.id]
            );
          });
        }
      }
    }

    // Record webhook event into payment_events
    await query(
      `INSERT INTO payment_events (event_id, provider, event_type, payload, processed, created_at)
       VALUES ($1, 'razorpay', $2, $3, TRUE, NOW())`,
      [eventId, eventType, JSON.stringify(event)]
    );

    return NextResponse.json({ status: 'received' }, { status: 200 });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
