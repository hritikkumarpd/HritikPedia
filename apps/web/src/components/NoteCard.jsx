'use client';

import React from 'react';
import Link from 'next/link';
import BookCover3D from './Book3D';
import { useCart } from './CartContext';
import { ShoppingBag, ArrowRight, Star, FileText, CheckCircle2 } from 'lucide-react';
import { formatINR } from '@hritikpedia/shared/payment';

export default function NoteCard({ note, variant = 'grid', rank = null }) {
  const { addToCart } = useCart();
  if (!note) return null;

  const isFree = Boolean(note.isFree) || Number(note.price) === 0;
  const priceLabel = isFree ? 'Free' : formatINR(note.price);
  const originalPrice = Number(note.originalPrice) || 0;
  const rating = Number(note.rating) || 4.8;
  const exam = note.examCategory || note.targetExamOrBoard || 'Study Pack';
  const subject = note.subjectName || 'Computer Science';
  const pages = Number(note.pageCount) || 0;
  const color = note.color || 'blue';

  if (variant === 'list') {
    return (
      <article className="group flex items-stretch overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-150">
        <div className="flex w-24 shrink-0 flex-col items-center justify-center border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3">
          <BookCover3D title={note.title} subject={subject} color={color} size="list" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
              <span className="text-blue-600 dark:text-blue-400">{subject}</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-500 dark:text-slate-400">{exam}</span>
              {isFree ? (
                <span className="rounded bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800/60">
                  Free Access
                </span>
              ) : (
                <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-slate-600 dark:text-slate-400 font-medium">
                  PDF + Reader
                </span>
              )}
            </div>

            <Link href={`/notes/${note.slug}`} className="mt-1.5 block">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {note.title}
              </h3>
            </Link>

            {note.description && (
              <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                {note.description}
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-black text-slate-900 dark:text-white">
                {priceLabel}
              </span>
              {!isFree && originalPrice > Number(note.price) && (
                <span className="text-xs text-slate-400 line-through">
                  {formatINR(originalPrice)}
                </span>
              )}
              {pages > 0 && (
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  • {pages} Pages
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/notes/${note.slug}`}
                className="btn btn-secondary btn-sm"
              >
                <span>Details</span>
              </Link>
              {isFree ? (
                <Link
                  href={`/reader/${note.slug}`}
                  className="btn btn-primary btn-sm"
                >
                  <span>Read Free</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => addToCart(note)}
                  className="btn btn-primary btn-sm cursor-pointer"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Add to Bag</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid variant (default)
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-200">
      {/* Visual Cover Header */}
      <div className="relative flex h-36 items-center justify-center overflow-hidden border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-4">
        <div className="transition-transform duration-200 group-hover:scale-105">
          <BookCover3D title={note.title} subject={subject} color={color} size="grid" />
        </div>

        {/* Free Tag or Rank */}
        {isFree ? (
          <span className="absolute top-2.5 left-2.5 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
            Free
          </span>
        ) : rank ? (
          <span className="absolute top-2.5 left-2.5 rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
            #{rank}
          </span>
        ) : null}

        {/* Rating Pill */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-md border border-slate-200/80 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-200 shadow-xs">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span>{rating}</span>
        </div>
      </div>

      {/* Note Metadata & Details */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
          <span className="text-blue-600 dark:text-blue-400 truncate max-w-[70%]">
            {subject}
          </span>
          {pages > 0 && (
            <span className="text-slate-400 text-[10px] lowercase">
              {pages} pgs
            </span>
          )}
        </div>

        <Link href={`/notes/${note.slug}`} className="mt-1.5 block">
          <h3 className="line-clamp-2 font-display text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {note.title}
          </h3>
        </Link>

        <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
          Target: {exam}
        </p>

        {/* Price & Action Row */}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-base font-extrabold text-slate-900 dark:text-white">
                  {priceLabel}
                </span>
                {!isFree && originalPrice > Number(note.price) && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatINR(originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {isFree ? (
              <Link
                href={`/reader/${note.slug}`}
                className="btn btn-secondary btn-sm"
              >
                <span>Read Free</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(note)}
                className="btn btn-primary btn-sm cursor-pointer"
                aria-label={`Add ${note.title} to study bag`}
              >
                <ShoppingBag className="h-3 w-3" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
