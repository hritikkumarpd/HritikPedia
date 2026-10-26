'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MailX, CheckCircle2, AlertCircle, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function UnsubscribeClient() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token') || '');
  }, []);

  const handleUnsubscribe = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Unable to unsubscribe right now.');

      setStatus('success');
      setMessage(data.message);
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  const shell = (children) => (
    <div className="card overflow-hidden border border-slate-200 dark:border-slate-800 p-0 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-5 py-3">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          <MailX className="h-3.5 w-3.5 text-primary" />
          HritikPedia Subscriptions
        </span>
        <span className="text-[10px] font-semibold text-slate-400">
          Instant Action
        </span>
      </div>
      <div className="p-6 text-center sm:p-8">{children}</div>
    </div>
  );

  if (!token) {
    return shell(
      <>
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <AlertCircle className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Unsubscribe Link Incomplete
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-slate-500">
          The link is missing the unique verification token. Please open the link directly from the footer of an official email.
        </p>
        <Link href="/contact" className="btn btn-primary btn-sm mt-5 inline-flex items-center gap-1">
          Contact Support
        </Link>
      </>
    );
  }

  if (status === 'success') {
    return shell(
      <>
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Successfully Unsubscribed
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-slate-600 dark:text-slate-400">{message}</p>
        <p className="mx-auto mt-3 max-w-xs text-[11px] text-slate-400">
          Essential transaction and security receipts will still be delivered if you make purchases.
        </p>
        <Link href="/" className="btn btn-primary btn-sm mt-5 inline-flex items-center gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Homepage
        </Link>
      </>
    );
  }

  if (status === 'error') {
    return shell(
      <>
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
          <AlertCircle className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Unsubscribe Request Failed
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-xs text-red-600 dark:text-red-400">{message}</p>
        <button type="button" onClick={handleUnsubscribe} className="btn btn-primary btn-sm mt-5">
          Retry Unsubscribe
        </button>
      </>
    );
  }

  return shell(
    <>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MailX className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        Unsubscribe from Study Guides?
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-slate-500">
        You will stop receiving new note announcements, exam updates, and editorial roadmaps. Essential order receipts will still be sent.
      </p>

      <button
        type="button"
        onClick={handleUnsubscribe}
        disabled={status === 'loading'}
        className="btn btn-primary btn-sm mt-6 w-full justify-center"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating preferences…
          </>
        ) : (
          'Confirm Unsubscribe'
        )}
      </button>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>One-click verified email link</span>
      </p>
    </>
  );
}
