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
      SELECT n.id as note_id, n.title, n.slug, n.is_free, n.watermark_enabled, n.download_allowed,
             COALESCE(p.allow_download, n.download_allowed) as allow_download,
             COALESCE(p.allow_print, n.print_allowed) as allow_print,
             COALESCE(p.watermark_required, n.watermark_enabled) as watermark_required,
             COALESCE(p.max_devices, 3) as max_devices,
             COALESCE(p.revoked, FALSE) as revoked,
             p.updated_at
      FROM notes n
      LEFT JOIN access_policies p ON n.id = p.note_id
      ORDER BY n.id ASC
    `);

    return NextResponse.json({
      policies: res.rows,
      defaultPolicy: {
        watermarkEnabled: true,
        allowDownload: false,
        allowPrint: false,
        maxDevices: 3,
        watermarkOpacity: 0.18,
        diagonalText: 'HRITIKPEDIA VERIFIED LEARNER'
      }
    });
  } catch (err) {
    console.error('PDF policies fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch access policies' }, { status: 500 });
  }
}

export async function PUT(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_admin_session');
  const user = token ? verifyToken(token) : null;
  if (!user || (!hasPermission(user.role, PERMISSIONS.PDF_MANAGE_POLICY) && !hasPermission(user.role, PERMISSIONS.SECURITY_MANAGE))) {
    return NextResponse.json({ error: 'Unauthorized to modify PDF security policies' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      noteId,
      allowDownload = false,
      allowPrint = false,
      watermarkRequired = true,
      maxDevices = 3,
      revoked = false
    } = body;

    if (!noteId) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 });
    }

    // Upsert into access_policies
    await query(`
      INSERT INTO access_policies (note_id, allow_download, allow_print, watermark_required, max_devices, revoked, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (note_id) DO UPDATE SET
        allow_download = EXCLUDED.allow_download,
        allow_print = EXCLUDED.allow_print,
        watermark_required = EXCLUDED.watermark_required,
        max_devices = EXCLUDED.max_devices,
        revoked = EXCLUDED.revoked,
        updated_at = NOW()
    `, [
      parseInt(noteId, 10),
      Boolean(allowDownload),
      Boolean(allowPrint),
      Boolean(watermarkRequired),
      parseInt(maxDevices, 10),
      Boolean(revoked)
    ]);

    // Also update notes table mirrors
    await query(`
      UPDATE notes 
      SET download_allowed = $1, watermark_enabled = $2, updated_at = NOW()
      WHERE id = $3
    `, [Boolean(allowDownload), Boolean(watermarkRequired), parseInt(noteId, 10)]);

    // Record audit log
    await query(`
      INSERT INTO audit_logs (actor_id, actor_email, action, entity_type, entity_id, details, created_at)
      VALUES ($1, $2, 'policy:updated', 'policy', $3, $4, NOW())
    `, [
      user.userId,
      user.email,
      String(noteId),
      JSON.stringify({ allowDownload, allowPrint, watermarkRequired, maxDevices, revoked })
    ]);

    return NextResponse.json({ success: true, message: 'Policy saved successfully' });
  } catch (err) {
    console.error('Policy update error:', err);
    return NextResponse.json({ error: 'Failed to update policy' }, { status: 500 });
  }
}
