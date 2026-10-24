'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, Layers, FileText, ArrowRight, X, Loader2 } from 'lucide-react';

export default function SearchHero({ className = '' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef(null);

  // Debounced search query
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const totalResults =
    (results?.notes?.length || 0) +
    (results?.subjects?.length || 0) +
    (results?.articles?.length || 0);

  return (
    <div ref={searchRef} className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <div className="relative flex items-center shadow-md rounded-2xl bg-white border border-slate-200/90 focus-within:ring-2 focus-within:ring-[#087BFF] focus-within:border-[#087BFF] transition-all">
        <Search className="w-5 h-5 text-slate-400 absolute left-4.5 pointer-events-none" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Search by subject, topic (e.g. Normalization, Deadlocks, K-Maps, Subnetting)..."
          className="w-full pl-12 pr-24 py-3.5 sm:py-4 text-sm sm:text-base bg-transparent text-[#26354B] placeholder-slate-400 focus:outline-hidden rounded-2xl"
          aria-label="Search study notes, subjects, and topics"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {loading && <Loader2 className="w-4 h-4 text-[#087BFF] animate-spin" />}
          {query && !loading && (
            <button
              onClick={() => {
                setQuery('');
                setResults(null);
                setIsOpen(false);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => query.trim() && router.push(`/search?q=${encodeURIComponent(query.trim())}`)}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-xl transition-colors shadow-xs"
          >
            Search
          </button>
        </div>
      </div>

      {/* Dropdown Live Results */}
      {isOpen && results && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 max-h-[420px] overflow-y-auto">
          {totalResults === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No results found for &ldquo;<strong className="text-[#07172B]">{query}</strong>&rdquo;. Try searching for &ldquo;DBMS&rdquo;, &ldquo;OS&rdquo;, or &ldquo;STET&rdquo;.
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {/* Subjects */}
              {results.subjects?.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#087BFF]" />
                    Subjects
                  </div>
                  <div className="space-y-1 mt-1">
                    {results.subjects.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/subjects/${sub.slug}`);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-[#07172B] hover:bg-blue-50 rounded-lg flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>{sub.name}</span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {sub.noteCount} Notes
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {results.notes?.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#087BFF]" />
                    Study Notes
                  </div>
                  <div className="space-y-1 mt-1">
                    {results.notes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/notes/${note.slug}`);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-[#07172B] line-clamp-1">{note.title}</p>
                          <p className="text-[10px] text-slate-500">{note.subjectName} • {note.topic}</p>
                        </div>
                        <span className="text-xs font-bold text-[#087BFF] shrink-0 ml-2">
                          {note.isFree ? 'Free' : `₹${note.price}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles */}
              {results.articles?.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#087BFF]" />
                    Articles &amp; Guides
                  </div>
                  <div className="space-y-1 mt-1">
                    {results.articles.map((art) => (
                      <button
                        key={art.id}
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/articles/${art.slug}`);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="text-xs font-medium text-[#07172B] line-clamp-1">{art.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">{art.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="text-xs font-bold text-[#087BFF] hover:underline inline-flex items-center gap-1"
                >
                  <span>View all {totalResults} results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
