import { query } from '@hritikpedia/shared/db';
import {
  INITIAL_NOTES,
  INITIAL_SUBJECTS,
  INITIAL_ARTICLES,
} from '@hritikpedia/shared/data';

/**
 * Server-side catalog helpers.
 *
 * PostgreSQL is the source of truth (what admins edit). The static seed data is
 * only used as a safety net when the database is temporarily unreachable, so a
 * production outage degrades to read-only content instead of a blank site.
 */

const NOTE_BASE = `
  SELECT n.*, s.name AS subject_name, s.slug AS subject_slug
  FROM notes n
  LEFT JOIN subjects s ON n.subject_id = s.id
  WHERE n.status = 'published'
`;

const NOTE_QUERY = `${NOTE_BASE} ORDER BY n.is_featured DESC, n.id ASC`;

const SUBJECT_BASE = `
  SELECT s.*, COUNT(n.id)::int AS live_note_count
  FROM subjects s
  LEFT JOIN notes n ON n.subject_id = s.id AND n.status = 'published'
`;

const SUBJECT_QUERY = `${SUBJECT_BASE} GROUP BY s.id ORDER BY s.order_index ASC, s.id ASC`;

const ARTICLE_QUERY = `
  SELECT *
  FROM articles
  WHERE status = 'published'
  ORDER BY published_at DESC NULLS LAST, id ASC
`;

function colorForSlug(slug = '') {
  if (slug.includes('dbms')) return 'white';
  if (slug.includes('network')) return 'purple';
  if (slug.includes('operat')) return 'red';
  return 'blue';
}

function contentTypeFor(title = '') {
  if (/pyq|previous year/i.test(title)) return 'pyqs';
  if (/revision|formula|reference|cheat/i.test(title)) return 'revision';
  return 'notes';
}

export function mapDbNote(row) {
  const topics = Array.isArray(row.topics_covered) ? row.topics_covered : [];
  const price = Number(row.price) || 0;
  const isFree = Boolean(row.is_free) || price === 0;

  return {
    id: row.id,
    title: row.title,
    subtitle: row.topic_label || row.exam_category || 'Study Notes',
    slug: row.slug,
    subjectId: row.subject_id,
    subjectName: row.subject_name || 'General Studies',
    subjectSlug: row.subject_slug || 'general',
    topic: row.topic_label || '',
    examCategory: row.exam_category || 'All Exams',
    targetExamOrBoard: row.target_exam_or_board || '',
    domain: row.domain || 'engineering',
    medium: row.medium || 'English',
    department: row.department || '',
    classOrSemester: row.class_or_semester || '',
    description: row.description || '',
    pageCount: Number(row.page_count) || 1,
    isFree,
    price,
    originalPrice: Number(row.original_price) || 0,
    discountBadge:
      Number(row.original_price) > price && price > 0
        ? `${Math.round((1 - price / Number(row.original_price)) * 100)}% OFF`
        : null,
    hasPreview: Boolean(row.has_preview),
    previewPages: Number(row.preview_pages) || 5,
    isFeatured: Boolean(row.is_featured),
    fileKey: row.file_key,
    status: row.status,
    downloadAllowed: Boolean(row.download_allowed),
    printAllowed: Boolean(row.print_allowed),
    watermarkEnabled: Boolean(row.watermark_enabled),
    author: row.author || 'Hritikpedia Editorial Team',
    rating: Number(row.rating) || 0,
    topicsCovered: topics,
    tags: topics.length > 0 ? topics.slice(0, 3) : ['PDF Notes', 'Revision Sheet'],
    contentType: contentTypeFor(row.title),
    language: row.medium || 'English',
    color: colorForSlug(row.slug),
    reviewsCount: null,
    ratingStudents: null,
    publishedAt: row.published_at ? new Date(row.published_at).toISOString() : null,
    highlights: topics.slice(0, 5),
    whatsIncluded: topics.slice(0, 5),
  };
}

export function mapDbSubject(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    code: row.code,
    description: row.description || '',
    icon: row.icon || 'BookOpen',
    color: row.color || 'blue',
    noteCount: Number(row.live_note_count ?? row.note_count) || 0,
    isFeatured: Boolean(row.is_featured),
    domain: row.domain || 'engineering',
    targetExamOrBoard: row.target_exam_or_board || '',
    department: row.department || '',
  };
}

export function mapDbArticle(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    readingTime: row.reading_time || '5 min read',
    publishedAt: row.published_at ? new Date(row.published_at).toISOString() : null,
    tags: [],
  };
}

export async function getCatalogNotes() {
  try {
    const res = await query(NOTE_QUERY);
    // A successful query is authoritative: zero published rows means the
    // catalogue is genuinely empty, not that the database is down.
    return res.rows.map(mapDbNote);
  } catch {
    // Database unavailable — serve the static catalog below.
    return INITIAL_NOTES;
  }
}

export async function getCatalogNoteBySlug(slug) {
  try {
    const res = await query(`${NOTE_BASE} AND n.slug = $1 LIMIT 1`, [slug]);
    if (res.rows.length > 0) return mapDbNote(res.rows[0]);
    return null;
  } catch {
    return INITIAL_NOTES.find((n) => n.slug === slug) || null;
  }
}

export async function getCatalogSubjects() {
  try {
    const res = await query(SUBJECT_QUERY);
    return res.rows.map(mapDbSubject);
  } catch {
    // Database unavailable — serve the static catalog below.
    return INITIAL_SUBJECTS;
  }
}

export async function getCatalogSubjectBySlug(slug) {
  try {
    const res = await query(`${SUBJECT_BASE} WHERE s.slug = $1 GROUP BY s.id`, [slug]);
    if (res.rows.length > 0) return mapDbSubject(res.rows[0]);
    return null;
  } catch {
    return INITIAL_SUBJECTS.find((s) => s.slug === slug) || null;
  }
}

export async function getCatalogArticles() {
  try {
    const res = await query(ARTICLE_QUERY);
    return res.rows.map(mapDbArticle);
  } catch {
    // Database unavailable — serve the static catalog below.
    return INITIAL_ARTICLES;
  }
}

export async function getCatalogArticleBySlug(slug) {
  try {
    const res = await query(
      `SELECT * FROM articles WHERE slug = $1 AND status = 'published' LIMIT 1`,
      [slug]
    );
    if (res.rows.length > 0) return mapDbArticle(res.rows[0]);
    return null;
  } catch {
    return INITIAL_ARTICLES.find((a) => a.slug === slug) || null;
  }
}
