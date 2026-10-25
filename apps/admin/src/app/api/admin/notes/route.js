import { NextResponse } from 'next/server';
import { extractTokenFromRequest, verifyToken } from '@hritikpedia/shared/auth';
import { hasPermission, PERMISSIONS } from '@hritikpedia/shared/permissions';
import { query, transaction } from '@hritikpedia/shared/db';
import { generateSlug, isValidSlug } from '@hritikpedia/shared/validation';

export async function GET(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_admin_session');
  const user = token ? verifyToken(token) : null;
  if (!user || !hasPermission(user.role, PERMISSIONS.CONTENT_VIEW)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await query(`
      SELECT n.id, n.title, n.slug, n.description, n.page_count, n.is_free, n.price, 
             n.original_price, n.has_preview, n.preview_pages, n.is_featured, n.status, 
             n.download_allowed, n.watermark_enabled, n.author, n.published_at, n.created_at,
             n.domain, n.target_exam_or_board, n.medium, n.department,
             s.name as subject_name, s.slug as subject_slug
      FROM notes n
      JOIN subjects s ON n.subject_id = s.id
      ORDER BY n.created_at DESC
    `);

    const subjectsRes = await query(`
      SELECT id, name, slug, domain FROM subjects ORDER BY name ASC
    `);

    return NextResponse.json({ notes: res.rows, subjects: subjectsRes.rows });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch notes catalog' }, { status: 500 });
  }
}

export async function POST(request) {
  const token = extractTokenFromRequest(request, 'hritikpedia_admin_session');
  const user = token ? verifyToken(token) : null;
  if (!user || !hasPermission(user.role, PERMISSIONS.CONTENT_CREATE)) {
    return NextResponse.json({ error: 'Unauthorized to create content' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      title,
      slug: customSlug,
      subjectId,
      description,
      pageCount = 10,
      isFree = false,
      price = 0,
      previewPages = 5,
      isFeatured = false,
      fileKey,
      status = 'published',
      domain = 'general_competitions',
      targetExamOrBoard = 'UPSC',
      medium = 'english',
      department = 'General Studies',
    } = body;

    if (!title || !description || !subjectId) {
      return NextResponse.json({ error: 'Title, description, and subject are required' }, { status: 400 });
    }

    const cleanSlug = customSlug ? customSlug.toLowerCase().trim() : generateSlug(title);
    if (!isValidSlug(cleanSlug)) {
      return NextResponse.json({ error: 'Invalid URL slug format' }, { status: 400 });
    }

    const result = await transaction(async (txQuery) => {
      const insert = await txQuery(
        `INSERT INTO notes (title, slug, subject_id, description, page_count, is_free, price, 
                           has_preview, preview_pages, is_featured, file_key, status, author, 
                           domain, target_exam_or_board, medium, department, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())
         RETURNING *`,
        [
          title.trim(),
          cleanSlug,
          parseInt(subjectId, 10),
          description.trim(),
          parseInt(pageCount, 10),
          Boolean(isFree),
          parseFloat(price || 0),
          parseInt(previewPages, 10),
          Boolean(isFeatured),
          fileKey || `notes/${cleanSlug}.pdf`,
          status,
          user.name || 'Hritik Kumar',
          domain,
          targetExamOrBoard,
          medium,
          department,
        ]
      );

      // Audit log
      await txQuery(
        `INSERT INTO audit_logs (actor_id, actor_email, action, entity_type, entity_id, details, created_at)
         VALUES ($1, $2, 'note:created', 'note', $3, $4, NOW())`,
        [
          user.userId,
          user.email,
          String(insert.rows[0].id),
          JSON.stringify({ title, slug: cleanSlug, domain, targetExamOrBoard, medium }),
        ]
      );

      return insert.rows[0];
    });

    return NextResponse.json({ success: true, note: result });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Failed to create note' }, { status: 500 });
  }
}
