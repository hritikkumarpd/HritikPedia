import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import UnsubscribeClient from './UnsubscribeClient';
import { MailX, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Unsubscribe from HritikPedia Emails',
  description: 'Manage your HritikPedia newsletter subscription.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnsubscribePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />

      <main
        id="main-content"
        className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16 sm:py-24"
      >
        <div className="relative w-full max-w-lg">
          <div className="mb-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 shadow-sm">
              <MailX className="h-6 w-6" />
            </span>
            <span className="mt-4 badge badge-secondary">Email Notification Preferences</span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Newsletter Subscription
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-xs text-slate-500 leading-relaxed">
              We respect your inbox. You can unsubscribe anytime while keeping full access to your study library.
            </p>
          </div>

          <UnsubscribeClient />

          <div className="mt-6 flex items-center justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to HritikPedia Library
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
