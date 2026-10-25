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
  const domainFilter = searchParams.get('domain');
  const mediumFilter = searchParams.get('medium');
  const targetFilter = searchParams.get('target');

  // If no search query and no filters, return empty
  if (!q && !domainFilter && !mediumFilter && !targetFilter) {
    return NextResponse.json({ notes: [], subjects: [], articles: [] });
  }

  // Filter notes across title, description, subjectName, topic, targetExamOrBoard, department, medium
  const matchedNotes = INITIAL_NOTES.filter((n) => {
    if (domainFilter && n.domain !== domainFilter) return false;
    if (mediumFilter && n.medium !== mediumFilter) return false;
    if (targetFilter && n.targetExamOrBoard?.toLowerCase() !== targetFilter.toLowerCase()) return false;

    if (!q) return true;

    return (
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.subjectName.toLowerCase().includes(q) ||
      (n.topic && n.topic.toLowerCase().includes(q)) ||
      (n.targetExamOrBoard && n.targetExamOrBoard.toLowerCase().includes(q)) ||
      (n.department && n.department.toLowerCase().includes(q)) ||
      (n.medium && n.medium.toLowerCase().includes(q)) ||
      (n.topicsCovered && n.topicsCovered.some((t) => t.toLowerCase().includes(q)))
    );
  }).slice(0, 10);

  // Filter subjects
  const matchedSubjects = INITIAL_SUBJECTS.filter((s) => {
    if (domainFilter && s.domain !== domainFilter) return false;
    if (targetFilter && s.targetExamOrBoard?.toLowerCase() !== targetFilter.toLowerCase()) return false;

    if (!q) return true;

    return (
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      (s.targetExamOrBoard && s.targetExamOrBoard.toLowerCase().includes(q)) ||
      (s.department && s.department.toLowerCase().includes(q))
    );
  }).slice(0, 6);

  // Filter articles
  const matchedArticles = !q
    ? []
    : INITIAL_ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      ).slice(0, 4);

  return NextResponse.json({
    query: q,
    filters: {
      domain: domainFilter || null,
      medium: mediumFilter || null,
      target: targetFilter || null,
    },
    notes: matchedNotes,
    subjects: matchedSubjects,
    articles: matchedArticles,
  });
}
