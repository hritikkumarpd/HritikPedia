import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { query } from '@hritikpedia/shared/db';
import { getCatalogNotes } from '../../../../lib/catalog';

export async function GET(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_session');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload || !payload.userId) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
  }

  try {
    // 1. Fetch user's active entitlements
    const entitlementsResult = await query(
      `SELECT e.id as entitlement_id, e.granted_at, n.id, n.title, n.slug, n.description,
              n.page_count, n.price, s.name as subject_name
       FROM entitlements e
       JOIN notes n ON e.note_id = n.id
       JOIN subjects s ON n.subject_id = s.id
       WHERE e.user_id = $1 AND e.status = 'active' AND n.status = 'published'
       ORDER BY e.granted_at DESC`,
      [payload.userId]
    );

    const purchasedNotes = entitlementsResult.rows;

    // 2. Free notes from the live catalog (database-backed)
    const catalog = await getCatalogNotes();
    const freeNotes = catalog
      .filter((n) => n.isFree || Number(n.price) === 0)
      .map((n) => ({
        id: n.id,
        title: n.title,
        slug: n.slug,
        description: n.description,
        subjectName: n.subjectName,
        pageCount: n.pageCount,
        price: 0,
        isFree: true,
        color: n.color,
      }));

    return NextResponse.json({
      purchasedNotes,
      freeNotes,
    });
  } catch (err) {
    console.error('Error fetching student notes:', err);
    return NextResponse.json({ error: 'Unable to load your library right now.' }, { status: 500 });
  }
}
