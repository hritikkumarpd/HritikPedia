import { INITIAL_NOTES, INITIAL_SUBJECTS, INITIAL_ARTICLES } from '@hritikpedia/shared/data';
import { query } from '@hritikpedia/shared/db';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hritikpedia.vercel.app';
  const currentDate = new Date().toISOString();

  // Fetch live published notes and subjects from Neon PostgreSQL if available
  let dbNotes = [];
  let dbSubjects = [];

  try {
    const notesRes = await query('SELECT slug, updated_at, created_at FROM notes WHERE is_published = TRUE');
    dbNotes = notesRes.rows || [];
    const subjectsRes = await query('SELECT slug, updated_at FROM subjects WHERE is_active = TRUE');
    dbSubjects = subjectsRes.rows || [];
  } catch {
    // Fall back gracefully to initial static data
  }

  // Static high-priority pages
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/subjects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/free-resources`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/advertising-disclosure`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic Subjects (DB or fallback)
  const subjectsSource = dbSubjects.length > 0 ? dbSubjects : INITIAL_SUBJECTS;
  const subjectPages = subjectsSource.map((sub) => ({
    url: `${baseUrl}/subjects/${sub.slug}`,
    lastModified: sub.updated_at ? new Date(sub.updated_at).toISOString() : currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Notes (DB or fallback)
  const notesSource = dbNotes.length > 0 ? dbNotes : INITIAL_NOTES;
  const notePages = notesSource.map((note) => ({
    url: `${baseUrl}/notes/${note.slug}`,
    lastModified: note.updated_at || note.publishedAt || currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Dynamic Articles
  const articlePages = INITIAL_ARTICLES.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.publishedAt || currentDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...subjectPages, ...notePages, ...articlePages];
}
