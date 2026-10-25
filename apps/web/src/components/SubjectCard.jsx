'use client';

import React from 'react';
import Link from 'next/link';
import {
  Database,
  Cpu,
  Network,
  CircuitBoard,
  Binary,
  GraduationCap,
  Code2,
  Globe,
  BookOpen,
  ArrowRight,
  Landmark,
  School,
  Atom,
  Flame,
  Calculator,
  Compass,
} from 'lucide-react';

const ICON_MAP = {
  Database,
  Cpu,
  Network,
  CircuitBoard,
  Binary,
  GraduationCap,
  Code2,
  Globe,
  Landmark,
  School,
  Atom,
  Flame,
  Calculator,
  Compass,
};

export default function SubjectCard({ subject }) {
  if (!subject) return null;

  const IconComponent = ICON_MAP[subject.icon] || BookOpen;

  return (
    <Link
      href={`/subjects/${subject.slug}`}
      className="group relative flex flex-col justify-between p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#087BFF]/50 transition-all duration-200"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-200"
            style={{
              backgroundColor: `${subject.color || '#087BFF'}15`,
              color: subject.color || '#087BFF',
            }}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1.5">
            {subject.targetExamOrBoard && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                {subject.targetExamOrBoard}
              </span>
            )}
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-[#087BFF] transition-colors">
              {subject.noteCount || 0} Notes
            </span>
          </div>
        </div>

        <h3 className="text-base font-bold text-[#07172B] group-hover:text-[#087BFF] transition-colors leading-snug">
          {subject.name}
        </h3>

        {subject.department && (
          <p className="mt-1 text-[11px] font-semibold text-slate-500">
            {subject.department}
          </p>
        )}

        <p className="mt-2 text-xs text-[#64748B] line-clamp-3 leading-relaxed">
          {subject.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#087BFF]">
        <span>Explore Subject Notes</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
