import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { query } from '@hritikpedia/shared/db';
import { INITIAL_NOTES } from '@hritikpedia/shared/data';
import { createRazorpayOrder } from '@hritikpedia/shared/payment';
import { checkRateLimit, recordSecurityEvent, SECURITY_EVENT_TYPES } from '@hritikpedia/shared/audit';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(`checkout_order_${ip}`, 15, 60);

  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many order requests. Please wait a moment.' }, { status: 429 });
  }

  // 1. Authenticate user
  const token = extractTokenFromRequest(request, 'hritikpedia_session');
  if (!token) {
    return NextResponse.json({ error: 'Please log in to proceed with checkout', requiresLogin: true }, { status: 401 });
  }

  const user = verifyToken(token);
  if (!user || !user.userId) {
    return NextResponse.json({ error: 'Invalid or expired session', requiresLogin: true }, { status: 401 });
  }

  try {
    const { noteSlug, couponCode } = await request.json();

    if (!noteSlug) {
      return NextResponse.json({ error: 'Note slug is required' }, { status: 400 });
    }

    // 2. Fetch server-side note details (Never trust client price!)
    let note = null;
    try {
      const noteRes = await query(
        `SELECT n.id, n.title, n.slug, n.price, n.is_free, s.name as subject_name
         FROM notes n
         LEFT JOIN subjects s ON n.subject_id = s.id
         WHERE n.slug = $1`,
        [noteSlug]
      );
      if (noteRes.rows.length > 0) {
        const row = noteRes.rows[0];
        note = {
          id: row.id,
          title: row.title,
          slug: row.slug,
          price: Number(row.price),
          isFree: Boolean(row.is_free),
          subjectName: row.subject_name || 'Computer Science',
        };
      }
    } catch {
      // fallback to INITIAL_NOTES
    }

    if (!note) {
      note = INITIAL_NOTES.find((n) => n.slug === noteSlug);
    }

    if (!note) {
      return NextResponse.json({ error: 'Study note not found' }, { status: 404 });
    }

    if (note.isFree || note.price === 0) {
      return NextResponse.json({ error: 'This study note is already 100% free. No checkout needed.' }, { status: 400 });
    }

    // 3. Check if user already owns this note
    const checkEntitlement = await query(
      `SELECT id FROM entitlements WHERE user_id = $1 AND note_id = $2 AND status = 'active'`,
      [user.userId, note.id]
    );

    if (checkEntitlement.rows.length > 0) {
      return NextResponse.json({
        error: 'You already own this study note!',
        alreadyOwned: true,
        readerUrl: `/reader/${note.slug}`,
      }, { status: 400 });
    }

    // 4. Server-Side Price Calculation & Optional Coupon Validation
    let finalPrice = Number(note.price);
    let discountPercent = 0;

    if (couponCode && typeof couponCode === 'string') {
      const cleanCoupon = couponCode.toUpperCase().trim();
      const couponRes = await query(
        `SELECT id, code, discount_percent, max_uses, current_uses, is_active, valid_until
         FROM coupons WHERE code = $1 AND is_active = TRUE`,
        [cleanCoupon]
      );

      if (couponRes.rows.length > 0) {
        const c = couponRes.rows[0];
        if (!c.valid_until || new Date(c.valid_until) > new Date()) {
          discountPercent = c.discount_percent;
          finalPrice = Math.max(1, Math.round(finalPrice * (1 - discountPercent / 100)));
        }
      }
    }

    // 5. Create Razorpay order
    const receiptId = `rcpt_${user.userId}_${note.id}_${Date.now().toString().slice(-6)}`;
    const rzpOrder = await createRazorpayOrder({
      amountInRupees: finalPrice,
      receipt: receiptId,
      notes: {
        userId: String(user.userId),
        noteId: String(note.id),
        noteSlug: note.slug,
        noteTitle: note.title,
      },
    });

    // 6. Record order in PostgreSQL
    await query(
      `INSERT INTO orders (order_id, user_id, note_id, amount, currency, status, created_at)
       VALUES ($1, $2, $3, $4, 'INR', 'created', NOW())
       ON CONFLICT (order_id) DO UPDATE SET amount = $4, updated_at = NOW()`,
      [rzpOrder.id, user.userId, note.id, finalPrice]
    );

    return NextResponse.json({
      success: true,
      order: {
        orderId: rzpOrder.id,
        amount: finalPrice,
        currency: 'INR',
        amountInPaise: rzpOrder.amount,
        noteTitle: note.title,
        noteSlug: note.slug,
        subjectName: note.subjectName,
        discountPercent,
        razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      },
    });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: 'Failed to initialize payment gateway' }, { status: 500 });
  }
}
