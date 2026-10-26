'use client';

import React from 'react';
import Link from 'next/link';

export default function BrandLogo({
  variant = 'horizontal',
  showTagline = true,
  className = '',
  size = 'md',
}) {
  const sizeClasses = {
    sm: {
      icon: 'w-7 h-7 rounded-lg',
      text: 'text-base font-extrabold',
      tagline: 'text-[9px] tracking-wider',
    },
    md: {
      icon: 'w-8 h-8 rounded-xl',
      text: 'text-lg font-black',
      tagline: 'text-[10px] tracking-wider',
    },
    lg: {
      icon: 'w-10 h-10 rounded-2xl',
      text: 'text-2xl font-black',
      tagline: 'text-xs tracking-wider',
    },
  }[size] || {
    icon: 'w-8 h-8 rounded-xl',
    text: 'text-lg font-black',
    tagline: 'text-[10px] tracking-wider',
  };

  const logoIcon = (
    <span
      className={`relative flex shrink-0 items-center justify-center bg-gradient-to-tr from-primary to-blue-500 text-white shadow-sm ${sizeClasses.icon}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-[62%] w-[62%]">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
      </svg>
    </span>
  );

  const wordmark = (
    <span className={`tracking-tight leading-none ${sizeClasses.text}`}>
      <span className="text-slate-900 dark:text-white">hritik</span>
      <span className="text-primary">pedia</span>
    </span>
  );

  const tagline = showTagline ? (
    <span className={`font-semibold uppercase text-slate-400 leading-none ${sizeClasses.tagline}`}>
      Operations Console
    </span>
  ) : null;

  if (variant === 'icon-only') {
    return (
      <Link href="/" className={`inline-flex items-center ${className}`} aria-label="HritikPedia Operations Console">
        {logoIcon}
      </Link>
    );
  }

  if (variant === 'stacked') {
    return (
      <Link
        href="/"
        className={`inline-flex flex-col items-center gap-2 group ${className}`}
        aria-label="HritikPedia Operations Console"
      >
        {logoIcon}
        <span className="flex flex-col items-center gap-1">
          {wordmark}
          {tagline}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group ${className}`}
      aria-label="HritikPedia Operations Console"
    >
      {logoIcon}
      <span className="flex flex-col gap-0.5">
        {wordmark}
        {tagline}
      </span>
    </Link>
  );
}
