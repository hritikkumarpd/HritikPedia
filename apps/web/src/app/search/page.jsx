'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import NoteCard from '../../components/NoteCard';
import SubjectCard from '../../components/SubjectCard';
import { INITIAL_NOTES, INITIAL_SUBJECTS, INITIAL_ARTICLES } from '@hritikpedia/shared/data';
import { Search, BookOpen, Layers, FileText, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const q = query.toLowerCase().trim();

  const matchedNotes = q
    ? INITIAL_NOTES.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.subjectName.toLowerCase().includes(q) ||
          n.topic?.toLowerCase().includes(q)
      )
    : [];

  const matchedSubjects = q
    ? INITIAL_SUBJECTS.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q)
      )
    : [];

  const matchedArticles = q
    ? INITIAL_ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      )
    : [];

  const total = matchedNotes.length + matchedSubjects.length + matchedArticles.length;

  return (
    <main className="flex-1 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Input Box */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative flex items-center bg-white rounded-2xl border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-[#087BFF] focus-within:border-[#087BFF] p-2">
            <Search className="w-5 h-5 text-slate-400 ml-3 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all notes, subjects, chapters, and articles..."
              className="w-full px-3 py-2 text-sm sm:text-base bg-transparent text-[#26354B] focus:outline-hidden"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full mr-2"
                aria-label="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 px-2">
            <span>
              {query ? (
                <>Found <strong className="text-[#07172B]">{total}</strong> results for &ldquo;{query}&rdquo;</>
              ) : (
                'Enter a search term above'
              )}
            </span>
            <div className="flex gap-2">
              <span className="font-semibold text-slate-400">Try:</span>
              <button onClick={() => setQuery('DBMS')} className="hover:text-[#087BFF] underline">DBMS</button>
              <button onClick={() => setQuery('Operating')} className="hover:text-[#087BFF] underline">OS</button>
              <button onClick={() => setQuery('STET')} className="hover:text-[#087BFF] underline">Bihar STET</button>
            </div>
          </div>
        </div>

        {/* Results Sections */}
        {query && total === 0 && (
          <div className="max-w-xl mx-auto p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#07172B]">No exact matches found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with broader terms like &ldquo;Computer Networks&rdquo;, &ldquo;Digital Logic&rdquo;, or &ldquo;Algorithms&rdquo;.
            </p>
          </div>
        )}

        {/* Subjects Results */}
        {matchedSubjects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-bold text-[#07172B] mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#087BFF]" />
              <span>Matched Subjects ({matchedSubjects.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedSubjects.map((sub) => (
                <SubjectCard key={sub.id} subject={sub} />
              ))}
            </div>
          </div>
        )}

        {/* Notes Results */}
        {matchedNotes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-bold text-[#07172B] mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#087BFF]" />
              <span>Matched Study Notes ({matchedNotes.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        )}

        {/* Articles Results */}
        {matchedArticles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-bold text-[#07172B] mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#087BFF]" />
              <span>Matched Educational Articles ({matchedArticles.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedArticles.map((art) => (
                <article
                  key={art.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#087BFF] uppercase">
                      {art.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#07172B] mt-2 mb-1 hover:text-[#087BFF]">
                      <Link href={`/articles/${art.slug}`}>{art.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{art.excerpt}</p>
                  </div>
                  <Link
                    href={`/articles/${art.slug}`}
                    className="mt-4 text-xs font-bold text-[#087BFF] hover:underline flex items-center gap-1"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <Header />
      <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading search engine...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
