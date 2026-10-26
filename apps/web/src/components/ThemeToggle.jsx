'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '', showLabel = false }) {
  const { theme, toggleTheme, mounted } = useTheme();

  // Until mounted on client, render a calm placeholder to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle visual theme"
        disabled
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-400 opacity-60 transition-colors ${className}`}
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`group relative inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 focus-visible:outline-2 focus-visible:outline-blue-600 transition-all cursor-pointer ${className}`}
    >
      <div className="relative flex h-4 w-4 items-center justify-center">
        <Sun
          className={`h-4 w-4 text-amber-500 transition-all duration-200 ${
            isDark ? 'scale-0 rotate-90 opacity-0 absolute' : 'scale-100 rotate-0 opacity-100'
          }`}
        />
        <Moon
          className={`h-4 w-4 text-blue-400 transition-all duration-200 ${
            isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0 absolute'
          }`}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-medium select-none">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
}
