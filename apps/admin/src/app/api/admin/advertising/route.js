import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { hasPermission, PERMISSIONS } from '@hritikpedia/shared/permissions';
import { query } from '@hritikpedia/shared/db';

export async function GET(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_admin_session');
  const user = token ? verifyToken(token) : null;
  if (!user || !hasPermission(user.role, PERMISSIONS.CONTENT_VIEW)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await query(`
      SELECT id, slot_id, name, description, format, active, ad_type, 
             title, sponsor_name, link, banner_text, impression_count, click_count, updated_at
      FROM advertising_placements
      ORDER BY id ASC
    `);

    return NextResponse.json({ placements: res.rows });
  } catch (err) {
    console.error('Advertising placements error:', err);
    return NextResponse.json({ error: 'Failed to fetch ad placements' }, { status: 500 });
  }
}

export async function PUT(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_admin_session');
  const user = token ? verifyToken(token) : null;
  if (!user || !hasPermission(user.role, PERMISSIONS.ADS_MANAGE)) {
    return NextResponse.json({ error: 'Unauthorized to modify ad placements' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      slotId,
      active,
      adType,
      title,
      sponsorName,
      link,
      bannerText
    } = body;

    if (!slotId) {
      return NextResponse.json({ error: 'Slot ID is required' }, { status: 400 });
    }

    // Validate link if direct sponsor
    if (link && !link.startsWith('https://') && !link.startsWith('/')) {
      return NextResponse.json({ error: 'Sponsor link must start with https:// or /' }, { status: 400 });
    }

    const res = await query(`
      UPDATE advertising_placements
      SET active = COALESCE($1, active),
          ad_type = COALESCE($2, ad_type),
          title = COALESCE($3, title),
          sponsor_name = COALESCE($4, sponsor_name),
          link = COALESCE($5, link),
          banner_text = COALESCE($6, banner_text),
          updated_at = NOW()
      WHERE slot_id = $7
      RETURNING *
    `, [
      active !== undefined ? Boolean(active) : null,
      adType || null,
      title || null,
      sponsorName || null,
      link || null,
      bannerText || null,
      slotId
    ]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Ad slot not found' }, { status: 404 });
    }

    // Log admin action
    await query(`
      INSERT INTO audit_logs (actor_id, actor_email, action, entity_type, entity_id, details, created_at)
      VALUES ($1, $2, 'advertising:updated', 'ad_slot', $3, $4, NOW())
    `, [
      user.userId,
      user.email,
      slotId,
      JSON.stringify({ slotId, active, adType, title, sponsorName, link })
    ]);

    return NextResponse.json({ success: true, placement: res.rows[0] });
  } catch (err) {
    console.error('Advertising update error:', err);
    return NextResponse.json({ error: 'Failed to update advertising placement' }, { status: 500 });
  }
}
