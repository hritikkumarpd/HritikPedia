import { INITIAL_NOTES, INITIAL_SUBJECTS, INITIAL_ARTICLES } from '@hritikpedia/shared/data';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hritikpedia.vercel.app';
  const currentDate = new Date().toISOString();

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

  // Dynamic Subjects
  const subjectPages = INITIAL_SUBJECTS.map((sub) => ({
    url: `${baseUrl}/subjects/${sub.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Notes
  const notePages = INITIAL_NOTES.map((note) => ({
    url: `${baseUrl}/notes/${note.slug}`,
    lastModified: note.publishedAt || currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
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
