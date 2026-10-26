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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center text-slate-900 dark:text-slate-100">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <BrandLogo size="md" className="mx-auto" />

        <div className="space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Console Module Fault
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            The administrative console intercepted an unexpected error while executing this view.
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-left">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>INCIDENT REF:</span>
            <span className="font-bold text-primary">{incidentRef}</span>
          </div>
          {error?.message && (
            <p className="text-xs font-mono text-red-600 dark:text-red-400 mt-1 truncate">
              {error.message}
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => reset()}
            className="btn btn-primary w-full justify-center py-2.5 text-xs font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Console State</span>
          </button>

          <Link
            href="/"
            className="btn btn-secondary w-full justify-center py-2.5 text-xs font-semibold"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
