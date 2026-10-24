'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import BrandLogo from '../../../components/BrandLogo';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Lock,
  ShieldCheck,
  AlertCircle,
  ShoppingCart,
  Loader2,
  ArrowLeft,
  FileText,
  Sparkles,
} from 'lucide-react';

export default function ReaderPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = params?.slug;
  const isPreviewParam = searchParams.get('preview') === 'true';

  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWatermarkInfo, setShowWatermarkInfo] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchDocument() {
      if (!slug) return;
      setLoading(true);
      setError(null);

      try {
        const queryParam = isPreviewParam ? '?preview=true' : '';
        const res = await fetch(`/api/reader/${slug}${queryParam}`);
        const data = await res.json();

        if (res.ok) {
          setDocData(data);
          setCurrentPage(1);
        } else {
          setError(data);
        }
      } catch (err) {
        setError({ error: 'Network error loading reader' });
      } finally {
        setLoading(false);
      }
    }

    fetchDocument();
  }, [slug, isPreviewParam]);

  // Anti-piracy: disable right-click context menu in reader
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const totalPages = docData?.allowedPages?.length || 1;

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 175) setZoomLevel((z) => z + 15);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 70) setZoomLevel((z) => z - 15);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07172B] text-white">
        <Loader2 className="w-10 h-10 text-[#087BFF] animate-spin mb-4" />
        <h2 className="text-lg font-bold">Initializing Secure Reader...</h2>
        <p className="text-xs text-slate-400 mt-1">Generating user-specific security watermarks</p>
      </div>
    );
  }

  // Handle Unauthorized / Purchase Required States
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07172B] text-white p-4 text-center">
        <div className="max-w-md w-full bg-[#0B1D36] p-8 rounded-3xl border border-slate-700 shadow-xl space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-[#FFB923] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">Access Restricted</h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              {error.error || 'You do not have active entitlement to view this paid study note.'}
            </p>
          </div>

          <div className="space-y-2.5">
            {error.previewAvailable && (
              <Link
                href={`/reader/${slug}?preview=true`}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] transition-colors flex items-center justify-center gap-2"
              >
                <span>Read Free Sample Preview</span>
              </Link>
            )}

            {error.requiresPurchase && (
              <Link
                href={`/checkout/${slug}`}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-[#07172B] bg-[#FFB923] hover:bg-[#ffd058] transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Unlock Full Access (₹{error.price})</span>
              </Link>
            )}

            {error.requiresAuth && (
              <Link
                href="/login"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] transition-colors flex items-center justify-center gap-2"
              >
                <span>Log In with Student Account</span>
              </Link>
            )}

            <Link
              href={`/notes/${slug}`}
              className="w-full py-2 px-4 rounded-xl text-xs text-slate-400 hover:text-white transition-colors block"
            >
              Back to Note Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { note, watermark, mode } = docData;
  const isPreviewMode = mode === 'preview';

  return (
    <div
      ref={containerRef}
      onContextMenu={handleContextMenu}
      className="min-h-screen flex flex-col bg-[#07172B] text-slate-100 select-none overflow-x-hidden font-sans"
    >
      {/* Print prevention style injection */}
      <style jsx global>{`
        @media print {
          body {
            display: none !important;
          }
        }
      `}</style>

      {/* TOP READER TOOLBAR */}
      <header className="h-16 bg-[#0B1D36] border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href={`/notes/${note.slug}`}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Exit Reader"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Reader</span>
          </Link>

          <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 hidden md:inline">
              {note.subjectName}
            </span>
            <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {note.title}
            </h1>
          </div>
        </div>

        {/* Center: Page Navigation Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-1.5 sm:p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-40 transition-colors"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1 text-xs font-bold px-2 sm:px-3 py-1 bg-[#07172B] rounded-lg border border-slate-700">
            <span className="text-white">{currentPage}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{totalPages}</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="p-1.5 sm:p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-40 transition-colors"
            aria-label="Next Page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Zoom & Security Indicators */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-[#07172B] p-1 rounded-lg border border-slate-800">
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-slate-300">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-400 hover:text-white rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowWatermarkInfo(!showWatermarkInfo)}
            className="p-2 text-emerald-400 hover:bg-slate-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Watermark & Anti-Piracy Details"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden xl:inline text-[11px]">Watermarked</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* SAMPLE PREVIEW WARNING BANNER */}
      {isPreviewMode && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-[#07172B] px-4 py-2.5 text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-xs z-30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>
              Preview Mode: You are viewing sample pages 1 to {totalPages} of {note.pageCount} total pages.
            </span>
          </div>
          <Link
            href={`/checkout/${note.slug}`}
            className="px-3.5 py-1 text-xs font-black text-white bg-[#07172B] hover:bg-[#0B1D36] rounded-lg transition-colors shadow-xs"
          >
            Unlock Complete Note for ₹{note.price} &rarr;
          </Link>
        </div>
      )}

      {/* WATERMARK INFO MODAL */}
      {showWatermarkInfo && (
        <div className="bg-[#0B1D36] border-b border-slate-700 px-6 py-4 text-xs text-slate-300 flex items-start justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            <p className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>User-Specific Watermark Metadata</span>
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed max-w-3xl">
              Watermark Stamp: <strong className="text-slate-200">{watermark.primaryText}</strong>.
              Pages are rendered on demand. Downloads and native printing are disabled.
              Honest Disclosure: While canvas rendering and user-specific watermarking strongly deter piracy and trace leakage, screenshots cannot be 100% prevented by any browser technology.
            </p>
          </div>
          <button
            onClick={() => setShowWatermarkInfo(false)}
            className="text-xs text-slate-400 hover:text-white font-bold"
          >
            Close
          </button>
        </div>
      )}

      {/* MAIN DOCUMENT CANVAS VIEWER CONTAINER */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <div
          className="relative bg-white text-[#26354B] shadow-2xl rounded-xl overflow-hidden transition-all duration-200 border border-slate-700"
          style={{
            width: `${Math.round(800 * (zoomLevel / 100))}px`,
            minHeight: `${Math.round(1100 * (zoomLevel / 100))}px`,
          }}
        >
          {/* DIAGONAL REPEATING SVG WATERMARK OVERLAY */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden flex flex-col justify-around opacity-15">
            {Array.from({ length: 7 }).map((_, rIdx) => (
              <div
                key={rIdx}
                className="transform -rotate-25 whitespace-nowrap text-center text-slate-800 font-black tracking-wider text-xs sm:text-sm select-none"
              >
                {watermark.lineText}
              </div>
            ))}
          </div>

          {/* DOCUMENT PAGE SHEET CONTENT */}
          <div className="p-8 sm:p-14 space-y-6 relative z-10">
            {/* Sheet Page Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 text-xs text-slate-500">
              <span className="font-bold text-[#07172B] tracking-tight">
                HRITIKPEDIA ACADEMIC ARCHIVES
              </span>
              <span>
                Page {currentPage} of {note.pageCount}
              </span>
            </div>

            {/* Simulated High-Fidelity Study Note Content */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-[#087BFF] uppercase tracking-wider block">
                {note.subjectName} • Chapter Section {currentPage}
              </span>

              <h2 className="text-xl sm:text-2xl font-black text-[#07172B] tracking-tight">
                {note.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {note.description}
              </p>

              {/* Conceptual Diagram / Structural Chart Box */}
              <div className="my-6 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-[#07172B] block">
                  Core Architectural Concept &amp; Transition Diagram:
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 font-bold text-[#07172B]">
                    1. Functional Dependencies
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 font-bold text-[#087BFF]">
                    2. Normal Forms (1NF &rarr; BCNF)
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 font-bold text-emerald-700">
                    3. Dependency Preservation
                  </div>
                </div>
              </div>

              {/* Chapter Key Explanations */}
              <div className="space-y-3 text-xs sm:text-sm text-[#26354B] leading-relaxed">
                <h3 className="font-bold text-base text-[#07172B]">
                  Analytical Summary &amp; Key Theorems:
                </h3>
                <p>
                  In relational database design, the primary goal of decomposition is to eliminate data redundancy, update anomalies, and insertion anomalies without losing data (Lossless Join) and without losing constraints (Dependency Preservation).
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li><strong>Lossless-Join Condition:</strong> If relation R is decomposed into R1 and R2, the intersection of attributes must contain a candidate key of at least one of the sub-relations.</li>
                  <li><strong>Boyce-Codd Normal Form:</strong> A relation schema R is in BCNF with respect to a set F of functional dependencies if, for all functional dependencies in F+ of the form X &rarr; Y, X is a superkey for R.</li>
                  <li><strong>Minimal Cover Algorithm:</strong> Convert all RHS attributes to singleton form, eliminate extraneous LHS attributes, and eliminate redundant functional dependencies.</li>
                </ul>
              </div>
            </div>

            {/* Sheet Page Footer */}
            <div className="pt-8 mt-12 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
              <span>Licensed exclusively to: {watermark.maskedEmail}</span>
              <span>{watermark.timestamp}</span>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM READER FOOTER CONTROLS */}
      <footer className="h-12 bg-[#0B1D36] border-t border-slate-800 px-4 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <span className="truncate max-w-[200px] sm:max-w-md">
          {watermark.disclaimer}
        </span>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline">Use &larr; &rarr; arrow keys to turn pages</span>
          <span className="font-bold text-slate-300">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </footer>
    </div>
  );
}
