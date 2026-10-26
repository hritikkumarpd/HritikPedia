import { NextResponse } from 'next/server';
import { getCatalogNoteBySlug } from '../../../../lib/catalog';

/**
 * Public, read-only note metadata used by the checkout page and quick view.
 * It deliberately exposes no file keys or protected content.
 */
export async function GET(request, { params }) {
  const resolvedParams = await params;
  const note = await getCatalogNoteBySlug(resolvedParams.slug);

  if (!note) {
    return NextResponse.json({ error: 'Study note not found' }, { status: 404 });
  }

  return NextResponse.json({
    note: {
      id: note.id,
      title: note.title,
      slug: note.slug,
      subtitle: note.subtitle,
      description: note.description,
      subjectName: note.subjectName,
      subjectSlug: note.subjectSlug,
      examCategory: note.examCategory,
      pageCount: note.pageCount,
      isFree: note.isFree,
      price: note.price,
      originalPrice: note.originalPrice,
      hasPreview: note.hasPreview,
      previewPages: note.previewPages,
      rating: note.rating,
      topicsCovered: note.topicsCovered,
      color: note.color,
    },
  });
}
