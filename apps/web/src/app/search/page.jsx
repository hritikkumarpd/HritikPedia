'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import NoteCard from '../../components/NoteCard';
import SubjectCard from '../../components/SubjectCard';
import {
  Search,
  BookOpen,
  Layers,
  FileText,
  ArrowRight,
  X,
  Loader2,
  Compass,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const QUICK_SEARCHES = ['UPSC', 'BPSC', 'BSEB', 'CBSE', 'AKTU', 'DBMS', 'Digital Logic'];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState({ notes: [], subjects: [], articles: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const q = query.trim();

    if (!q) {
      setResults({ notes: [], subjects: [], articles: [] });
      setError('');
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError('');

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
        const data = await res.json();

        if (cancelled) return;

        if (res.ok) {
          setResults({
            notes: data.notes || [],
            subjects: data.subjects || [],
            articles: data.articles || [],
          });
        } else {
          setError(data.error || 'Search is temporarily unavailable. Please try again.');
          setResults({ notes: [], subjects: [], articles: [] });
        }
      } catch {
        if (!cancelled) {
          setError('Network error while searching. Please check your connection.');
          setResults({ notes: [], subjects: [], articles: [] });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const { notes: matchedNotes, subjects: matchedSubjects, articles: matchedArticles } = results;
  const total = matchedNotes.length + matchedSubjects.length + matchedArticles.length;
  const hasQuery = Boolean(query.trim());

  return (
    <main id="main-content" className="flex-1">
      {/* Search Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-10 sm:py-14">
        <div className="container-page relative">
          <nav
            className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="opacity-40">/</span>
            <span className="text-slate-900 dark:text-white">Universal Search</span>
          </nav>

          <div className="mt-4 max-w-3xl">
            <span className="badge badge-primary">Academic Catalog Search</span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Search Notes, Subjects &amp; Guides
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Type an exam stream, topic name, or syllabus subject code to discover verified notes and study resources.
            </p>
          </div>

          <div className="mt-8 max-w-2xl">
            <div className="flex items-center gap-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 p-2 pl-4 shadow-sm backdrop-blur-md transition-all focus-within:border-primary focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-primary/20">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search UPSC, BPSC, BSEB, CBSE, AKTU, DBMS, Digital Logic..."
                aria-label="Search study catalogue"
                className="min-w-0 flex-1 bg-transparent py-1.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                autoFocus
              />
              {loading && <Loader2 className="mr-1 h-5 w-5 shrink-0 animate-spin text-primary" />}
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear query"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <span className="hidden sm:inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-400">
                ⌘K
              </span>
            </div>

            {/* Quick search chips */}
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                Suggested:
              </span>
              {QUICK_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex min-h-[1.5rem] items-center gap-2 text-xs font-semibold text-slate-500">
            {!hasQuery ? (
              <>
                <Compass className="h-4 w-4 text-primary" />
                <span>Type keywords above to search across our full catalog</span>
              </>
            ) : loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Searching our verified database...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>
                  Found <strong className="text-slate-900 dark:text-white">{total}</strong>{' '}
                  {total === 1 ? 'match' : 'matches'} for{' '}
                  <strong className="text-primary">&ldquo;{query.trim()}&rdquo;</strong>
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-10 sm:py-14">
        <div className="container-page">
          {error && (
            <div className="mx-auto mb-8 max-w-xl rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-4 text-center text-xs font-semibold text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {hasQuery && !loading && !error && total === 0 && (
            <div className="card mx-auto max-w-md p-10 text-center border border-slate-200 dark:border-slate-800">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                <Search className="h-7 w-7" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                No Exact Matches Found
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try searching for an exam category (UPSC, BPSC, BSEB) or a general subject (Physics, DBMS).
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {['DBMS', 'Digital Logic', 'Bihar STET'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="btn btn-secondary btn-sm text-xs"
                  >
                    Try {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Study Notes */}
          {matchedNotes.length > 0 && (
            <div className="mb-12">
              <div className="mb-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  Study Notes
                  <span className="badge badge-primary">{matchedNotes.length}</span>
                </h2>
                <Link
                  href="/notes"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  View All Notes
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {matchedNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}

          {/* Matched Subjects */}
          {matchedSubjects.length > 0 && (
            <div className="mb-12">
              <div className="mb-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Layers className="h-4 w-4" />
                  </span>
                  Subjects &amp; Streams
                  <span className="badge badge-secondary">{matchedSubjects.length}</span>
                </h2>
                <Link
                  href="/subjects"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  View All Subjects
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {matchedSubjects.map((sub) => (
                  <SubjectCard key={sub.id} subject={sub} />
                ))}
              </div>
            </div>
          )}

          {/* Matched Articles */}
          {matchedArticles.length > 0 && (
            <div className="mb-8">
              <div className="mb-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <FileText className="h-4 w-4" />
                  </span>
                  Exam Guides &amp; Articles
                  <span className="badge badge-secondary">{matchedArticles.length}</span>
                </h2>
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  All Articles
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {matchedArticles.map((art) => (
                  <article key={art.id} className="card card-hover flex flex-col p-6 border border-slate-200 dark:border-slate-800">
                    <span className="badge badge-secondary self-start">{art.category}</span>
                    <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900 dark:text-white hover:text-primary transition-colors">
                      <Link href={`/articles/${art.slug}`}>{art.title}</Link>
                    </h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {art.excerpt}
                    </p>
                    <Link
                      href={`/articles/${art.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs font-bold text-primary"
                    >
                      Read Guide
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center py-24">
            <div className="text-center">
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
              <p className="mt-3 text-xs font-bold text-slate-500">Opening search index...</p>
            </div>
          </div>
        }
      >
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
