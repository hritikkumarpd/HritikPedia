import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { query } from '@hritikpedia/shared/db';
import { INITIAL_NOTES } from '@hritikpedia/shared/data';
import { generateWatermarkMetadata } from '@hritikpedia/shared/watermark';
import { recordSecurityEvent, SECURITY_EVENT_TYPES } from '@hritikpedia/shared/audit';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const { searchParams } = new URL(request.url);
  const isPreview = searchParams.get('preview') === 'true';

  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  // Find note (DB first, fallback to INITIAL_NOTES)
  let note = null;
  try {
    const noteRes = await query(
      `SELECT n.id, n.title, n.slug, n.page_count, n.is_free, n.price, n.has_preview, 
              n.preview_pages, n.download_allowed, s.name as subject_name
       FROM notes n
       LEFT JOIN subjects s ON n.subject_id = s.id
       WHERE n.slug = $1`,
      [slug]
    );
    if (noteRes.rows.length > 0) {
      const row = noteRes.rows[0];
      note = {
        id: row.id,
        title: row.title,
        slug: row.slug,
        subjectName: row.subject_name || 'Computer Science',
        pageCount: row.page_count || 10,
        isFree: Boolean(row.is_free),
        price: Number(row.price),
        hasPreview: Boolean(row.has_preview),
        previewPages: row.preview_pages || 5,
        downloadAllowed: Boolean(row.download_allowed),
        printAllowed: false,
      };
    }
  } catch {
    // fallback to INITIAL_NOTES
  }

  if (!note) {
    note = INITIAL_NOTES.find((n) => n.slug === slug);
  }

  if (!note) {
    return NextResponse.json({ error: 'Study note not found' }, { status: 404 });
  }

  // Check user session
  const token = extractTokenFromRequest(request, 'hritikpedia_session');
  const user = token ? verifyToken(token) : null;

  const isFree = note.isFree || Number(note.price) === 0;

  // Case 1: 100% Free Note -> Full access granted
  if (isFree) {
    const watermark = generateWatermarkMetadata({ user, note, ipAddress: ip });
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
    const previewCount = Math.min(note.previewPages || 5, note.pageCount);
    const watermark = generateWatermarkMetadata({ user, note, ipAddress: ip });
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
  const watermark = generateWatermarkMetadata({ user, note, ipAddress: ip });

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
