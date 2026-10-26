import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import AdSlot from '../../../components/AdSlot';
import { getCatalogArticleBySlug } from '../../../lib/catalog';
import { renderArticleContent } from '../../../lib/markdown';
import { Clock3, Calendar, BookOpen, ArrowRight, ArrowLeft, PenLine, Sparkles } from 'lucide-react';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const article = await getCatalogArticleBySlug(resolvedParams.slug);
  if (!article) return { title: 'Article Not Found' };

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://hritikpedia.vercel.app').replace(/\/$/, '');
  const articleUrl = `${baseUrl}/articles/${article.slug}`;

  return {
    title: `${article.title} — Educational Guide`,
    description: article.excerpt,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      title: `${article.title} | Hritikpedia`,
      description: article.excerpt,
      url: articleUrl,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `${article.title} — Hritikpedia Guide`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} | Hritikpedia`,
      description: article.excerpt,
      images: ['/logo.png'],
    },
  };
}

export default async function ArticleDetailPage({ params }) {
  const resolvedParams = await params;
  const article = await getCatalogArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://hritikpedia.vercel.app').replace(/\/$/, '');
  const articleUrl = `${baseUrl}/articles/${article.slug}`;

  const publishedLabel = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${articleUrl}/#article`,
        headline: article.title,
        description: article.excerpt,
        datePublished: article.publishedAt,
        mainEntityOfPage: articleUrl,
        image: `${baseUrl}/logo.png`,
        author: {
          '@type': 'Person',
          name: article.author || 'Hritik Kumar',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Hritikpedia',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${articleUrl}/#breadcrumb`,
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
            name: 'Articles',
            item: `${baseUrl}/articles`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: articleUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main-content" className="flex-1">
        {/* Editorial header */}
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-10 sm:py-14">
          <div className="container-narrow relative">
            <nav
              className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span className="opacity-40">/</span>
              <Link href="/articles" className="hover:text-primary transition-colors">
                Articles
              </Link>
              <span className="opacity-40">/</span>
              <span className="max-w-[14rem] truncate text-slate-900 dark:text-white">{article.title}</span>
            </nav>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <span className="badge badge-primary">{article.category}</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                <Clock3 className="h-3.5 w-3.5" />
                {article.readingTime}
              </span>
              {publishedLabel && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  {publishedLabel}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {article.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              {article.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xs font-bold text-white shadow-sm">
                  HK
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{article.author}</p>
                  <p className="text-xs text-slate-500">
                    Computer Science Educator &amp; Mentor
                  </p>
                </div>
              </div>

              <Link
                href="/articles"
                className="btn btn-secondary btn-sm inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                All Articles
              </Link>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="container-narrow">
            <AdSlot slotId="article_inline" />

            <article className="card mt-6 overflow-hidden border border-slate-200 dark:border-slate-800 p-0 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-6 py-3.5">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <PenLine className="h-3.5 w-3.5" />
                  Verified Educational Analysis
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {article.category}
                </span>
              </div>

              <div className="p-6 sm:p-10 lg:p-12">
                <div
                  className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-code:text-primary"
                  dangerouslySetInnerHTML={{ __html: renderArticleContent(article.content || '') }}
                />
              </div>
            </article>

            {/* Bridge to notes */}
            <div className="relative mt-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary to-indigo-700 p-6 sm:p-8 text-white shadow-md">
              <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Reinforce This Topic
                  </span>
                  <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Master this subject with syllabus notes &amp; PYQs
                  </h3>
                  <p className="mt-1.5 max-w-lg text-xs sm:text-sm leading-relaxed text-blue-100">
                    High-yield revision sheets, verified code snippets, and model answers ready for rapid revision in our web reader.
                  </p>
                </div>
                <Link href="/notes" className="btn bg-white hover:bg-slate-100 text-slate-900 font-bold shrink-0 shadow-sm">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Explore Notes
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4">
              <p className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <Sparkles className="h-4 w-4 text-amber-500" />
                New preparation guides and strategy roadmaps are published weekly.
              </p>
              <Link
                href="/articles"
                className="text-xs font-bold text-primary hover:underline"
              >
                Browse All Guides
              </Link>
            </div>

            <div className="mt-6">
              <AdSlot slotId="article_bottom" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
