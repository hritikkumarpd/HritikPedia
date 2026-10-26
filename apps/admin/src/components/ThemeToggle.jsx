'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle({ className = '', size = 'default' }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-4 w-4';

  if (!mounted) {
    return (
      <div
        className={`${sizeClasses} rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 opacity-0 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center justify-center ${sizeClasses} rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 shadow-xs transition-colors hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className={`${iconSize} text-amber-500 transition-transform duration-200 hover:rotate-45`} />
      ) : (
        <Moon className={`${iconSize} text-slate-600 transition-transform duration-200 hover:-rotate-12`} />
      )}
    </button>
  );
}
