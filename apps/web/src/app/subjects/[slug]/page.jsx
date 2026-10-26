import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import NoteCard from '../../../components/NoteCard';
import PageHero from '../../../components/PageHero';
import SectionHeading from '../../../components/SectionHeading';
import AdSlot from '../../../components/AdSlot';
import {
  getCatalogNotes,
  getCatalogSubjectBySlug,
  getCatalogSubjects,
} from '../../../lib/catalog';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';

const DOMAIN_LABELS = {
  engineering: 'Engineering & CSE',
  general_competitions: 'Government Exams',
  school_boards: 'School Boards',
  general_degree: 'Degree & University',
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const subject = await getCatalogSubjectBySlug(resolvedParams.slug);
  if (!subject) return { title: 'Subject Not Found' };

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://hritikpedia.vercel.app').replace(/\/$/, '');
  const subjectUrl = `${baseUrl}/subjects/${subject.slug}`;
  const title = `${subject.name} Notes & Syllabus Guide | Hritikpedia`;
  const description = `Read verified study notes, chapter summaries, and solved previous-year questions for ${subject.name} on Hritikpedia.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/subjects/${subject.slug}`,
    },
    openGraph: {
      title,
      description,
      url: subjectUrl,
      type: 'website',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `${subject.name} — Hritikpedia Subject Notes`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/logo.png'],
    },
  };
}

export default async function SubjectDetailPage({ params }) {
  const resolvedParams = await params;
  const [subject, allNotes, allSubjects] = await Promise.all([
    getCatalogSubjectBySlug(resolvedParams.slug),
    getCatalogNotes(),
    getCatalogSubjects(),
  ]);

  if (!subject) {
    notFound();
  }

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://hritikpedia.vercel.app').replace(/\/$/, '');
  const subjectUrl = `${baseUrl}/subjects/${subject.slug}`;

  const subjectNotes = allNotes.filter(
    (n) => n.subjectSlug === subject.slug || n.subjectId === subject.id
  );

  const freeCount = subjectNotes.filter(
    (n) => n.isFree || Number(n.price) === 0
  ).length;

  const relatedSubjects = allSubjects
    .filter((s) => s.id !== subject.id && s.domain === subject.domain)
    .slice(0, 4);
  const fallbackRelated = allSubjects.filter((s) => s.id !== subject.id).slice(0, 4);
  const related = relatedSubjects.length > 0 ? relatedSubjects : fallbackRelated;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Course',
        '@id': `${subjectUrl}/#course`,
        name: subject.name,
        description:
          subject.description ||
          `Comprehensive study notes, diagrams, and past year questions for ${subject.name}.`,
        provider: {
          '@type': 'Organization',
          name: 'Hritikpedia',
          url: baseUrl,
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: `${subjectNotes.length} curated study modules`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${subjectUrl}/#breadcrumb`,
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
            name: 'Subjects',
            item: `${baseUrl}/subjects`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: subject.name,
            item: subjectUrl,
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

      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow={DOMAIN_LABELS[subject.domain] || 'Computer Science Subject'}
          title={subject.name}
          description={
            subject.description ||
            `Curated chapter notes, circuit diagrams, and solved previous year questions for ${subject.name}.`
          }
          breadcrumbs={[
            { label: 'Subjects', href: '/subjects' },
            { label: subject.name },
          ]}
          aside={
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Subject Dossier
                </span>
                <span className="badge badge-royal">Active Curriculum</span>
              </div>
              <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs py-1">
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-slate-600 dark:text-slate-400">Available study packs</dt>
                  <dd className="font-display text-base font-extrabold text-slate-900 dark:text-white">
                    {subjectNotes.length}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-slate-600 dark:text-slate-400">Free resources</dt>
                  <dd className="font-display text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {freeCount}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 py-2.5">
                  <dt className="shrink-0 text-slate-600 dark:text-slate-400">Target examination</dt>
                  <dd className="truncate text-right font-semibold text-slate-700 dark:text-slate-300">
                    {subject.targetExamOrBoard || subject.code || 'All CSE Exams'}
                  </dd>
                </div>
              </dl>
              <Link
                href={`/notes?subject=${subject.slug}`}
                className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
              >
                <span>Filter all notes by {subject.name}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          }
        >
          <div className="flex flex-wrap items-center gap-2">
            {subject.code && (
              <span className="badge badge-slate">
                Code: {subject.code}
              </span>
            )}
            <Link href={`/notes?subject=${subject.slug}`} className="btn btn-secondary btn-sm">
              <span>View in Library</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </PageHero>

        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Study Packs"
              title={`${subject.name} Revision Material`}
              description="Chapter notes, PYQ packs and revision sheets for this subject. All paid packs include instant free sample pages."
              action={{ label: 'Browse All Notes', href: '/notes' }}
            />

            {subjectNotes.length === 0 ? (
              <div className="card p-8 sm:p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  Notes for this subject are currently being compiled
                </h3>
                <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Our team is authoring verified notes for {subject.name}. Explore other subjects or download free formula sheets in the meantime.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Link href="/notes" className="btn btn-primary btn-sm">
                    Browse All Notes
                  </Link>
                  <Link href="/free-resources" className="btn btn-secondary btn-sm">
                    Free Resources
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subjectNotes.map((note) => (
                  <NoteCard key={note.id || note.slug} note={note} />
                ))}
              </div>
            )}

            <div className="mt-10">
              <AdSlot slotId="subject_between_content" />
            </div>

            {related.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                <SectionHeading
                  eyebrow="Related Fields"
                  title="Explore Other Subjects"
                  action={{ label: 'All Subjects', href: '/subjects' }}
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/subjects/${rel.slug}`}
                      className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between group transition-all"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {rel.code || DOMAIN_LABELS[rel.domain] || 'Subject'}
                        </span>
                        <h4 className="mt-1 font-display text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {rel.name}
                        </h4>
                      </div>
                      <span className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>
                          {Number(rel.noteCount) > 0
                            ? `${rel.noteCount} ${Number(rel.noteCount) === 1 ? 'pack' : 'packs'}`
                            : 'In progress'}
                        </span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
