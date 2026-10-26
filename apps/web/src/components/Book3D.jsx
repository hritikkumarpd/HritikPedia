'use client';

import React from 'react';

/**
 * Clean Academic Study-Pack Book Cover.
 * Features realistic book spine, foil stamped typography, and crisp borders.
 */
export default function BookCover3D({
  title = 'Study Notes',
  subject = 'Computer Science',
  color = 'blue',
  size = 'md',
  is3d = false,
  className = '',
}) {
  const PALETTES = {
    blue: {
      bg: 'bg-blue-600 dark:bg-blue-700',
      text: 'text-white',
      rule: 'border-white/25',
      soft: 'text-blue-100',
      edge: 'border-blue-700 dark:border-blue-800',
      accent: 'bg-amber-400',
    },
    emerald: {
      bg: 'bg-emerald-700 dark:bg-emerald-800',
      text: 'text-white',
      rule: 'border-white/25',
      soft: 'text-emerald-100',
      edge: 'border-emerald-800 dark:border-emerald-900',
      accent: 'bg-emerald-300',
    },
    green: {
      bg: 'bg-emerald-700 dark:bg-emerald-800',
      text: 'text-white',
      rule: 'border-white/25',
      soft: 'text-emerald-100',
      edge: 'border-emerald-800 dark:border-emerald-900',
      accent: 'bg-emerald-300',
    },
    indigo: {
      bg: 'bg-indigo-700 dark:bg-indigo-800',
      text: 'text-white',
      rule: 'border-white/25',
      soft: 'text-indigo-100',
      edge: 'border-indigo-800 dark:border-indigo-900',
      accent: 'bg-cyan-300',
    },
    purple: {
      bg: 'bg-purple-700 dark:bg-purple-800',
      text: 'text-white',
      rule: 'border-white/25',
      soft: 'text-purple-100',
      edge: 'border-purple-800 dark:border-purple-900',
      accent: 'bg-pink-300',
    },
    amber: {
      bg: 'bg-amber-600 dark:bg-amber-700',
      text: 'text-white',
      rule: 'border-white/25',
      soft: 'text-amber-100',
      edge: 'border-amber-700 dark:border-amber-800',
      accent: 'bg-white',
    },
    sun: {
      bg: 'bg-amber-600 dark:bg-amber-700',
      text: 'text-white',
      rule: 'border-white/25',
      soft: 'text-amber-100',
      edge: 'border-amber-700 dark:border-amber-800',
      accent: 'bg-white',
    },
    red: {
      bg: 'bg-rose-700 dark:bg-rose-800',
      text: 'text-white',
      rule: 'border-white/25',
      soft: 'text-rose-100',
      edge: 'border-rose-800 dark:border-rose-900',
      accent: 'bg-amber-300',
    },
    slate: {
      bg: 'bg-slate-800 dark:bg-slate-900',
      text: 'text-white',
      rule: 'border-white/25',
      soft: 'text-slate-200',
      edge: 'border-slate-900',
      accent: 'bg-blue-400',
    },
    ink: {
      bg: 'bg-slate-900',
      text: 'text-white',
      rule: 'border-white/25',
      soft: 'text-slate-300',
      edge: 'border-black',
      accent: 'bg-amber-400',
    },
  };

  const palette = PALETTES[color] || PALETTES.blue;

  const sizes = {
    list: {
      wrap: 'w-12 h-[4.5rem]',
      pad: 'p-1.5',
      title: 'text-[8px] leading-tight',
      meta: 'text-[6px]',
    },
    grid: {
      wrap: 'w-[5.25rem] h-[7.5rem]',
      pad: 'p-2',
      title: 'text-[10px] leading-tight',
      meta: 'text-[6.5px]',
    },
    sm: {
      wrap: 'w-16 h-[5.5rem]',
      pad: 'p-2',
      title: 'text-[9px] leading-tight',
      meta: 'text-[6px]',
    },
    md: {
      wrap: 'w-24 h-[8rem]',
      pad: 'p-2.5',
      title: 'text-[11px] leading-tight',
      meta: 'text-[7px]',
    },
    lg: {
      wrap: 'w-36 h-[12.5rem]',
      pad: 'p-4',
      title: 'text-sm leading-snug',
      meta: 'text-[8px]',
    },
    xl: {
      wrap: 'w-48 h-[16.5rem]',
      pad: 'p-5',
      title: 'text-base leading-snug',
      meta: 'text-[9px]',
    },
  }[size] || {
    wrap: 'w-24 h-[8rem]',
    pad: 'p-2.5',
    title: 'text-[11px] leading-tight',
    meta: 'text-[7px]',
  };

  return (
    <div
      className={`relative flex shrink-0 flex-col justify-between overflow-hidden rounded-lg border shadow-xs ${palette.bg} ${palette.text} ${palette.edge} ${sizes.wrap} ${className}`}
    >
      {/* Spine crease highlight */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1 bg-black/20 border-r border-white/10"
      />

      <div className={`pl-2.5 ${sizes.pad}`}>
        <div className="flex items-center justify-between gap-1">
          <span className={`font-bold uppercase tracking-widest ${palette.soft} ${sizes.meta}`}>
            Hritikpedia
          </span>
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${palette.accent}`} aria-hidden="true" />
        </div>

        <p className={`mt-1 line-clamp-1 font-semibold uppercase tracking-wider ${palette.soft} ${sizes.meta}`}>
          {subject}
        </p>

        <h4 className={`mt-1 font-display font-extrabold tracking-tight ${sizes.title}`}>
          <span className="line-clamp-3">{title}</span>
        </h4>
      </div>

      <div
        className={`mx-2 mb-1.5 flex items-center justify-between border-t pt-1 ${palette.rule} ${palette.soft} ${sizes.meta}`}
      >
        <span className="font-semibold uppercase tracking-wider">Verified Notes</span>
        <span className="font-semibold uppercase tracking-wider">PDF</span>
      </div>
    </div>
  );
}
