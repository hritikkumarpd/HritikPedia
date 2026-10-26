import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import SectionHeading from '../../components/SectionHeading';
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  Award,
  CheckCircle2,
  ArrowRight,
  Layers,
  FileText,
  PenLine,
  Library,
  GraduationCap,
} from 'lucide-react';
import { getCatalogNotes, getCatalogSubjects, getCatalogArticles } from '../../lib/catalog';

export const metadata = {
  title: 'About HritikPedia — Stop Searching. Start Learning.',
  description:
    'Learn about HritikPedia, an educational platform providing high-yield Computer Science study notes, exam blueprints, and watermarked reading with a zero-budget-first mission.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About HritikPedia — Stop Searching. Start Learning.',
    description:
      'High-yield Computer Science study notes, exam blueprints, and syllabus-mapped reading designed with a zero-budget-first educational mission.',
    url: '/about',
    type: 'website',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'About Hritikpedia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About HritikPedia — Stop Searching. Start Learning.',
    description:
      'High-yield Computer Science study notes, exam blueprints, and syllabus-mapped reading designed with a zero-budget-first educational mission.',
    images: ['/logo.png'],
  },
};

export const revalidate = 300;

const VALUES = [
  {
    icon: Award,
    title: 'Authentic Data Only',
    copy: 'We never fabricate student testimonials, fake pass rates, or simulated reviews. Every resource represents verified academic curriculum notes.',
  },
  {
    icon: ShieldCheck,
    title: 'Protected Student Learning',
    copy: 'Our in-browser reader secures academic materials while providing student-specific dynamic watermarking and an uninterrupted reading experience.',
  },
  {
    icon: Sparkles,
    title: 'Zero-Budget-First Philosophy',
    copy: 'Engineered with modern, hyper-efficient open-source web technologies so high-quality educational notes remain accessible to every student starting from ₹0.',
  },
];

const STANDARDS = [
  'Every note is authored directly against the official syllabus or examination blueprint it claims to cover.',
  'Solved numerical problems and proofs are worked end-to-end — zero skipped steps or unstated assumptions.',
  'Free shelf packs are complete, uncompromised handbooks, never promotional teasers cut short.',
  'If a specific paper or syllabus unit is still under editorial review, it is labeled accurately.',
];

export default async function AboutPage() {
  const [notes, subjects, articles] = await Promise.all([
    getCatalogNotes(),
    getCatalogSubjects(),
    getCatalogArticles(),
  ]);

  const freeCount = notes.filter((n) => n.isFree || Number(n.price) === 0).length;

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://hritikpedia.vercel.app').replace(/\/$/, '');
  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${baseUrl}/about/#webpage`,
        url: `${baseUrl}/about`,
        name: 'About Hritikpedia',
        description: 'Educational platform providing high-yield Computer Science study notes and exam blueprints.',
        isPartOf: { '@id': `${baseUrl}/#website` },
        about: {
          '@type': 'Person',
          name: 'Hritik Kumar',
          jobTitle: 'Founder & Lead Educator',
          description:
            'Computer Science educator specializing in database systems, operating systems, and competitive examination preparation.',
          sameAs: [
            'https://linkedin.com/company/hritikpedia',
            'https://x.com/hritikpedia',
            'https://youtube.com/@hritikpedia',
          ],
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}/about/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'About', item: `${baseUrl}/about` },
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <Header />

      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow="Mission & Vision"
          title={
            <>
              Stop Searching. <span className="text-primary">Start Mastering.</span>
            </>
          }
          description="HritikPedia removes the clutter between students and their goals. Structured, syllabus-aligned study modules and solved PYQs instead of disorganized slide decks and dead links."
          breadcrumbs={[{ label: 'About Us' }]}
          aside={
            <div className="grid grid-cols-2 gap-3.5">
              <div className="card p-4 border border-slate-200 dark:border-slate-800">
                <Library className="h-5 w-5 text-primary" />
                <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                  {notes.length}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Study Packs
                </p>
              </div>
              <div className="card p-4 border border-slate-200 dark:border-slate-800">
                <Layers className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                  {subjects.length}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Subjects Mapped
                </p>
              </div>
              <div className="card p-4 border border-slate-200 dark:border-slate-800">
                <FileText className="h-5 w-5 text-amber-500" />
                <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                  {freeCount}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Free Packs
                </p>
              </div>
              <div className="card p-4 border border-slate-200 dark:border-slate-800">
                <PenLine className="h-5 w-5 text-primary" />
                <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                  {articles.length}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Guides Published
                </p>
              </div>
            </div>
          }
        />

        {/* Philosophy section */}
        <section className="py-12 sm:py-16">
          <div className="container-page">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] items-start">
              <div>
                <SectionHeading
                  eyebrow="The Academic Gap"
                  title="Textbooks are exhaustive. Exam papers demand precision."
                  description="Standard computer science textbooks span thousands of pages. HritikPedia distills core principles into high-density revision sheets."
                />
              </div>

              <div className="card p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  Engineering students preparing for university end-semester examinations, GATE, and competitive educator selections (such as Bihar STET Computer Science) frequently lose hours navigating fragmented lecture PDFs and forum threads rather than internalizing core concepts.
                </p>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  At HritikPedia, each module is designed for maximum conceptual clarity: relational database normalization theorems, operating system semaphore primitives, deadlock prevention proofs, network subnetting conversions, and digital logic Karnaugh maps are explained with clear diagrams and end-to-end worked problems.
                </p>

                <div className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
                  <BookOpen className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Engineered for the exam paper in front of you — not generic filler content.
                  </p>
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className="mt-16">
              <SectionHeading
                eyebrow="Core Principles"
                title="Three Standards We Never Compromise"
                description="Our operating philosophy determines what gets written, reviewed, and published."
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-8">
                {VALUES.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div key={value.title} className="card card-hover relative p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                      <span className="absolute right-5 top-5 font-mono text-xs font-bold text-slate-300 dark:text-slate-700">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </span>
                      <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                        {value.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{value.copy}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Academic Mentorship & Author Credentials (E-E-A-T) */}
            <div className="mt-16">
              <SectionHeading
                eyebrow="E-E-A-T Standards"
                title="Academic Mentorship & Editorial Leadership"
                description="Our study notes and syllabus blueprints are authored and reviewed by computer science educators with rigorous domain backgrounds."
              />

              <div className="card p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-xl shadow-md">
                    HK
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Hritik Kumar
                      </h3>
                      <span className="badge badge-primary">Lead Educator &amp; Architecture Lead</span>
                      <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        B.Tech Computer Science &amp; Engineering
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      Specializing in Relational Database Management Systems, Operating Systems Concurrency Primitives, and State Educator Examinations (Bihar STET Computer Science Paper-II &amp; BPSC Teacher Recruitment). Directs curriculum verification, diagram rendering, and past-year examination trend analyses to ensure students study verified academic syllabi rather than unorganized filler content.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-slate-500 border-t border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        CSE Core Curriculum Reviewer
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        100% Mathematical Proof Verification
                      </span>
                      <a
                        href="https://linkedin.com/company/hritikpedia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline ml-auto"
                      >
                        Academic Profile &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Standards & CTA */}
            <div className="mt-16 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="card p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="badge badge-primary">Editorial Rigor</span>
                <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Our Guarantee on Every Published Page
                </h3>
                <ul className="mt-5 space-y-3">
                  {STANDARDS.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-indigo-800 p-6 sm:p-8 text-white shadow-md flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Accessible Education
                  </span>
                  <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Start with our complete free study shelf
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-blue-100">
                    Preview all paid packs before buying, or explore complete free notes without needing a credit card or subscription.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/notes" className="btn bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-sm">
                    Browse Notes
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link href="/free-resources" className="btn btn-secondary text-xs bg-primary-dark/40 border-white/20 text-white hover:bg-white/10">
                    Free Shelf
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
