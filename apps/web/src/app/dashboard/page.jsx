'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import BookCover3D from '../../components/Book3D';
import {
  BookOpen,
  FileText,
  Loader2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Clock3,
  Library,
  ShieldCheck,
} from 'lucide-react';

export default function MyLibraryPage() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'purchased' | 'free'
  const [purchasedNotes, setPurchasedNotes] = useState([]);
  const [freeNotes, setFreeNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadLibrary() {
      try {
        const res = await fetch('/api/student/notes', { cache: 'no-store' });
        const data = await res.json();
        if (cancelled) return;

        if (res.ok) {
          setPurchasedNotes(data.purchasedNotes || []);
          setFreeNotes(data.freeNotes || []);
        } else {
          setError(data.error || 'Unable to load your library right now.');
        }
      } catch {
        if (!cancelled) setError('Unable to load your library right now.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLibrary();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    const purchased = purchasedNotes.map((note) => ({
      id: `purchased-${note.id}`,
      noteId: note.id,
      title: note.title,
      slug: note.slug,
      category: note.subject_name || 'Study Notes',
      pageCount: note.page_count,
      access: 'purchased',
    }));

    const free = freeNotes.map((note) => ({
      id: `free-${note.id}`,
      noteId: note.id,
      title: note.title,
      slug: note.slug,
      category: note.subjectName || 'Free Study Notes',
      pageCount: note.pageCount,
      access: 'free',
    }));

    return [...purchased, ...free];
  }, [purchasedNotes, freeNotes]);

  const tabs = [
    { id: 'all', label: 'All Library Items', count: items.length },
    { id: 'purchased', label: 'Purchased Editions', count: purchasedNotes.length },
    { id: 'free', label: 'Free Shelf', count: freeNotes.length },
  ];

  const filteredItems = items.filter((item) => {
    if (activeTab === 'all') return true;
    return item.access === activeTab;
  });

  return (
    <div className="space-y-8">
      {/* Dashboard Top Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="badge badge-primary">Personal Library</span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              My Reading Room
            </h1>
            <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Access your full licensed packs, preview sample notes, and continue revision across any device.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 text-center min-w-[5.5rem]">
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {purchasedNotes.length}
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Purchased
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 text-center min-w-[5.5rem]">
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {freeNotes.length}
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Free Packs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Catalog Link */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
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

        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline self-start sm:self-auto"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Explore More Notes</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="card flex items-center justify-center gap-3 p-12 text-xs font-bold text-slate-500 border border-slate-200 dark:border-slate-800">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span>Opening personal study shelves...</span>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-4 text-xs font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="card p-12 text-center border border-slate-200 dark:border-slate-800">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
            <Library className="h-7 w-7" />
          </span>
          <p className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            {activeTab === 'purchased' ? 'No Purchased Handbooks Yet' : 'Your Library Shelf is Empty'}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
            Discover verified study guides, formula revision sheets, and free chapter summaries.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <Link href="/notes" className="btn btn-primary btn-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Browse Study Notes
            </Link>
            <Link href="/free-resources" className="btn btn-secondary btn-sm">
              Explore Free Shelf
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="card card-hover flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <Link href={`/reader/${item.slug}`} className="shrink-0">
                  <BookCover3D
                    title={item.title}
                    subject={item.category}
                    color={item.access === 'free' ? 'purple' : 'blue'}
                    size="sm"
                    className="w-16 transition-transform hover:scale-105"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`badge ${
                        item.access === 'free' ? 'badge-secondary' : 'badge-primary'
                      }`}
                    >
                      {item.access === 'free' ? 'Free Edition' : 'Full License'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                      <Clock3 className="h-3 w-3" />
                      Lifetime Reader Access
                    </span>
                  </div>

                  <Link href={`/reader/${item.slug}`}>
                    <h3 className="mt-2 text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="mt-1 text-xs font-semibold text-slate-500">{item.category}</p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{item.pageCount || 1} Total Pages</span>
                    <span>•</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Watermarked Reader</span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-3 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                <Link href={`/reader/${item.slug}`} className="btn btn-primary btn-sm w-full sm:w-auto justify-center">
                  <BookOpen className="h-3.5 w-3.5" />
                  {item.access === 'free' ? 'Open Free Reader' : 'Open Secured Reader'}
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
