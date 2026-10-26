import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { query } from '@hritikpedia/shared/db';
import { generateWatermarkMetadata } from '@hritikpedia/shared/watermark';
import { recordSecurityEvent, SECURITY_EVENT_TYPES } from '@hritikpedia/shared/audit';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const { searchParams } = new URL(request.url);
  const isPreview = searchParams.get('preview') === 'true';

  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  // Find the published note. The database is the source of truth: a successful
  // query with zero rows means the note does not exist (never fall back to
  // static marketing data, which could point at a different note id).
  let note = null;
  try {
    const noteRes = await query(
      `SELECT n.id, n.title, n.slug, n.page_count, n.is_free, n.price, n.has_preview,
              n.preview_pages, n.download_allowed, n.print_allowed, n.watermark_enabled,
              s.name as subject_name,
              COALESCE(p.revoked, FALSE) as policy_revoked,
              COALESCE(p.allow_download, n.download_allowed) as effective_download_allowed,
              COALESCE(p.allow_print, n.print_allowed) as effective_print_allowed,
              COALESCE(p.watermark_required, n.watermark_enabled) as effective_watermark_required
       FROM notes n
       LEFT JOIN subjects s ON n.subject_id = s.id
       LEFT JOIN access_policies p ON p.note_id = n.id
       WHERE n.slug = $1 AND n.status = 'published'
       LIMIT 1`,
      [slug]
    );
    if (noteRes.rows.length > 0) {
      const row = noteRes.rows[0];
      note = {
        id: row.id,
        title: row.title,
        slug: row.slug,
        subjectName: row.subject_name || 'General Studies',
        pageCount: Number(row.page_count) || 1,
        isFree: Boolean(row.is_free),
        price: Number(row.price),
        hasPreview: Boolean(row.has_preview),
        previewPages: Number(row.preview_pages) || 0,
        downloadAllowed: Boolean(row.effective_download_allowed),
        printAllowed: Boolean(row.effective_print_allowed),
        watermarkRequired: Boolean(row.effective_watermark_required),
        policyRevoked: Boolean(row.policy_revoked),
      };
    }
  } catch (dbErr) {
    console.error('Reader note lookup failed:', dbErr);
    return NextResponse.json(
      { error: 'The library is temporarily unavailable. Please try again in a moment.' },
      { status: 503 }
    );
  }

  if (!note) {
    return NextResponse.json({ error: 'Study note not found' }, { status: 404 });
  }

  // Check user session
  const token = extractTokenFromRequest(request, 'hritikpedia_session');
  const user = token ? verifyToken(token) : null;

  // An administrator can revoke a note for everyone (emergency takedown).
  if (note.policyRevoked) {
    await recordSecurityEvent({
      eventType: SECURITY_EVENT_TYPES.ACCESS_DENIED_PDF,
      userId: user?.userId,
      ipAddress: ip,
      userAgent,
      details: { noteSlug: slug, reason: 'policy_revoked' },
    });

    return NextResponse.json(
      {
        error:
          'Access to this study note has been temporarily revoked by an administrator. Please contact support if you need help.',
        revoked: true,
      },
      { status: 403 }
    );
  }

  const isFree = note.isFree || Number(note.price) === 0;

  // Case 1: 100% Free Note -> Full access granted
  if (isFree) {
    const watermark = note.watermarkRequired
      ? generateWatermarkMetadata({ user, note, ipAddress: ip })
      : null;
    return NextResponse.json({
      accessGranted: true,
      mode: 'full',
      isFree: true,
      note: {
        id: note.id,
        title: note.title,
        slug: note.slug,
        subjectName: note.subjectName,
        pageCount: note.pageCount,
        downloadAllowed: note.downloadAllowed,
        printAllowed: note.printAllowed,
      },
      watermark,
      allowedPages: Array.from({ length: note.pageCount }, (_, i) => i + 1),
    });
  }

  // Case 2: Preview Mode requested for paid note
  if (isPreview) {
    if (!note.hasPreview || note.previewPages <= 0) {
      return NextResponse.json(
        {
          error: 'This study note does not offer a free preview',
          requiresPurchase: true,
          previewAvailable: false,
          noteSlug: note.slug,
          price: note.price,
        },
        { status: 403 }
      );
    }

    const previewCount = Math.min(note.previewPages, note.pageCount);
    const watermark = note.watermarkRequired
      ? generateWatermarkMetadata({ user, note, ipAddress: ip })
      : null;
    return NextResponse.json({
      accessGranted: true,
      mode: 'preview',
      isFree: false,
      previewPages: previewCount,
      note: {
        id: note.id,
        title: note.title,
        slug: note.slug,
        subjectName: note.subjectName,
        price: note.price,
        pageCount: note.pageCount,
        downloadAllowed: false,
        printAllowed: false,
      },
      watermark,
      allowedPages: Array.from({ length: previewCount }, (_, i) => i + 1),
    });
  }

  // Case 3: Paid Note requiring active entitlement
  if (!user) {
    await recordSecurityEvent({
      eventType: SECURITY_EVENT_TYPES.ACCESS_DENIED_PDF,
      ipAddress: ip,
      userAgent,
      details: { noteSlug: slug, reason: 'unauthenticated' },
    });
    return NextResponse.json(
      { error: 'Authentication required to view paid study notes', requiresAuth: true },
      { status: 401 }
    );
  }

  // Check entitlements table in PostgreSQL
  let hasEntitlement = false;
  try {
    const checkEntitlement = await query(
      `SELECT id FROM entitlements WHERE user_id = $1 AND note_id = $2 AND status = 'active'`,
      [user.userId, note.id]
    );
    hasEntitlement = checkEntitlement.rows.length > 0;
  } catch {
    hasEntitlement = false;
  }

  // If user has not purchased this note
  if (!hasEntitlement) {
    await recordSecurityEvent({
      eventType: SECURITY_EVENT_TYPES.ACCESS_DENIED_PDF,
      userId: user.userId,
      ipAddress: ip,
      userAgent,
      details: { noteSlug: slug, reason: 'missing_entitlement' },
    });

    return NextResponse.json(
      {
        error: 'You have not purchased access to this study note yet',
        requiresPurchase: true,
        previewAvailable: note.hasPreview,
        noteSlug: note.slug,
        price: note.price,
      },
      { status: 403 }
    );
  }

  // Entitlement verified! Grant full access with user-specific watermark
  const watermark = note.watermarkRequired
    ? generateWatermarkMetadata({ user, note, ipAddress: ip })
    : null;

  return NextResponse.json({
    accessGranted: true,
    mode: 'full',
    isFree: false,
    note: {
      id: note.id,
      title: note.title,
      slug: note.slug,
      subjectName: note.subjectName,
      pageCount: note.pageCount,
      downloadAllowed: note.downloadAllowed,
      printAllowed: note.printAllowed,
    },
    watermark,
    allowedPages: Array.from({ length: note.pageCount }, (_, i) => i + 1),
  });
}
