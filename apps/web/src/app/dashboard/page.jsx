'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { INITIAL_NOTES } from '@hritikpedia/shared/data';

export default function DashboardOverviewPage() {
  const [purchasedNotes, setPurchasedNotes] = useState([]);
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
        console.error('Error loading notes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, []);

  const freeNotes = INITIAL_NOTES.filter((n) => n.isFree);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#07172B] via-[#0B1D36] to-[#0A2548] rounded-3xl p-6 sm:p-8 text-white shadow-xs">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-blue-200 text-xs font-bold border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB923]" />
            <span>Academic Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Stop Searching. Start Learning.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Welcome to your student learning hub. Access your purchased study notes, continue reading where you left off, and explore our free revision blueprints.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Purchased Notes
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#087BFF] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#07172B]">{purchasedNotes.length}</p>
          <span className="text-[11px] text-slate-400">Lifetime access unlocked</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Free Resources
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#07172B]">{freeNotes.length}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Available for instant reading</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Reading Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">Active</p>
          <span className="text-[11px] text-slate-400">Dynamic watermark enabled</span>
        </div>
      </div>

      {/* Continue Reading / My Notes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#07172B]">
            Your Study Materials
          </h2>
          <Link
            href="/dashboard/my-notes"
            className="text-xs font-bold text-[#087BFF] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {purchasedNotes.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#07172B]">No paid notes unlocked yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t purchased any premium notes yet. You can start reading our free blueprints or browse the catalog.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href="/notes"
                className="px-4 py-2 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-lg transition-colors"
              >
                Explore Notes Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {purchasedNotes.map((note) => (
              <div
                key={note.id}
                className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#087BFF] uppercase">
                    {note.subject_name}
                  </span>
                  <h3 className="text-sm font-bold text-[#07172B] line-clamp-1 mt-0.5">
                    {note.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {note.page_count} Pages • Unlocked on {note.granted_at ? new Date(note.granted_at).toLocaleDateString() : 'Today'}
                  </p>
                </div>
                <Link
                  href={`/reader/${note.slug}`}
                  className="shrink-0 px-4 py-2 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-xl transition-colors shadow-xs"
                >
                  Read Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Free Materials Ready for Study */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#07172B]">
          Instant Free Revision Materials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {freeNotes.map((note) => (
            <div
              key={note.id}
              className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-4"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">
                  100% Free
                </span>
                <h3 className="text-sm font-bold text-[#07172B] line-clamp-1 mt-0.5">
                  {note.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  {note.pageCount} Pages • {note.subjectName}
                </p>
              </div>
              <Link
                href={`/reader/${note.slug}`}
                className="shrink-0 px-4 py-2 text-xs font-bold text-[#07172B] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl transition-colors border border-emerald-200"
              >
                Open Reader
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
