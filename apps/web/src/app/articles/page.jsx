import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import { INITIAL_ARTICLES } from '@hritikpedia/shared/data';
import { FileText, Clock, User, ArrowRight, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Educational Articles & Preparation Guides',
  description:
    'Read original technical articles, exam preparation roadmaps, and conceptual deep-dives on Computer Science fundamentals written by Hritikpedia educators.',
};

export default function ArticlesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#087BFF] text-xs font-bold mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>Editorial &amp; Insights</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#07172B] tracking-tight">
              Educational Articles &amp; Study Guides
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#64748B] leading-relaxed">
              Conceptual breakdowns, exam strategies, and technical explanations designed to build true engineering intuition.
            </p>
          </div>

          <AdSlot slotId="home_top" />

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_ARTICLES.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#087BFF] font-bold">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readingTime}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-[#07172B] hover:text-[#087BFF] transition-colors leading-snug mb-3">
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">By {article.author}</span>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="font-bold text-[#087BFF] hover:text-[#1688FF] flex items-center gap-1"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
