'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Eye, ArrowRight, Star, ShieldCheck, FileText } from 'lucide-react';
import { formatINR } from '@hritikpedia/shared/payment';

export default function NoteCard({ note }) {
  if (!note) return null;

  const isFree = note.isFree || Number(note.price) === 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden">
      {/* Visual Header / Cover */}
      <div className="relative h-44 bg-gradient-to-br from-[#07172B] via-[#0B1D36] to-[#0A2548] p-5 flex flex-col justify-between overflow-hidden">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1688FF_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20">
            {note.subjectName || 'Computer Science'}
          </span>

          {isFree ? (
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
              FREE
            </span>
          ) : (
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#FFB923] text-[#07172B] shadow-xs">
              PREMIUM
            </span>
          )}
        </div>

        <div className="relative z-10">
          <span className="text-[11px] font-semibold text-[#087BFF] uppercase tracking-wider block mb-1">
            {note.topic || note.examCategory}
          </span>
          <h3 className="text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-blue-200 transition-colors">
            {note.title}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-4">
            {note.description}
          </p>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pb-3 border-b border-slate-100">
            <span className="flex items-center gap-1 font-medium">
              <FileText className="w-3.5 h-3.5 text-[#087BFF]" />
              {note.pageCount} Pages
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium text-amber-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {note.rating || '4.9'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Watermarked
            </span>
          </div>
        </div>

        {/* Pricing and Action Footer */}
        <div className="pt-4 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            {isFree ? (
              <span className="text-lg font-black text-emerald-600">₹0</span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-[#07172B]">
                  {formatINR(note.price)}
                </span>
                {note.originalPrice && note.originalPrice > note.price && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatINR(note.originalPrice)}
                  </span>
                )}
              </div>
            )}
            <span className="text-[10px] text-slate-400 font-medium">
              {isFree ? 'Instant Access' : 'One-time Payment'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {note.hasPreview && (
              <Link
                href={`/reader/${note.slug}?preview=true`}
                className="px-3 py-1.5 text-xs font-semibold text-[#07172B] hover:text-[#087BFF] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                title="Preview Sample Pages"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </Link>
            )}

            <Link
              href={`/notes/${note.slug}`}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-lg transition-colors flex items-center gap-1 shadow-xs group-hover:gap-1.5"
            >
              <span>Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
