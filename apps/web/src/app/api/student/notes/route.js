import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { query } from '@hritikpedia/shared/db';
import { INITIAL_NOTES } from '@hritikpedia/shared/data';

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
              n.page_count, n.price, n.file_key, s.name as subject_name
       FROM entitlements e
       JOIN notes n ON e.note_id = n.id
       JOIN subjects s ON n.subject_id = s.id
       WHERE e.user_id = $1 AND e.status = 'active'
       ORDER BY e.granted_at DESC`,
      [payload.userId]
    );

    const purchasedNotes = entitlementsResult.rows;

    // 2. Free notes from catalog
    const freeNotes = INITIAL_NOTES.filter((n) => n.isFree);

    return NextResponse.json({
      purchasedNotes,
      freeNotes,
    });
  } catch (err) {
    console.error('Error fetching student notes:', err);
    // Fallback: return free notes
    return NextResponse.json({
      purchasedNotes: [],
      freeNotes: INITIAL_NOTES.filter((n) => n.isFree),
    });
  }
}
