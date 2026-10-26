import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import AdSlot from '../../components/AdSlot';
import SubjectsCatalogClient from './SubjectsCatalogClient';
import { getCatalogSubjects } from '../../lib/catalog';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';

export const metadata = {
  title: 'Computer Science & Engineering Subjects Directory',
  description:
    'Browse organised study notes and revision material by academic domain: DBMS, Operating Systems, Computer Networks, Digital Logic, Bihar STET, and B.Tech CSE courses.',
  alternates: {
    canonical: '/subjects',
  },
  openGraph: {
    title: 'Computer Science & Engineering Subjects Directory | Hritikpedia',
    description:
      'Browse organised study notes and revision material by academic domain: DBMS, Operating Systems, Computer Networks, Digital Logic, Bihar STET, and B.Tech CSE courses.',
    url: '/subjects',
    type: 'website',
  },
};

const DOMAIN_BLURBS = {
  engineering: { label: 'Engineering & CSE', blurb: 'OS · DBMS · Networks · DSA' },
  general_competitions: { label: 'Government Exams', blurb: 'Bihar STET · BPSC Teacher' },
  school_boards: { label: 'School Boards', blurb: 'CBSE · BSEB Class 11-12 CS' },
  general_degree: { label: 'Degree & University', blurb: 'BCA · MCA · B.Sc Computer Science' },
};

export default async function SubjectsPage({ searchParams }) {
  const resolvedParams = searchParams ? await searchParams : {};
  const initialDomain = resolvedParams.domain || 'all';
  const subjects = await getCatalogSubjects();

  const totalNotes = subjects.reduce(
    (sum, subject) => sum + (Number(subject.noteCount) || 0),
    0
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow="Subject Directory"
          title="All Computer Science &amp; IT Subjects"
          description="Locate the exact course or paper you are preparing for. Each subject folder contains syllabus-mapped notes, circuit &amp; ER diagrams, and solved PYQs."
          breadcrumbs={[{ label: 'Subjects' }]}
          aside={
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Directory Overview
                </span>
                <span className="badge badge-royal">Active Catalog</span>
              </div>
              <dl className="divide-y divide-slate-100 dark:divide-slate-800 text-xs py-1">
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-slate-600 dark:text-slate-400">Subjects cataloged</dt>
                  <dd className="font-display text-base font-extrabold text-slate-900 dark:text-white">
                    {subjects.length}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-slate-600 dark:text-slate-400">Study packs published</dt>
                  <dd className="font-display text-base font-extrabold text-blue-600 dark:text-blue-400">
                    {totalNotes}
                  </dd>
                </div>
              </dl>
              <Link
                href="/notes"
                className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
              >
                <span>Browse all published notes</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          }
        />

        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdSlot slotId="subject_top" />

            <div className="mt-6">
              <SubjectsCatalogClient initialSubjects={subjects} initialDomain={initialDomain} />
            </div>

            {/* Quick Domain Navigation Bar */}
            <div className="mt-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800 shadow-xs">
              {Object.entries(DOMAIN_BLURBS).map(([domain, item]) => (
                <Link
                  key={domain}
                  href={`/notes?domain=${domain}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                >
                  <div>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.label}
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.blurb}
                    </span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
