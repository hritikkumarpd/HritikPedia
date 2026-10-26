import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import NotesCatalogClient from './NotesCatalogClient';
import { getCatalogNotes, getCatalogSubjects } from '../../lib/catalog';
import { ArrowRight, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Study Notes, PYQs & Revision Sheets',
  description:
    'Browse exam-wise study notes, previous year questions, revision sheets and syllabus blueprints for Bihar STET, BPSC, GATE CSE, and engineering universities.',
  alternates: {
    canonical: '/notes',
  },
  openGraph: {
    title: 'Study Notes, PYQs & Revision Sheets | Hritikpedia',
    description:
      'Browse exam-wise study notes, previous year questions, revision sheets and syllabus blueprints for Bihar STET, BPSC, GATE CSE, and engineering universities.',
    url: '/notes',
    type: 'website',
  },
};

const DOMAIN_LABELS = {
  engineering: 'Engineering & Technical',
  general_competitions: 'General Competitions',
  school_boards: 'School Boards',
  general_degree: 'Degree & University',
};

const EXAM_LABELS = {
  'bihar-stet': 'Bihar STET Paper-II',
  bpsc: 'BPSC Computer Teacher',
  ssc: 'SSC CGL / CHSL',
  upsc: 'UPSC CSE',
  aktu: 'AKTU CSE',
  beu: 'BEU Bihar',
  cbse: 'CBSE Computer Science',
  bseb: 'BSEB 11-12 CS',
};

function normalize(value = '') {
  return String(value).toLowerCase().replace(/[-_]+/g, ' ').trim();
}

export default async function NotesPage({ searchParams }) {
  const resolvedParams = searchParams ? await searchParams : {};
  const initialCategory = resolvedParams.category || 'all';
  const domain = resolvedParams.domain || '';
  const exam = resolvedParams.exam || '';
  const subjectSlug = resolvedParams.subject || '';

  const [allNotes, subjects] = await Promise.all([getCatalogNotes(), getCatalogSubjects()]);

  let notes = allNotes;
  if (domain) notes = notes.filter((note) => note.domain === domain);
  if (subjectSlug) notes = notes.filter((note) => note.subjectSlug === subjectSlug);
  if (exam) {
    const wanted = normalize(exam);
    notes = notes.filter((note) => {
      const haystack = normalize(
        [
          note.title,
          note.targetExamOrBoard,
          note.examCategory,
          note.subjectName,
          note.subjectSlug,
        ].join(' ')
      );
      return haystack.includes(wanted);
    });
  }

  const subject = subjectSlug ? subjects.find((item) => item.slug === subjectSlug) : null;
  const examLabel = EXAM_LABELS[exam] || '';

  let heading = 'Study Notes & Exam Resources';
  let description =
    'Browse syllabus-mapped Computer Science revision packs, diagrams, and past year questions. All paid packs include instant free sample previews.';
  if (examLabel) {
    heading = `${examLabel} Study Notes`;
    description = `Syllabus-aligned notes, revision sheets and practice material for ${examLabel}. Preview pages before purchase.`;
  } else if (subject) {
    heading = `${subject.name} Notes`;
    description = subject.description || `Study material and PYQs for ${subject.name}.`;
  } else if (domain && DOMAIN_LABELS[domain]) {
    heading = `${DOMAIN_LABELS[domain]} Notes`;
    description = `Notes, PYQs and revision sheets for ${DOMAIN_LABELS[domain].toLowerCase()} students.`;
  }

  const hasActiveScope = Boolean(domain || exam || subjectSlug);
  const freeCount = allNotes.filter((note) => note.isFree || Number(note.price) === 0).length;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow="Study Notes Directory"
          title={heading}
          description={description}
          breadcrumbs={[
            { label: 'Study notes', href: '/notes' },
            ...(hasActiveScope ? [{ label: heading }] : []),
          ]}
          aside={
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Catalogue Index
                </span>
                <span className="badge badge-royal">Verified 2026</span>
              </div>
              <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs py-1">
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-slate-600 dark:text-slate-400">Published study packs</dt>
                  <dd className="font-display text-base font-extrabold text-slate-900 dark:text-white">
                    {allNotes.length}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-slate-600 dark:text-slate-400">100% Free packs</dt>
                  <dd className="font-display text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {freeCount}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-slate-600 dark:text-slate-400">Reading formats</dt>
                  <dd className="font-semibold text-slate-700 dark:text-slate-300">
                    Web Reader + Offline PDF
                  </dd>
                </div>
              </dl>
              <Link
                href="/free-resources"
                className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span>Download free revision sheets</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          }
        >
          {hasActiveScope && (
            <Link href="/notes" className="btn btn-secondary btn-sm">
              <span>Clear Filter</span>
            </Link>
          )}
        </PageHero>

        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {notes.length === 0 && hasActiveScope ? (
              <div className="mx-auto max-w-xl card p-8 sm:p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  No notes in this collection yet
                </h2>
                <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  We are continually authoring new syllabus notes. Check our full catalog or
                  download free formula sheets.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Link href="/notes" className="btn btn-primary btn-sm">
                    Browse all notes
                  </Link>
                  <Link href="/free-resources" className="btn btn-secondary btn-sm">
                    Free resources
                  </Link>
                </div>
              </div>
            ) : (
              <NotesCatalogClient
                initialNotes={notes}
                subjects={subjects}
                initialCategory={initialCategory}
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
