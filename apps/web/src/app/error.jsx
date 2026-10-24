'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import BrandLogo from '../components/BrandLogo';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log exception for observability
    console.error('[PRODUCTION ERROR BOUNDARY CAUGHT]', error);
  }, [error]);

  const errorRef = Math.random().toString(36).substring(2, 9).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F8FC] p-4 text-center">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-md space-y-6">
        <BrandLogo size="md" className="mx-auto" />

        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#07172B] tracking-tight">
            Unexpected System Hiccup
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            Something unexpected interrupted the page view. Our automated diagnostic alerts have recorded this event.
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>DIAGNOSTIC REF:</span>
            <span className="font-bold text-slate-700">{errorRef}</span>
          </div>
          {error?.message && (
            <p className="text-xs font-mono text-slate-600 mt-1 truncate">
              {error.message}
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 bg-[#087BFF] hover:bg-[#1688FF] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Reloading Section</span>
          </button>

          <Link
            href="/"
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Safe Homepage</span>
          </Link>
        </div>

        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Hritikpedia High-Availability Core</span>
        </div>
      </div>
    </div>
  );
}
