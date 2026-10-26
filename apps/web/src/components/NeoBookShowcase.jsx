'use client';

import React from 'react';
import Link from 'next/link';
import { Star, FileText, CheckCircle2, BookOpen, ArrowRight } from 'lucide-react';

export default function NeoBookShowcase({
  title = 'Digital Logic & Architecture Complete Notes',
  subtitle = 'Truth tables, Karnaugh maps, pipeline architecture, and 120+ verified PYQ solutions.',
  rating = '4.9',
  reviews = '1,240',
  slug = 'digital-logic-revision-notes',
}) {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
      {/* Featured Book Showcase Card */}
      <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl">
        {/* Header Tag Row */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Featured Study Edition
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-md bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/40">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
            <span className="text-slate-400 font-normal">({reviews})</span>
          </div>
        </div>

        {/* Book Body */}
        <div className="mt-5 space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Target: Bihar STET Paper-II &amp; BPSC Teacher
            </span>
            <h3 className="mt-1 font-display text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {title}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Key Checklist Features */}
          <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Full Syllabus Notes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>120+ Solved PYQs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>K-Map Diagrams</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Instant PDF Access</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Instant Access
              </span>
              <span className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
                ₹199
              </span>
            </div>

            <Link
              href={`/notes/${slug}`}
              className="btn btn-primary"
            >
              <span>Explore Study Pack</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
