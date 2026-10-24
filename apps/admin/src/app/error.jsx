'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import BrandLogo from '../components/BrandLogo';
import { ShieldAlert, RefreshCw, LayoutDashboard } from 'lucide-react';

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error('[ADMIN CONSOLE EXCEPTION]', error);
  }, [error]);

  const incidentRef = Math.random().toString(36).substring(2, 9).toUpperCase();

  return (
    <div className="min-h-screen bg-[#07172B] flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-[#0B1D36] p-8 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
        <BrandLogo size="md" theme="dark" className="mx-auto" />

        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Console Module Fault
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The administrative console intercepted an unexpected error while executing this view.
          </p>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>INCIDENT REF:</span>
            <span className="font-bold text-blue-400">{incidentRef}</span>
          </div>
          {error?.message && (
            <p className="text-xs font-mono text-red-300 mt-1 truncate">
              {error.message}
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => reset()}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Console State</span>
          </button>

          <Link
            href="/"
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
