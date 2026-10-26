import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { query } from '@hritikpedia/shared/db';
import { checkRateLimit } from '@hritikpedia/shared/audit';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(`coupon_validate_${ip}`, 20, 60);

  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many attempts. Please wait a moment.' }, { status: 429 });
  }

  const token = extractTokenFromRequest(request, 'hritikpedia_session');
  if (!token) {
    return NextResponse.json({ error: 'Please log in to apply a coupon.' }, { status: 401 });
  }

  const user = verifyToken(token);
  if (!user || !user.userId) {
    return NextResponse.json({ error: 'Invalid or expired session.' }, { status: 401 });
  }

  try {
    const { noteSlug, code } = await request.json();

    if (!noteSlug || !code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Coupon code and study note are required.' }, { status: 400 });
    }

    const noteRes = await query(
      `SELECT id, price, is_free FROM notes
       WHERE slug = $1 AND status = 'published'
       LIMIT 1`,
      [noteSlug]
    );

    if (noteRes.rows.length === 0) {
      return NextResponse.json({ error: 'Study note not found.' }, { status: 404 });
    }

    const note = noteRes.rows[0];
    if (note.is_free || Number(note.price) === 0) {
      return NextResponse.json({ error: 'This study note is already free.' }, { status: 400 });
    }

    const cleanCoupon = code.toUpperCase().trim();
    const couponRes = await query(
      `SELECT code, discount_percent, max_uses, current_uses, valid_until
       FROM coupons
       WHERE code = $1 AND is_active = TRUE
       LIMIT 1`,
      [cleanCoupon]
    );

    if (couponRes.rows.length === 0) {
      return NextResponse.json({ error: 'This coupon code is invalid.' }, { status: 400 });
    }

    const coupon = couponRes.rows[0];

    if (coupon.valid_until && new Date(coupon.valid_until) <= new Date()) {
      return NextResponse.json({ error: 'This coupon code has expired.' }, { status: 400 });
    }

    if (Number(coupon.current_uses) >= Number(coupon.max_uses)) {
      return NextResponse.json({ error: 'This coupon code has reached its usage limit.' }, { status: 400 });
    }

    const basePrice = Number(note.price);
    const discountPercent = Number(coupon.discount_percent);
    const finalPrice = Math.max(1, Math.round(basePrice * (1 - discountPercent / 100)));

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountPercent,
      },
      pricing: {
        basePrice,
        discountPercent,
        finalPrice,
        savings: basePrice - finalPrice,
      },
    });
  } catch (err) {
    console.error('Coupon validation error:', err);
    return NextResponse.json({ error: 'Unable to validate this coupon right now.' }, { status: 500 });
  }
}
