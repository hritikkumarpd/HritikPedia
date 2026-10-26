import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import SectionHeading from '../../components/SectionHeading';
import AdSlot from '../../components/AdSlot';
import { getCatalogArticles } from '../../lib/catalog';
import { FileText, Clock3, ArrowRight, PenLine, BookOpen, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Educational Articles & Preparation Guides',
  description:
    'Read original technical articles, exam preparation roadmaps, and conceptual deep-dives on Computer Science fundamentals written by Hritikpedia educators.',
  alternates: {
    canonical: '/articles',
  },
  openGraph: {
    title: 'Educational Articles & Preparation Guides | Hritikpedia',
    description:
      'Read original technical articles, exam preparation roadmaps, and conceptual deep-dives on Computer Science fundamentals written by Hritikpedia educators.',
    url: '/articles',
    type: 'website',
  },
};

export default async function ArticlesPage() {
  const articles = await getCatalogArticles();
  const [lead, ...rest] = articles;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />

      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow="Editorial & Study Guides"
          title={
            <>
              High-Yield Strategy &amp; <span className="text-primary">Exam Blueprints</span>
            </>
          }
          description="In-depth conceptual breakdowns, syllabus roadmaps, and authentic study systems designed to maximize retention for engineering and competitive examinations."
          breadcrumbs={[{ label: 'Articles & Guides' }]}
          aside={
            <div className="grid grid-cols-2 gap-3.5">
              <div className="card p-4 border border-slate-200 dark:border-slate-800">
                <PenLine className="h-5 w-5 text-primary" />
                <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                  {articles.length}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Published Guides
                </p>
              </div>
              <div className="card p-4 border border-slate-200 dark:border-slate-800">
                <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                  100%
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Free Access
                </p>
              </div>
              <div className="col-span-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 px-3.5 py-2.5">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Written directly by HritikPedia academic mentors
                </p>
              </div>
            </div>
          }
        />

        <section className="py-10 sm:py-14">
          <div className="container-page">
            <AdSlot slotId="home_top" />

            {articles.length === 0 ? (
              <div className="card mx-auto mt-8 max-w-md p-10 text-center border border-slate-200 dark:border-slate-800">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <FileText className="h-7 w-7" />
                </span>
                <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  New Articles Coming Soon
                </h2>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Our academic team is drafting new high-yield preparation roadmaps. Check back shortly.
                </p>
                <Link href="/notes" className="btn btn-primary btn-sm mt-6 inline-flex items-center gap-1.5">
                  Explore Study Notes
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-8">
                  <SectionHeading
                    eyebrow="Featured Reading"
                    title="Latest Preparation Deep-Dives"
                    description="Structured guides breaking down tough topics and high-weightage question types."
                  />
                </div>

                {lead && (
                  <Link
                    href={`/articles/${lead.slug}`}
                    className="group card card-hover relative mb-8 grid overflow-hidden border border-slate-200 dark:border-slate-800 p-0 shadow-sm lg:grid-cols-[1.2fr_0.8fr]"
                  >
                    <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="badge badge-primary">{lead.category}</span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                            <Clock3 className="h-3.5 w-3.5" />
                            {lead.readingTime}
                          </span>
                          <span className="badge badge-secondary">Featured Article</span>
                        </div>

                        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                          {lead.title}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                          {lead.excerpt}
                        </p>
                      </div>

                      <div className="mt-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                        <span className="text-xs font-medium text-slate-500">
                          By <strong className="text-slate-800 dark:text-slate-200">{lead.author}</strong>
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                          Read Complete Guide
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>

                    <div className="relative hidden items-center justify-center border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-8 lg:flex">
                      <div className="relative w-full max-w-[16rem] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-md transition-transform group-hover:scale-[1.02]">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            HritikPedia Guide
                          </span>
                          <PenLine className="h-3.5 w-3.5 text-amber-500" />
                        </div>
                        <p className="mt-3 text-sm font-bold leading-snug text-slate-900 dark:text-white line-clamp-2">
                          {lead.title}
                        </p>
                        <div className="mt-4 space-y-1.5 opacity-60">
                          <span className="block h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-600" />
                          <span className="block h-1.5 w-5/6 rounded-full bg-slate-200 dark:bg-slate-600" />
                          <span className="block h-1.5 w-4/6 rounded-full bg-slate-200 dark:bg-slate-600" />
                        </div>
                        <p className="mt-4 text-[10px] font-semibold uppercase text-slate-400">
                          {lead.readingTime} • Verified
                        </p>
                      </div>
                    </div>
                  </Link>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article) => (
                    <article key={article.id} className="group card card-hover flex flex-col p-6 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="badge badge-secondary">{article.category}</span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                          <Clock3 className="h-3.5 w-3.5" />
                          {article.readingTime}
                        </span>
                      </div>

                      <h2 className="mt-4 text-lg font-bold leading-snug tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                      </h2>

                      <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {article.excerpt}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3.5 text-xs">
                        <span className="font-medium text-slate-500">
                          By <span className="text-slate-700 dark:text-slate-300">{article.author}</span>
                        </span>
                        <Link
                          href={`/articles/${article.slug}`}
                          className="inline-flex items-center gap-1 font-bold text-primary"
                          aria-label={`Read ${article.title}`}
                        >
                          Read
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
