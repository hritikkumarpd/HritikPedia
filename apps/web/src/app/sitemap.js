import {
  getCatalogNotes,
  getCatalogSubjects,
  getCatalogArticles,
} from '../lib/catalog';

// Keep note/article URLs fresh after admin catalogue changes.
export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://hritikpedia.vercel.app').replace(/\/$/, '');
  const currentDate = new Date();

  const staticPages = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/notes', changeFrequency: 'daily', priority: 0.9 },
    { path: '/subjects', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/free-resources', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/articles', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/tests', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/refund-policy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/advertising-disclosure', changeFrequency: 'yearly', priority: 0.3 },
  ].map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const [notes, subjects, articles] = await Promise.all([
    getCatalogNotes(),
    getCatalogSubjects(),
    getCatalogArticles(),
  ]);

  const subjectPages = subjects.map((subject) => ({
    url: `${baseUrl}/subjects/${subject.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const notePages = notes.map((note) => ({
    url: `${baseUrl}/notes/${note.slug}`,
    lastModified: note.publishedAt ? new Date(note.publishedAt) : currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.publishedAt ? new Date(article.publishedAt) : currentDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...subjectPages, ...notePages, ...articlePages];
}
