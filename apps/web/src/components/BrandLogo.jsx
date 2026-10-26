'use client';

import React from 'react';
import Link from 'next/link';

export default function BrandLogo({
  variant = 'horizontal', // 'horizontal' | 'stacked' | 'icon-only'
  showTagline = true,
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: {
      icon: 'w-7 h-7 rounded-lg text-xs',
      text: 'text-base',
      tagline: 'text-[9px] tracking-wider',
    },
    md: {
      icon: 'w-8 h-8 rounded-lg text-sm',
      text: 'text-lg',
      tagline: 'text-[10px] tracking-wider',
    },
    lg: {
      icon: 'w-10 h-10 rounded-xl text-base',
      text: 'text-2xl',
      tagline: 'text-xs tracking-wider',
    },
  }[size] || {
    icon: 'w-8 h-8 rounded-lg text-sm',
    text: 'text-lg',
    tagline: 'text-[10px] tracking-wider',
  };

  const logoIcon = (
    <span
      className={`relative flex items-center justify-center shrink-0 bg-blue-600 text-white shadow-xs font-black ${sizeClasses.icon}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[60%] h-[60%]"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h7" />
      </svg>
    </span>
  );

  const wordmark = (
    <span className={`font-display font-extrabold tracking-tight leading-none ${sizeClasses.text}`}>
      <span className="text-slate-900 dark:text-white">hritik</span>
      <span className="text-blue-600 dark:text-blue-400">pedia</span>
    </span>
  );

  if (variant === 'icon-only') {
    return (
      <Link href="/" className={`inline-flex items-center ${className}`} aria-label="Hritikpedia — Home">
        {logoIcon}
      </Link>
    );
  }

  if (variant === 'stacked') {
    return (
      <Link
        href="/"
        className={`inline-flex flex-col items-center gap-1.5 group ${className}`}
        aria-label="Hritikpedia — Home"
      >
        {logoIcon}
        <div className="flex flex-col items-center">
          {wordmark}
          {showTagline && (
            <span className={`font-medium uppercase text-slate-500 dark:text-slate-400 ${sizeClasses.tagline}`}>
              Computer Science Notes
            </span>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group ${className}`}
      aria-label="Hritikpedia — Home"
    >
      {logoIcon}
      <div className="flex flex-col">
        {wordmark}
        {showTagline && (
          <span className={`font-semibold uppercase text-slate-500 dark:text-slate-400 ${sizeClasses.tagline}`}>
            Study Notes &amp; Tests
          </span>
        )}
      </div>
    </Link>
  );
}
