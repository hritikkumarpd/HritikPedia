import { NextResponse } from 'next/server';
import { INITIAL_NOTES, INITIAL_SUBJECTS, INITIAL_ARTICLES } from '@hritikpedia/shared/data';
import { checkRateLimit } from '@hritikpedia/shared/audit';

export async function GET(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rate = checkRateLimit(`search_${ip}`, 60, 60);

  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Search rate limit exceeded. Please wait a moment.' },
      { status: 429, headers: { 'Retry-After': String(rate.resetSeconds) } }
    );
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ notes: [], subjects: [], articles: [] });
  }

  // Filter notes
  const matchedNotes = INITIAL_NOTES.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.subjectName.toLowerCase().includes(q) ||
      n.topic.toLowerCase().includes(q)
  ).slice(0, 5);

  // Filter subjects
  const matchedSubjects = INITIAL_SUBJECTS.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q)
  ).slice(0, 4);

  // Filter articles
  const matchedArticles = INITIAL_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
  ).slice(0, 4);

  return NextResponse.json({
    query: q,
    notes: matchedNotes,
    subjects: matchedSubjects,
    articles: matchedArticles,
  });
}
