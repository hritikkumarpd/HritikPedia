import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NoteCard from '../components/NoteCard';
import NeoBookShowcase from '../components/NeoBookShowcase';
import { getCatalogNotes } from '../lib/catalog';
import {
  ArrowRight,
  GraduationCap,
  BookOpen,
  Laptop,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  FileText,
  Zap,
  CheckCircle2,
  Users,
  Compass,
  Check,
  X as XIcon,
} from 'lucide-react';

export const metadata = {
  title: 'Hritikpedia — Master Computer Science With Precision Notes',
  description:
    'Exam-wise Computer Science revision notes, diagrams, solved PYQs and mock tests for Bihar STET, BPSC, GATE CSE, and engineering students.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Hritikpedia — Master Computer Science With Precision Notes',
    description:
      'Exam-wise Computer Science revision notes, diagrams, solved PYQs and mock tests for Bihar STET, BPSC, GATE CSE, and engineering students.',
    url: '/',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Hritikpedia — Study Notes, PYQs & Mock Tests',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hritikpedia — Master Computer Science With Precision Notes',
    description:
      'Exam-wise Computer Science revision notes, diagrams, solved PYQs and mock tests for Bihar STET, BPSC, GATE CSE, and engineering students.',
    images: ['/logo.png'],
  },
};

export const revalidate = 300;

const HOME_FAQS = [
  {
    q: 'What is Hritikpedia and how does it help Computer Science students?',
    a: 'Hritikpedia is an open-access educational repository and revision platform designed for engineering and competitive examination candidates. It distills complex Computer Science curriculums—including DBMS, Operating Systems, Computer Networks, and Digital Logic—into syllabus-mapped chapter notes, verified past-year questions (PYQs), and timed evaluative mock tests.',
  },
  {
    q: 'How can I prepare for Bihar STET Computer Science Paper-II using Hritikpedia?',
    a: 'Hritikpedia provides a comprehensive preparation module for Bihar STET Paper-II Computer Science. The curriculum covers digital logic truth tables, relational database normalization, process scheduling algorithms, and pedagogical computer concepts mapped directly to the official BSEB examination blueprint with step-by-step solved past questions.',
  },
  {
    q: 'Are the study notes and revision sheets on Hritikpedia free to read?',
    a: 'Yes. Hritikpedia operates on a zero-budget-first mission, offering complete full-length revision handbooks, formula cheat sheets, and blueprints completely free of charge in our open-access library. Selected advanced study packs are available for nominal one-time fees with lifetime updates and zero subscriptions.',
  },
  {
    q: 'Does Hritikpedia offer mock tests with instant score analytics?',
    a: 'Yes. The Hritikpedia Mock Test Center provides interactive, timed practice examination papers simulating real Bihar STET and BPSC test environments. Candidates receive immediate performance breakdowns, accuracy rates, and detailed step-by-step answer keys upon test submission.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: HOME_FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
};

const EXAM_MODULES = [
  {
    title: 'Bihar STET (Paper-II)',
    subtitle: 'Computer Science Core',
    desc: 'Topic-wise revision notes, truth tables, circuit diagrams and solved PYQ bank for Paper-II.',
    tag: 'Syllabus Complete',
    icon: GraduationCap,
    href: '/notes?exam=bihar-stet',
  },
  {
    title: 'BPSC Computer Teacher',
    subtitle: 'TRE 3.0 & 4.0 Syllabus',
    desc: 'CS core pedagogy, high-yield concept summaries and 5-year trend analysis for government recruitment.',
    tag: 'Updated 2026',
    icon: BookOpen,
    href: '/notes?exam=bpsc',
  },
  {
    title: 'Computer Science Core',
    subtitle: 'University & Degree',
    desc: 'Deep conceptual notes for Operating Systems, DBMS, Computer Networks, COA and Algorithms.',
    tag: 'B.Tech / MCA',
    icon: Laptop,
    href: '/notes?domain=engineering',
  },
  {
    title: 'Evaluative Mock Tests',
    subtitle: 'Real Exam Interface',
    desc: 'Simulated examination papers with instant performance analytics, question breakdown, and answer keys.',
    tag: 'Instant Score',
    icon: FileCheck2,
    href: '/tests',
  },
  {
    title: 'Formula & Revision Sheets',
    subtitle: 'Zero-Cost Handbooks',
    desc: 'Condensed cheat sheets, memory maps, and formula blueprints available free for all students.',
    tag: '100% Free',
    icon: Sparkles,
    href: '/free-resources',
  },
  {
    title: 'GATE CSE & PSUs',
    subtitle: 'Advanced Problem Solving',
    desc: 'Numerical shortcuts, algorithmic time-complexity sheets, and rigorous conceptual breakdowns.',
    tag: 'High Yield',
    icon: ShieldCheck,
    href: '/notes',
  },
];

const COMPARISON_POINTS = [
  {
    feature: 'Content Structure',
    traditional: 'Dense, narrative paragraphs across 900+ pages',
    hritikpedia: 'Bullet points, memory tables & verified diagrams',
  },
  {
    feature: 'PYQ Integration',
    traditional: 'Separate question books without solutions',
    hritikpedia: 'Directly mapped topic-wise with step-by-step proofs',
  },
  {
    feature: 'Reading Platform',
    traditional: 'Bulky physical books or poorly scanned PDFs',
    hritikpedia: 'Clean digital web reader + downloadable offline PDF',
  },
  {
    feature: 'Syllabus Alignment',
    traditional: 'Generic theory without exam prioritization',
    hritikpedia: 'Strictly mapped to Bihar STET & BPSC notification syllabus',
  },
];

export default async function HomePage() {
  const allNotes = await getCatalogNotes();
  const featuredNotes = allNotes.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />

      <main id="main-content" className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Hero Copy */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 text-xs font-bold text-blue-700 dark:text-blue-300">
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  <span>Bihar STET &amp; BPSC CSE 2026 Ready</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                  The Definitive Computer Science &amp; Engineering Study Library.
                </h1>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Syllabus-mapped study notes, verified past-year questions, interactive diagrams,
                  and live mock tests — engineered for high retention and exam readiness.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                  <Link
                    href="/notes"
                    className="btn btn-primary btn-lg w-full sm:w-auto"
                  >
                    <span>Browse Study Notes</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/tests"
                    className="btn btn-secondary btn-lg w-full sm:w-auto"
                  >
                    <span>Explore Mock Tests</span>
                  </Link>
                  <Link
                    href="/free-resources"
                    className="btn btn-ghost btn-lg w-full sm:w-auto text-xs font-semibold"
                  >
                    <span>Free Resources →</span>
                  </Link>
                </div>

                {/* Trust Points Ribbon */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Syllabus Mapped</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>100% Verified PYQs</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 col-span-2 sm:col-span-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Instant PDF Download</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Edition */}
              <div className="lg:col-span-5">
                <NeoBookShowcase />
              </div>
            </div>
          </div>
        </section>

        {/* 2. EXAM MODULES SECTION */}
        <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <span className="eyebrow">Curated Programs</span>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Targeted Exam Preparation Modules
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Select your target examination or academic degree to access focused resources.
                </p>
              </div>

              <Link
                href="/subjects"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
              >
                <span>View All Subjects</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {EXAM_MODULES.map((module) => {
                const Icon = module.icon;
                return (
                  <Link
                    key={module.title}
                    href={module.href}
                    className="card p-5 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                          {module.tag}
                        </span>
                      </div>

                      <h3 className="mt-3.5 font-display text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-xs font-semibold text-blue-600/80 dark:text-blue-400/80">
                        {module.subtitle}
                      </p>
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {module.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                      <span>Explore Notes</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. FEATURED STUDY PACKS */}
        <section className="py-12 sm:py-16 bg-white/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <span className="eyebrow">Top Rated Notes</span>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Featured Computer Science Study Packs
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Comprehensive notes with verified diagrams, sample pages, and instant web reader access.
                </p>
              </div>

              <Link
                href="/notes"
                className="btn btn-secondary btn-sm"
              >
                <span>Browse Full Catalog ({allNotes.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredNotes.map((note, idx) => (
                <NoteCard key={note.id || note.slug} note={note} rank={idx + 1} />
              ))}
            </div>
          </div>
        </section>

        {/* 4. METHODOLOGY & COMPARISON */}
        <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <span className="eyebrow">The Editorial Standard</span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Why Engineering Students Prepare With Hritikpedia
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                A comparison between traditional textbook preparation and our high-yield revision architecture.
              </p>
            </div>

            <div className="max-w-4xl mx-auto overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="grid grid-cols-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                <div className="col-span-4">Aspect</div>
                <div className="col-span-4 text-slate-400">Traditional Textbooks</div>
                <div className="col-span-4 text-blue-600 dark:text-blue-400">Hritikpedia Study Packs</div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {COMPARISON_POINTS.map((item) => (
                  <div key={item.feature} className="grid grid-cols-12 p-4 text-xs items-center gap-2">
                    <div className="col-span-4 font-bold text-slate-900 dark:text-white">
                      {item.feature}
                    </div>
                    <div className="col-span-4 text-slate-500 flex items-start gap-1.5">
                      <XIcon className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{item.traditional}</span>
                    </div>
                    <div className="col-span-4 text-slate-800 dark:text-slate-200 font-semibold flex items-start gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item.hritikpedia}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. MOCK TESTS & REVISION SHEETS CALLOUT */}
        <section className="py-12 sm:py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Test Series Banner */}
              <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="eyebrow text-blue-700 dark:text-blue-300">
                    Live Testing Engine
                  </span>
                  <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Simulate Official Exam Conditions
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Practice with timed mock papers mapped question-by-question to official STET &amp;
                    BPSC test patterns. Instant accuracy reports and detailed solutions.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-blue-100 dark:border-blue-900/40">
                  <Link
                    href="/tests"
                    className="btn btn-primary"
                  >
                    <span>Launch Test Center</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Free Resources Banner */}
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="eyebrow text-emerald-700 dark:text-emerald-300">
                    Open Access Library
                  </span>
                  <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Free Quick Revision Sheets &amp; Handbooks
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Zero-cost formula cheat sheets, SQL query syntaxes, logic gate truth tables,
                    and networking protocol cheat sheets ready for download.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-emerald-100 dark:border-emerald-900/40">
                  <Link
                    href="/free-resources"
                    className="btn btn-secondary border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/50"
                  >
                    <span>Download Free Sheets</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FREQUENTLY ASKED QUESTIONS (AEO & FEATURED ANSWERS) */}
        <section className="py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="eyebrow">Answer Center</span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Direct answers to common questions regarding syllabus coverage, exam preparation, and study materials.
              </p>
            </div>

            <div className="space-y-4">
              {HOME_FAQS.map((faq, idx) => (
                <div
                  key={faq.q}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs"
                >
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-xs font-black text-blue-600 dark:text-blue-400">
                      Q{idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 pl-9">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
