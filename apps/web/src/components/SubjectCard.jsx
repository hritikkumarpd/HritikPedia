'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

const DOMAIN_LABEL = {
  engineering: 'Engineering CSE',
  general_competitions: 'Government Exams',
  school_boards: 'School Boards',
  general_degree: 'Degree & University',
};

export default function SubjectCard({ subject }) {
  if (!subject) return null;

  const noteCount = Number(subject.noteCount) || 0;

  return (
    <Link
      href={`/subjects/${subject.slug}`}
      className="group flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <BookOpen className="h-4 w-4" />
          </span>
          <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {subject.name}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
          {noteCount > 0 ? `${noteCount} ${noteCount === 1 ? 'pack' : 'packs'}` : 'Curating'}
        </span>
      </div>

      <p className="mt-2.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        {subject.description || `Comprehensive study notes, diagrams, and PYQ solutions for ${subject.name}.`}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2.5 text-[11px]">
        <span className="truncate font-semibold uppercase tracking-wider text-[10px] text-slate-400">
          {subject.targetExamOrBoard || DOMAIN_LABEL[subject.domain] || 'Computer Science'}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
          <span>Explore</span>
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
