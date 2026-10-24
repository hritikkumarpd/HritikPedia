import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import AdSlot from '../../../components/AdSlot';
import { INITIAL_ARTICLES, INITIAL_NOTES } from '@hritikpedia/shared/data';
import {
  FileText,
  Clock,
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Share2,
} from 'lucide-react';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const article = INITIAL_ARTICLES.find((a) => a.slug === resolvedParams.slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} — Educational Guide`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | Hritikpedia`,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
  };
}

export default async function ArticleDetailPage({ params }) {
  const resolvedParams = await params;
  const article = INITIAL_ARTICLES.find((a) => a.slug === resolvedParams.slug);

  if (!article) {
    notFound();
  }

  // Related note recommendations
  const recommendedNotes = INITIAL_NOTES.slice(0, 2);

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hritikpedia',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hritikpedia.vercel.app/logo.png',
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#087BFF]">Home</Link>
            <span>/</span>
            <Link href="/articles" className="hover:text-[#087BFF]">Articles</Link>
            <span>/</span>
            <span className="text-[#07172B] font-semibold truncate max-w-[200px]">
              {article.title}
            </span>
          </nav>

          {/* Article Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#087BFF] font-bold">
                {article.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Published {article.publishedAt}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#07172B] tracking-tight leading-tight mb-4">
              {article.title}
            </h1>

            <p className="text-base text-[#64748B] leading-relaxed pb-6 border-b border-slate-100">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between pt-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#07172B] text-white flex items-center justify-center font-bold text-xs">
                  HK
                </div>
                <div>
                  <p className="font-bold text-[#07172B]">{article.author}</p>
                  <p className="text-[11px] text-slate-400">Computer Science Educator</p>
                </div>
              </div>
            </div>
          </div>

          {/* In-Article Ad Slot */}
          <AdSlot slotId="article_inline" />

          {/* Article Prose Content */}
          <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-10 prose prose-slate max-w-none text-[#26354B] leading-relaxed text-sm sm:text-base">
            <div
              className="space-y-4"
              dangerouslySetInnerHTML={{
                __html: article.content
                  .replace(/### (.*?)\n/g, '<h3 class="text-xl font-bold text-[#07172B] mt-6 mb-2">$1</h3>')
                  .replace(/## (.*?)\n/g, '<h2 class="text-2xl font-black text-[#07172B] mt-8 mb-3">$1</h2>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#07172B]">$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                  .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-slate-100 text-[#087BFF] font-mono text-xs rounded border border-slate-200">$1</code>')
                  .replace(/\n\n/g, '<p class="mt-3 leading-relaxed text-[#26354B]">')
                  .replace(/^- (.*)/gm, '<li class="ml-4 list-disc text-[#26354B]">$1</li>'),
              }}
            />
          </article>

          {/* Recommended Study Notes Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 sm:p-8 mb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#087BFF] uppercase tracking-wider block mb-1">
                  Reinforce Your Learning
                </span>
                <h3 className="text-lg font-bold text-[#07172B]">
                  Download Chapter Notes &amp; Solved PYQs
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-lg">
                  Access complete revision sheets, formulas, and verified diagrams for this subject inside our secure online reader.
                </p>
              </div>
              <Link
                href="/notes"
                className="shrink-0 px-5 py-2.5 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Study Notes</span>
              </Link>
            </div>
          </div>

          {/* Bottom Ad Slot */}
          <AdSlot slotId="article_bottom" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
