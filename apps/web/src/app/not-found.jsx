import React from 'react';
import Link from 'next/link';
import BrandLogo from '../components/BrandLogo';
import { Search, BookOpen, Layers, Sparkles, Home, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '404 - Page Not Found | Hritikpedia',
  description: 'The requested educational page or study note could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F8FC] p-4 text-center">
      <div className="max-w-lg w-full bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-md space-y-6">
        <BrandLogo size="lg" className="mx-auto" />

        <div className="space-y-2">
          <span className="text-5xl sm:text-6xl font-black text-[#087BFF]">404</span>
          <h1 className="text-2xl font-bold text-[#07172B]">
            Page or Study Note Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable. Let&apos;s get you back to learning.
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-left pt-2">
          <Link
            href="/"
            className="p-3 bg-slate-50 hover:bg-blue-50 hover:text-[#087BFF] rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4 text-[#087BFF]" />
            <span>Home</span>
          </Link>
          <Link
            href="/notes"
            className="p-3 bg-slate-50 hover:bg-blue-50 hover:text-[#087BFF] rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-[#087BFF]" />
            <span>Study Notes</span>
          </Link>
          <Link
            href="/subjects"
            className="p-3 bg-slate-50 hover:bg-blue-50 hover:text-[#087BFF] rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-[#087BFF]" />
            <span>Subjects</span>
          </Link>
          <Link
            href="/free-resources"
            className="p-3 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl border border-slate-200 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#FFB923]" />
            <span>Free Resources</span>
          </Link>
        </div>

        <div className="pt-2">
          <Link
            href="/search"
            className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-[#087BFF] hover:bg-[#1688FF] shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search All Study Notes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
