'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Loader2,
  BookOpen,
  ShieldCheck,
  CalendarDays,
} from 'lucide-react';
import { formatINR } from '@hritikpedia/shared/payment';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadPurchases() {
      try {
        const res = await fetch('/api/student/purchases', { cache: 'no-store' });
        const data = await res.json();

        if (cancelled) return;

        if (res.ok) {
          setPurchases(data.purchases || []);
        } else {
          setError(data.error || 'Unable to load your order history right now.');
        }
      } catch {
        if (!cancelled) setError('Unable to load your order history right now.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPurchases();
    return () => {
      cancelled = true;
    };
  }, []);

  const paidCount = purchases.filter((p) => p.status === 'paid').length;
  const totalPaid = purchases
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="badge badge-primary">Financial Records</span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Orders &amp; Payment Receipts
            </h1>
            <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Verified payment references, itemized licenses, and instant shortcuts to your reader.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 text-center min-w-[5.5rem]">
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {paidCount}
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Completed
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 text-center min-w-[5.5rem]">
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {formatINR(totalPaid)}
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Lifetime Total
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card flex items-center justify-center gap-3 p-12 text-xs font-bold text-slate-500 border border-slate-200 dark:border-slate-800">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span>Loading payment receipts...</span>
        </div>
      ) : error ? (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-4 text-xs font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : purchases.length === 0 ? (
        <div className="card p-12 text-center border border-slate-200 dark:border-slate-800">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
            <Receipt className="h-7 w-7" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            No Purchases Recorded Yet
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-xs text-slate-500 leading-relaxed">
            When you unlock any study guide, its official transaction reference and receipt will be logged here.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <Link href="/notes" className="btn btn-primary btn-sm">
              <BookOpen className="h-3.5 w-3.5" />
              Explore Study Notes
            </Link>
            <Link href="/free-resources" className="btn btn-secondary btn-sm">
              Start with Free Packs
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card hidden overflow-hidden sm:block border border-slate-200 dark:border-slate-800 shadow-sm p-0">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-5 py-3.5">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Receipt className="h-4 w-4 text-primary" />
                Transaction Ledger
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {purchases.length} {purchases.length === 1 ? 'transaction' : 'transactions'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Order Reference</th>
                    <th className="px-5 py-3.5">Study Pack Title</th>
                    <th className="px-5 py-3.5">Paid Amount</th>
                    <th className="px-5 py-3.5">Payment Status</th>
                    <th className="px-5 py-3.5 text-right">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {purchases.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-slate-500">
                        {new Date(p.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {p.order_id}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-900 dark:text-white">{p.note_title}</span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-900 dark:text-white">
                        {formatINR(p.amount)}
                      </td>
                      <td className="px-5 py-4">
                        {p.status === 'paid' ? (
                          <span className="badge badge-primary bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </span>
                        ) : (
                          <span className="badge badge-secondary bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <Clock className="h-3 w-3" />
                            {p.status}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {p.status === 'paid' ? (
                          <Link
                            href={`/reader/${p.note_slug}`}
                            className="btn btn-secondary btn-sm inline-flex items-center gap-1 text-primary font-bold"
                          >
                            Open Reader
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : (
                          <Link
                            href={`/checkout/${p.note_slug}`}
                            className="btn btn-primary btn-sm inline-flex items-center gap-1"
                          >
                            Complete
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 sm:hidden">
            {purchases.map((p) => (
              <article key={p.id} className="card p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    {p.order_id}
                  </span>
                  {p.status === 'paid' ? (
                    <span className="badge badge-primary bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="h-3 w-3" />
                      Paid
                    </span>
                  ) : (
                    <span className="badge badge-secondary bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      <Clock className="h-3 w-3" />
                      {p.status}
                    </span>
                  )}
                </div>

                <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                  {p.note_title}
                </h3>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(p.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {formatINR(p.amount)}
                  </span>
                </div>

                <Link
                  href={
                    p.status === 'paid'
                      ? `/reader/${p.note_slug}`
                      : `/checkout/${p.note_slug}`
                  }
                  className="btn btn-primary btn-sm mt-4 w-full justify-center"
                >
                  {p.status === 'paid' ? 'Open Secured Reader' : 'Complete Payment'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-4">
            <p className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              Payments are encrypted &amp; processed via Razorpay. Need an official tax invoice? Contact student support with your reference ID.
            </p>
            <Link
              href="/contact"
              className="text-xs font-bold text-primary hover:underline whitespace-nowrap"
            >
              Contact Support
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
