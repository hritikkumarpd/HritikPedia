import React from 'react';
import Link from 'next/link';
import BrandLogo from '../components/BrandLogo';
import { Home } from 'lucide-react';

export const metadata = {
  title: '404 - Admin View Not Found | HritikPedia',
  robots: { index: false, follow: false },
};

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center text-slate-900 dark:text-slate-100">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <BrandLogo size="md" className="mx-auto" />

        <div className="space-y-2">
          <span className="text-6xl font-black text-primary font-mono tracking-tighter">404</span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Administrative Route Not Found
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            The requested console view or API endpoint does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="btn btn-primary w-full justify-center py-2.5"
          >
            <Home className="w-4 h-4" />
            <span>Return to Admin Console</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
