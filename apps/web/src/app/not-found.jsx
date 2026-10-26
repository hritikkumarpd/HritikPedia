import React from 'react';
import Link from 'next/link';
import BrandLogo from '../components/BrandLogo';
import { Search, BookOpen, Layers, Sparkles, Home, ArrowRight, Compass } from 'lucide-react';

export const metadata = {
  title: '404 - Page Not Found | HritikPedia',
  description: 'The requested educational page or study note could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

const QUICK_LINKS = [
  { href: '/', label: 'Home Page', icon: Home },
  { href: '/notes', label: 'Study Notes', icon: BookOpen },
  { href: '/subjects', label: 'Subjects', icon: Layers },
  { href: '/free-resources', label: 'Free Shelf', icon: Sparkles },
];

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 text-center text-slate-900 dark:text-slate-100">
      <div className="card w-full max-w-lg p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
        <BrandLogo size="md" className="mx-auto" />

        <div className="mt-8">
          <span className="badge badge-primary">Catalog Query Missing</span>
          <p className="mt-4 font-mono text-6xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
            4<span className="text-primary">0</span>4
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Page or Study Note Not Found
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-xs sm:text-sm text-slate-500 leading-relaxed">
            The material you requested may have moved, updated syllabus numbering, or is temporarily offline. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 text-left">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3.5 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors"
              >
                <Icon className="h-4 w-4 text-primary" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        <Link href="/search" className="btn btn-primary mt-4 w-full justify-center">
          <Search className="h-4 w-4" />
          <span>Search Complete Catalog</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <Compass className="h-3.5 w-3.5" />
          <span>Need help finding a specific note? Visit our subject directory.</span>
        </p>
      </div>
    </div>
  );
}
