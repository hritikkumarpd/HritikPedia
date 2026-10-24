import React from 'react';
import Link from 'next/link';
import BrandLogo from '../components/BrandLogo';
import { Shield, Home, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '404 - Admin View Not Found | Hritikpedia',
  robots: { index: false, follow: false },
};

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-[#07172B] flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-[#0B1D36] p-8 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
        <BrandLogo size="md" theme="dark" className="mx-auto" />

        <div className="space-y-2">
          <span className="text-5xl font-black text-blue-500 font-mono">404</span>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Administrative Route Not Found
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            The requested console view or API endpoint does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Admin Console</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
