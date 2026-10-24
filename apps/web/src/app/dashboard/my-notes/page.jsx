'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, Eye, ArrowRight, ShieldCheck, Search } from 'lucide-react';
import { INITIAL_NOTES } from '@hritikpedia/shared/data';

export default function MyNotesPage() {
  const [purchasedNotes, setPurchasedNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'purchased' | 'free'
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotes() {
      try {
        const res = await fetch('/api/student/notes');
        if (res.ok) {
          const data = await res.json();
          setPurchasedNotes(data.purchasedNotes || []);
        }
      } catch (err) {
        console.error('Error fetching student notes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, []);

  const freeNotes = INITIAL_NOTES.filter((n) => n.isFree);

  const displayList = [
    ...purchasedNotes.map((n) => ({ ...n, isPurchased: true })),
    ...freeNotes.map((n) => ({ ...n, isPurchased: false })),
  ].filter((item) => {
    if (activeTab === 'purchased' && !item.isPurchased) return false;
    if (activeTab === 'free' && item.isPurchased) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#07172B] tracking-tight">
            My Study Notes Library
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your full study materials with continuous reading progress
          </p>
        </div>

        <Link
          href="/notes"
          className="px-4 py-2 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-xl transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <BookOpen className="w-4 h-4" />
          <span>Browse More Notes</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white text-[#07172B] shadow-xs'
                : 'text-slate-600 hover:text-[#07172B]'
            }`}
          >
            All Notes ({purchasedNotes.length + freeNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('purchased')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'purchased'
                ? 'bg-[#FFB923] text-[#07172B] shadow-xs'
                : 'text-slate-600 hover:text-[#07172B]'
            }`}
          >
            Purchased ({purchasedNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('free')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'free'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-[#07172B]'
            }`}
          >
            Free Tier ({freeNotes.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your library..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#087BFF] text-[#26354B]"
          />
        </div>
      </div>

      {/* Notes List */}
      {displayList.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#07172B]">No study notes found</h3>
          <p className="text-xs text-slate-400 mt-1">Try switching tabs or resetting your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayList.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between hover:border-blue-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#087BFF]">
                    {item.subject_name || item.subjectName}
                  </span>
                  {item.isPurchased ? (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#FFB923]/20 text-[#07172B] border border-[#FFB923]/40">
                      PAID UNLOCKED
                    </span>
                  ) : (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      FREE TIER
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-[#07172B] leading-snug line-clamp-2 mt-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {item.page_count || item.pageCount} Pages • Watermarked
                </span>
                <Link
                  href={`/reader/${item.slug}`}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <span>Open Reader</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
