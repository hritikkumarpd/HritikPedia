'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BookCover3D from '../../../components/Book3D';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Loader2,
  X,
  FileText,
  Clock3,
} from 'lucide-react';

export default function MyNotesPage() {
  const [purchasedNotes, setPurchasedNotes] = useState([]);
  const [freeNotes, setFreeNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'purchased' | 'free'
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotes() {
      try {
        const res = await fetch('/api/student/notes', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setPurchasedNotes(data.purchasedNotes || []);
          setFreeNotes(data.freeNotes || []);
        }
      } catch (err) {
        console.error('Error fetching student notes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, []);

  const displayList = [
    ...purchasedNotes.map((n) => ({ ...n, isPurchased: true })),
    ...freeNotes.map((n) => ({ ...n, isPurchased: false })),
  ].filter((item) => {
    if (activeTab === 'purchased' && !item.isPurchased) return false;
    if (activeTab === 'free' && item.isPurchased) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Notes', count: purchasedNotes.length + freeNotes.length },
    { id: 'purchased', label: 'Purchased', count: purchasedNotes.length },
    { id: 'free', label: 'Free Tier', count: freeNotes.length },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="badge badge-primary">Library Catalog</span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              My Study Notes &amp; Handbooks
            </h1>
            <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Search and filter your active study packs, lecture notes, and chapter summaries.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              Total available: <strong className="text-slate-900 dark:text-white">{displayList.length}</strong>
            </span>
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 max-w-md">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title..."
            className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="card flex items-center justify-center gap-3 p-12 text-xs font-bold text-slate-500 border border-slate-200 dark:border-slate-800">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span>Loading your library...</span>
        </div>
      ) : displayList.length === 0 ? (
        <div className="card p-12 text-center border border-slate-200 dark:border-slate-800">
          <p className="text-base font-bold text-slate-900 dark:text-white">No Matching Notes Found</p>
          <p className="mt-1 text-xs text-slate-500">Try clearing your search keyword or exploring our full catalog.</p>
          <Link href="/notes" className="btn btn-primary btn-sm mt-5 inline-flex items-center gap-1.5">
            Browse Notes
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {displayList.map((item) => (
            <article
              key={item.id}
              className="card card-hover flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <Link href={`/reader/${item.slug}`} className="shrink-0">
                  <BookCover3D
                    title={item.title}
                    subject={item.subject_name || item.subjectName || 'Study Notes'}
                    color={item.isPurchased ? 'blue' : 'purple'}
                    size="sm"
                    className="w-16 transition-transform hover:scale-105"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`badge ${
                        item.isPurchased ? 'badge-primary' : 'badge-secondary'
                      }`}
                    >
                      {item.isPurchased ? 'Full License' : 'Free Resource'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                      <Clock3 className="h-3 w-3" />
                      Unlimited Reading
                    </span>
                  </div>

                  <Link href={`/reader/${item.slug}`}>
                    <h3 className="mt-2 text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {item.subject_name || item.subjectName}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{item.page_count || item.pageCount || 1} Pages</span>
                    <span>•</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Verified Edition</span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-3 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                <Link href={`/reader/${item.slug}`} className="btn btn-primary btn-sm w-full sm:w-auto justify-center">
                  <BookOpen className="h-3.5 w-3.5" />
                  Open Document
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
