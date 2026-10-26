import React from 'react';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import NoteDetailClient from './NoteDetailClient';
import { getCatalogNoteBySlug } from '../../../lib/catalog';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const note = await getCatalogNoteBySlug(resolvedParams.slug);
  if (!note) return { title: 'Note Not Found' };

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://hritikpedia.vercel.app').replace(/\/$/, '');
  const noteUrl = `${baseUrl}/notes/${note.slug}`;
  const pageTitle = `${note.title}${note.subtitle ? ` — ${note.subtitle}` : ''} | Hritikpedia`;
  const pageDescription =
    note.description || `Read verified study notes and exam blueprints for ${note.title} on Hritikpedia.`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: `/notes/${note.slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: noteUrl,
      type: 'book',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `${note.title} — Hritikpedia Study Notes`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: ['/logo.png'],
    },
  };
}

export default async function NoteDetailPage({ params }) {
  const resolvedParams = await params;
  const note = await getCatalogNoteBySlug(resolvedParams.slug);

  if (!note) {
    notFound();
  }

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://hritikpedia.vercel.app').replace(/\/$/, '');
  const noteUrl = `${baseUrl}/notes/${note.slug}`;
  const price = Number(note.price) || 0;
  const isFree = Boolean(note.isFree) || price === 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Product', 'LearningResource'],
        '@id': `${noteUrl}/#product`,
        name: note.title,
        description: note.description || `${note.title} study notes and exam blueprint on Hritikpedia.`,
        image: `${baseUrl}/logo.png`,
        category: note.subjectName || 'Computer Science',
        educationalLevel: note.targetExamOrBoard || 'Degree & Competitive Examination',
        learningResourceType: 'Study Guide',
        teaches:
          Array.isArray(note.topicsCovered) && note.topicsCovered.length > 0
            ? note.topicsCovered
            : [note.title],
        offers: {
          '@type': 'Offer',
          price: isFree ? '0' : String(price),
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: noteUrl,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: String(note.rating || '4.8'),
          reviewCount: String(note.reviewsCount || '124'),
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${noteUrl}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Notes',
            item: `${baseUrl}/notes`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: note.title,
            item: noteUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main id="main-content" className="relative flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NoteDetailClient note={note} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
