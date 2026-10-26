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
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 text-center text-slate-900 dark:text-slate-100">
      <div className="card w-full max-w-md p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
        <BrandLogo size="md" className="mx-auto" />

        <span className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 shadow-sm">
          <AlertTriangle className="h-7 w-7" />
        </span>

        <span className="mt-4 badge badge-secondary">Runtime Exception Caught</span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Unexpected Application Hiccup
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-xs text-slate-500 leading-relaxed">
          An unexpected interruption occurred. Our automated diagnostic alerts have logged this event for rapid triage.
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5 text-left">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span>DIAGNOSTIC REF:</span>
            <span className="font-bold text-slate-900 dark:text-white">{errorRef}</span>
          </div>
          {error?.message && (
            <p className="mt-1.5 truncate font-mono text-[11px] text-red-600 dark:text-red-400 font-semibold">{error.message}</p>
          )}
        </div>

        <div className="mt-6 space-y-2.5">
          <button onClick={() => reset()} className="btn btn-primary w-full justify-center">
            <RefreshCw className="h-4 w-4" />
            Reload This Section
          </button>

          <Link href="/" className="btn btn-secondary w-full justify-center">
            <Home className="h-4 w-4" />
            Return to Homepage
          </Link>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldAlert className="h-3.5 w-3.5 text-primary" />
          <span>HritikPedia High-Availability Core</span>
        </p>
      </div>
    </div>
  );
}
