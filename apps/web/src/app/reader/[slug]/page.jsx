'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  Printer,
  Loader2,
  Lock,
  ShoppingCart,
  AlertCircle,
  Eye,
  ShieldCheck,
  FileText,
  BookOpen,
} from 'lucide-react';

const SAMPLE_CHAPTER_TITLE = 'Number System & Digital Logic';

export default function ReaderPage() {
  const params = useParams();
  const slug = params?.slug;

  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState(null);
  const [denied, setDenied] = useState(null);
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const loadAccess = async ({ preview = false } = {}) => {
    setLoading(true);
    setError('');
    setDenied(null);

    try {
      const url = `/api/reader/${encodeURIComponent(slug)}${preview ? '?preview=true' : ''}`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();

      if (res.ok) {
        setAccess(data);
        const requested = Number(
          new URLSearchParams(window.location.search).get('page')
        );
        const pageTotal = (data.allowedPages || []).length;
        const safePage =
          Number.isFinite(requested) && requested >= 1
            ? Math.min(Math.floor(requested), Math.max(pageTotal, 1))
            : 1;
        setCurrentPage(safePage);
      } else {
        setDenied({ status: res.status, ...data });
      }
    } catch {
      setError('Unable to reach the secure reader. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) loadAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const allowedPages = access?.allowedPages || [];
  const totalPages = Math.max(1, allowedPages.length);
  const note = access?.note;

  const thumbnails = useMemo(() => {
    if (!allowedPages.length) return [];
    const first = allowedPages.slice(0, 5);
    if (allowedPages.length > 5) {
      const last = allowedPages[allowedPages.length - 1];
      if (!first.includes(last)) first[first.length - 1] = last;
    }
    return first;
  }, [allowedPages]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Verifying your secure reading session...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-50 dark:bg-slate-950 p-6 text-center text-slate-800 dark:text-slate-200">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 shadow-sm">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="max-w-md space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Connection Error</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{error}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => loadAccess()} className="btn btn-secondary">
            Retry Access
          </button>
          <Link href={`/notes/${slug}`} className="btn btn-primary">
            Back to Note
          </Link>
        </div>
      </div>
    );
  }

  // Locked / purchase-required state
  if (!access && denied) {
    const isAuthProblem = denied.status === 401 || denied.requiresAuth;
    const canPreview = denied.previewAvailable;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <div className="card w-full max-w-md overflow-hidden p-0 text-left shadow-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 px-5 py-3.5">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-4 w-4" />
              Verified Edition
            </span>
            <span className="text-xs font-semibold text-slate-400">
              HritikPedia Reader
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Lock className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isAuthProblem ? 'Authentication Required' : 'Premium Document Access'}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {denied.error ||
                  'This complete study module is protected under copyright. Log in with your verified account or unlock the full pack.'}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              {isAuthProblem ? (
                <Link
                  href={`/login?redirect=/reader/${slug}`}
                  className="btn btn-primary w-full justify-center"
                >
                  Log In to Access Document
                </Link>
              ) : (
                <Link href={`/checkout/${slug}`} className="btn btn-primary w-full justify-center">
                  <ShoppingCart className="h-4 w-4" />
                  Unlock Full Access
                </Link>
              )}

              {canPreview && (
                <button
                  type="button"
                  onClick={() => loadAccess({ preview: true })}
                  className="btn btn-secondary w-full justify-center"
                >
                  <Eye className="h-4 w-4" />
                  Read Free Sample Pages
                </button>
              )}

              <Link
                href={`/notes/${slug}`}
                className="mt-2 text-center text-xs font-medium text-slate-500 hover:text-primary transition-colors"
              >
                Return to Syllabus Overview
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!access || !note) return null;

  const isPreviewMode = access.mode === 'preview';

  return (
    <div className="flex min-h-screen select-none flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Reader header */}
      <header className="sticky top-0 z-40 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-3 py-2.5 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={`/notes/${note.slug}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 transition-colors hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
              title="Return to note overview"
              aria-label="Return to note overview"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                  <BookOpen className="h-3 w-3" />
                  Reader
                </span>
                {isPreviewMode && (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Sample Mode ({access.previewPages} pages)
                  </span>
                )}
              </div>
              <h1 className="block max-w-[14rem] sm:max-w-md md:max-w-xl truncate text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {note.title}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Page pagination */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="cursor-pointer rounded-lg p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[4rem] text-center text-xs font-bold tabular-nums text-slate-700 dark:text-slate-300">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="cursor-pointer rounded-lg p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Zoom controls */}
            <div className="hidden sm:flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-1">
              <button
                onClick={() => setZoom((z) => Math.max(75, z - 10))}
                className="cursor-pointer rounded-lg p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                title="Zoom out"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-400">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(150, z + 10))}
                className="cursor-pointer rounded-lg p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                title="Zoom in"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            {note.printAllowed && (
              <button
                onClick={() => window.print()}
                className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Print licensed document"
              >
                <Printer className="h-4 w-4" />
              </button>
            )}

            {isPreviewMode && (
              <Link
                href={`/checkout/${note.slug}`}
                className="btn btn-primary btn-sm text-xs"
              >
                Unlock Full Pack
              </Link>
            )}
          </div>
        </div>
      </header>

      {isPreviewMode && (
        <div className="border-b border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/30 px-4 py-2 text-center text-xs font-medium text-amber-800 dark:text-amber-300">
          Viewing {access.previewPages} sample pages of {note.pageCount || totalPages} total pages.{' '}
          <Link href={`/checkout/${note.slug}`} className="font-bold underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-100">
            Unlock the complete handbook
          </Link>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Thumbnails Sidebar */}
        <aside className="hidden md:block w-36 shrink-0 overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Document Map
          </p>
          <div className="space-y-3">
            {thumbnails.map((p) => {
              const isSelected = currentPage === allowedPages.indexOf(p) + 1;
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(allowedPages.indexOf(p) + 1)}
                  className={`group w-full rounded-xl p-2 text-center transition-all ${
                    isSelected
                      ? 'bg-primary/10 ring-2 ring-primary shadow-sm'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                  aria-label={`Go to page ${p}`}
                >
                  <div className="flex h-24 w-full flex-col justify-between overflow-hidden rounded-lg bg-white dark:bg-slate-800 p-2 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="space-y-1 opacity-60">
                      <div className="h-1.5 w-2/3 rounded-full bg-primary" />
                      <div className="h-1 w-full rounded-full bg-slate-300 dark:bg-slate-600" />
                      <div className="h-1 w-4/5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <div className="h-1 w-3/5 rounded-full bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <span className="block text-center text-[9px] font-bold text-slate-400">P. {p}</span>
                  </div>
                  <span
                    className={`mt-1.5 block text-[11px] font-bold ${
                      isSelected ? 'text-primary' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                    }`}
                  >
                    Page {p}
                  </span>
                </button>
              );
            })}
          </div>

          <Link
            href={`/notes/${note.slug}`}
            className="mt-6 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            Syllabus
          </Link>
        </aside>

        {/* Document reading canvas */}
        <main className="flex flex-1 justify-center overflow-y-auto bg-slate-200/60 dark:bg-slate-950 p-4 sm:p-8">
          <div
            className="relative flex min-h-[960px] w-full max-w-[760px] flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-8 sm:p-14 text-slate-900 dark:text-slate-100 shadow-xl border border-slate-200 dark:border-slate-800 transition-transform duration-150"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            {/* Dynamic Watermark overlay for copyright protection */}
            {access.watermark && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-20 overflow-hidden text-center select-none"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="whitespace-nowrap font-mono font-bold tracking-widest"
                    style={{
                      transform: `rotate(${access.watermark.rotationAngle || -30}deg)`,
                      opacity: access.watermark.opacity || 0.08,
                      fontSize: `${access.watermark.fontSize || 14}px`,
                      color: 'currentColor',
                    }}
                  >
                    {access.watermark.primaryText}
                  </span>
                ))}
              </div>
            )}

            {/* Document Header & Chapter Content */}
            <div className="relative z-0 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Module 01 • Chapter Note
                  </span>
                  <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {SAMPLE_CHAPTER_TITLE}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    HritikPedia Certified
                  </span>
                </div>
              </div>

              {/* Sample academic content */}
              <section className="space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 dark:bg-primary/20 px-2.5 py-1 text-xs font-bold text-primary">
                  1.1 Number System Foundation
                </div>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  A positional number system represents numeric values using an ordered set of symbols (digits),
                  where the contribution of each digit depends both on the value of the symbol and its specific power-of-base positional weight.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {[
                    { base: 'Base 2', name: 'Binary', digits: '0, 1' },
                    { base: 'Base 8', name: 'Octal', digits: '0 to 7' },
                    { base: 'Base 10', name: 'Decimal', digits: '0 to 9' },
                    { base: 'Base 16', name: 'Hexadecimal', digits: '0-9, A-F' },
                  ].map((sys) => (
                    <div key={sys.name} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-2.5">
                      <span className="text-[10px] font-bold text-primary uppercase">{sys.base}</span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{sys.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{sys.digits}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-3 pt-2">
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 dark:bg-primary/20 px-2.5 py-1 text-xs font-bold text-primary">
                  1.2 Weighted Positional Evaluation
                </div>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  The general formula to evaluate any number in radix-b:
                </p>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  <div className="font-semibold text-primary mb-1">General Expansion Formula:</div>
                  <p className="text-slate-900 dark:text-white font-bold">
                    N = d<sub>n-1</sub>·r<sup>n-1</sup> + ... + d<sub>1</sub>·r<sup>1</sup> + d<sub>0</sub>·r<sup>0</sup> + d<sub>-1</sub>·r<sup>-1</sup>
                  </p>
                  <div className="mt-2.5 border-t border-slate-200 dark:border-slate-700/60 pt-2 text-xs text-slate-600 dark:text-slate-400">
                    Example: (275.4)₁₀ = 2×10² + 7×10¹ + 5×10⁰ + 4×10⁻¹ = 200 + 70 + 5 + 0.4
                  </div>
                </div>
              </section>

              <section className="space-y-3 pt-2">
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 dark:bg-primary/20 px-2.5 py-1 text-xs font-bold text-primary">
                  1.3 Rapid Radix Conversion Shortcuts
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span><strong>Binary to Octal:</strong> Group bits in triads (groups of 3) starting from the binary point.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span><strong>Binary to Hexadecimal:</strong> Group bits into nibbles (groups of 4) from the binary point.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span><strong>Decimal to Any Radix:</strong> Divide integer part successively by radix; multiply fractional part successively by radix.</span>
                  </li>
                </ul>
              </section>
            </div>

            {/* Document Footer */}
            <div className="relative z-0 mt-12 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">HritikPedia Academic Editions • All Rights Reserved</span>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                Page {allowedPages[currentPage - 1] || currentPage}
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
