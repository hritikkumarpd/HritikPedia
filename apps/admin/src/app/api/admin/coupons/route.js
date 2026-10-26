import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { hasPermission, PERMISSIONS } from '@hritikpedia/shared/permissions';
import { query } from '@hritikpedia/shared/db';

const COUPON_CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{2,29}$/;

function parseCouponPayload(body, { partial = false } = {}) {
  const payload = {};

  if (!partial || body.code !== undefined) {
    const code = typeof body.code === 'string' ? body.code.toUpperCase().trim() : '';
    if (!COUPON_CODE_PATTERN.test(code)) {
      return { error: 'Coupon code must be 3-30 characters using letters, numbers, hyphens, or underscores.' };
    }
    payload.code = code;
  }

  if (!partial || body.discountPercent !== undefined) {
    const discount = Number(body.discountPercent);
    if (!Number.isInteger(discount) || discount < 1 || discount > 100) {
      return { error: 'Discount percentage must be a whole number between 1 and 100.' };
    }
    payload.discountPercent = discount;
  }

  if (!partial || body.maxUses !== undefined) {
    const maxUses = Number(body.maxUses);
    if (!Number.isInteger(maxUses) || maxUses < 1 || maxUses > 100000) {
      return { error: 'Maximum uses must be a whole number between 1 and 100,000.' };
    }
    payload.maxUses = maxUses;
  }

  if (body.validUntil !== undefined) {
    if (body.validUntil === null || body.validUntil === '') {
      payload.validUntil = null;
    } else {
      const parsed = new Date(body.validUntil);
      if (Number.isNaN(parsed.getTime())) {
        return { error: 'Expiry date is not a valid date.' };
      }
      if (!partial && parsed.getTime() <= Date.now()) {
        return { error: 'Expiry date must be in the future.' };
      }
      payload.validUntil = parsed.toISOString();
    }
  }

  if (body.isActive !== undefined) {
    payload.isActive = Boolean(body.isActive);
  }

  return { payload };
}

async function authorize(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_admin_session');
  const user = token ? verifyToken(token) : null;
  if (!user || !hasPermission(user.role, PERMISSIONS.COMMERCE_MANAGE_COUPONS)) {
    return { error: NextResponse.json({ error: 'Unauthorized to manage coupons' }, { status: 403 }) };
  }
  return { user };
}

export async function GET(request) {
  const auth = await authorize(request);
  if (auth.error) return auth.error;

  try {
    const res = await query(`
      SELECT id, code, discount_percent, max_uses, current_uses, valid_until, is_active, created_at
      FROM coupons
      ORDER BY created_at DESC, id DESC
      LIMIT 200
    `);

    return NextResponse.json({ coupons: res.rows });
  } catch (err) {
    console.error('Coupon list error:', err);
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await authorize(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = parseCouponPayload(body);
    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { code, discountPercent, maxUses, validUntil } = parsed.payload;

    const existing = await query('SELECT id FROM coupons WHERE code = $1', [code]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'A coupon with this code already exists.' }, { status: 409 });
    }

    const res = await query(
      `INSERT INTO coupons (code, discount_percent, max_uses, current_uses, valid_until, is_active, created_at)
       VALUES ($1, $2, $3, 0, $4, TRUE, NOW())
       RETURNING id, code, discount_percent, max_uses, current_uses, valid_until, is_active, created_at`,
      [code, discountPercent, maxUses, validUntil || null]
    );

    const coupon = res.rows[0];

    await query(
      `INSERT INTO audit_logs (actor_id, actor_email, action, entity_type, entity_id, details, created_at)
       VALUES ($1, $2, 'coupon:created', 'coupon', $3, $4, NOW())`,
      [
        auth.user.userId,
        auth.user.email,
        String(coupon.id),
        JSON.stringify({ code, discountPercent, maxUses, validUntil: validUntil || null }),
      ]
    );

    return NextResponse.json({ success: true, coupon, message: `Coupon ${code} created.` }, { status: 201 });
  } catch (err) {
    console.error('Coupon create error:', err);
    if (err?.code === '23505') {
      return NextResponse.json({ error: 'A coupon with this code already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await authorize(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const id = Number(body.id);
    if (!Number.isInteger(id) || id < 1) {
      return NextResponse.json({ error: 'A valid coupon ID is required.' }, { status: 400 });
    }

    const parsed = parseCouponPayload(body, { partial: true });
    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const updates = [];
    const values = [];
    let index = 1;

    if (parsed.payload.code !== undefined) {
      updates.push(`code = $${index++}`);
      values.push(parsed.payload.code);
    }
    if (parsed.payload.discountPercent !== undefined) {
      updates.push(`discount_percent = $${index++}`);
      values.push(parsed.payload.discountPercent);
    }
    if (parsed.payload.maxUses !== undefined) {
      updates.push(`max_uses = $${index++}`);
      values.push(parsed.payload.maxUses);
    }
    if (parsed.payload.validUntil !== undefined) {
      updates.push(`valid_until = $${index++}`);
      values.push(parsed.payload.validUntil);
    }
    if (parsed.payload.isActive !== undefined) {
      updates.push(`is_active = $${index++}`);
      values.push(parsed.payload.isActive);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No coupon changes were provided.' }, { status: 400 });
    }

    values.push(id);
    const res = await query(
      `UPDATE coupons SET ${updates.join(', ')} WHERE id = $${index}
       RETURNING id, code, discount_percent, max_uses, current_uses, valid_until, is_active, created_at`,
      values
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    await query(
      `INSERT INTO audit_logs (actor_id, actor_email, action, entity_type, entity_id, details, created_at)
       VALUES ($1, $2, 'coupon:updated', 'coupon', $3, $4, NOW())`,
      [
        auth.user.userId,
        auth.user.email,
        String(id),
        JSON.stringify(parsed.payload),
      ]
    );

    return NextResponse.json({ success: true, coupon: res.rows[0], message: 'Coupon updated.' });
  } catch (err) {
    console.error('Coupon update error:', err);
    if (err?.code === '23505') {
      return NextResponse.json({ error: 'A coupon with this code already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}
