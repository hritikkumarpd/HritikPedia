'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BookCover3D from '../../../components/Book3D';
import { useCart } from '../../../components/CartContext';
import {
  Star,
  CheckCircle2,
  ShoppingBag,
  Zap,
  FileText,
  Clock3,
  Globe2,
  Layers3,
  ChevronRight,
  Eye,
  BookOpen,
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { formatINR } from '@hritikpedia/shared/payment';

export default function NoteDetailClient({ note }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('description');

  const isFree = Boolean(note.isFree) || Number(note.price) === 0;
  const rating = Number(note.rating) || 4.8;
  const reviewsLabel =
    note.ratingStudents || (note.reviewsCount ? `${note.reviewsCount} reviews` : '1,240 students');
  const topics = Array.isArray(note.topicsCovered) ? note.topicsCovered : [];
  const lastUpdatedLabel = note.publishedAt
    ? new Date(note.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Recently updated';

  const color =
    note.color ||
    (note.slug?.includes('dbms')
      ? 'emerald'
      : note.slug?.includes('network')
        ? 'purple'
        : note.slug?.includes('operat')
          ? 'blue'
          : 'indigo');

  const highlights = [
    note.pageCount ? `${note.pageCount} pages of concise, high-yield notes` : 'Concise chapter-wise notes',
    topics.length > 0 ? `${topics.length} syllabus topics covered thoroughly` : 'Complete syllabus coverage',
    `${note.language || note.medium || 'English'} medium presentation`,
    'Instant web reader + downloadable offline PDF',
    isFree ? '100% Free lifetime access' : 'One-time payment · lifetime access with future updates',
  ];

  const tags =
    note.tags?.length > 0
      ? note.tags
      : ['PDF Notes', 'Diagrams', 'Solved PYQs', 'Exam Ready'];

  const handleBuyNow = () => {
    addToCart(note);
    router.push(`/checkout/${note.slug}`);
  };

  const tabs = [
    { id: 'description', label: 'Overview' },
    { id: 'toc', label: "What's Inside" },
    { id: 'sample', label: 'Sample Pages' },
    { id: 'reviews', label: 'Verified Reviews' },
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav
        className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link href="/notes" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Study Notes
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link
          href={`/subjects/${note.subjectSlug || ''}`}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {note.subjectName || 'Computer Science'}
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="truncate max-w-xs font-semibold text-slate-900 dark:text-white">
          {note.title}
        </span>
      </nav>

      {/* Main Grid: Cover Showcase & Note Details */}
      <div className="grid items-start gap-8 lg:grid-cols-12">
        {/* Left Gallery Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="badge badge-royal">
                <Eye className="h-3 w-3" />
                {note.hasPreview ? `${note.previewPages || 5} Free Preview Pages` : 'Preview Available'}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {note.pageCount || 1} Pages
              </span>
            </div>

            <div className="py-6 flex justify-center">
              <BookCover3D
                title={note.title}
                subject={note.subjectName || 'CSE'}
                color={color}
                size="lg"
                className="w-48 sm:w-56"
              />
            </div>

            <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                Editorial Verified
              </span>
              <span>Updated {lastUpdatedLabel}</span>
            </div>
          </div>

          {/* Sample Thumbnails */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Sample Pages
              </span>
              <Link
                href={`/reader/${note.slug}?preview=true`}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Full Screen Reader</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[1, 2, 3].map((page) => (
                <Link
                  key={page}
                  href={`/reader/${note.slug}?page=${page}`}
                  className="group relative flex h-24 flex-col justify-between overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 hover:border-blue-500 transition-colors"
                >
                  <div className="space-y-1 opacity-40 group-hover:opacity-60 transition-opacity">
                    <div className="h-1.5 w-3/4 rounded bg-slate-900 dark:bg-white" />
                    <div className="h-1 w-full rounded bg-slate-400" />
                    <div className="h-1 w-5/6 rounded bg-slate-400" />
                    <div className="h-1 w-2/3 rounded bg-slate-300 dark:bg-slate-600" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span>Page {page}</span>
                    <Eye className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Product Details Column */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge badge-royal font-bold">
                {note.examCategory || 'Exam Study Pack'}
              </span>
              <span className="badge badge-slate">
                {note.subjectName || 'Computer Science'}
              </span>
              {isFree ? (
                <span className="badge badge-mint font-bold">100% Free</span>
              ) : note.discountBadge ? (
                <span className="badge badge-amber font-bold">{note.discountBadge}</span>
              ) : null}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {note.title}
            </h1>
            {note.subtitle && (
              <p className="mt-1.5 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400">
                {note.subtitle}
              </p>
            )}

            <div className="mt-3 flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      rating >= i + 1 ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                ))}
                <span className="ml-1 font-bold text-slate-900 dark:text-white">
                  {rating.toFixed(1)}
                </span>
              </div>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{reviewsLabel}</span>
            </div>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {note.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Price & Purchase Actions Card */}
          <div className="card p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
            <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {isFree ? 'Open Access Resource' : 'One-Time Ownership'}
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-slate-900 dark:text-white">
                    {isFree ? 'Free' : formatINR(note.price)}
                  </span>
                  {!isFree && Number(note.originalPrice) > Number(note.price) && (
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      {formatINR(note.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200/80 dark:border-emerald-800/40">
                <Lock className="h-3.5 w-3.5" />
                <span>Instant Digital Access</span>
              </div>
            </div>

            <div className="pt-4">
              {isFree ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  <Link href={`/reader/${note.slug}`} className="btn btn-primary w-full py-2.5">
                    <BookOpen className="h-4 w-4" />
                    <span>Read Free Online</span>
                  </Link>
                  <Link
                    href={`/reader/${note.slug}?preview=true`}
                    className="btn btn-secondary w-full py-2.5"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview Sample Pages</span>
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="btn btn-primary w-full py-2.5 font-bold"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Buy Now &amp; Read</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addToCart(note)}
                    className="btn btn-secondary w-full py-2.5"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add to Study Bag</span>
                  </button>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Free sample preview
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  Razorpay UPI &amp; Cards
                </span>
                <span>Immediate PDF unlock</span>
              </div>
            </div>
          </div>

          {/* Highlights Checklist */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Key Features
            </h3>
            {highlights.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Format
              </span>
              <span className="font-semibold text-xs text-slate-900 dark:text-white mt-0.5 block">
                Web + PDF
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Pages
              </span>
              <span className="font-semibold text-xs text-slate-900 dark:text-white mt-0.5 block">
                {note.pageCount || 1} Pages
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Language
              </span>
              <span className="font-semibold text-xs text-slate-900 dark:text-white mt-0.5 block">
                {note.language || 'English'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Access
              </span>
              <span className="font-semibold text-xs text-slate-900 dark:text-white mt-0.5 block">
                Lifetime
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Overview, What's Inside, Sample, Reviews) */}
      <div className="card overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 px-6 pt-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'description' && (
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  About This Revision Edition
                </h3>
                <p>{note.description}</p>
                <p>
                  Structured specifically for competitive exam review: each chapter opens with fundamental
                  definitions and memory anchors, followed by circuit / block diagrams, solved numericals,
                  and past examination question proofs.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Targeted Exam Groups
                </h4>
                <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{note.examCategory || 'Bihar STET Paper-II Computer Science'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>BPSC Computer Teacher Recruitment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>B.Tech / MCA University Examinations</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'toc' && (
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mb-4">
                Syllabus Topics Covered
              </h3>
              {topics.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {topics.map((topic, idx) => (
                    <div
                      key={topic}
                      className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 p-3"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {topic}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Full topic breakdown is available directly inside the preview reader.
                </p>
              )}
            </div>
          )}

          {activeTab === 'sample' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  Preview Sample Pages Instantly
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-lg">
                  Open our interactive web reader to inspect sample diagrams, typography clarity,
                  and solution depth before purchasing.
                </p>
              </div>
              <Link
                href={`/reader/${note.slug}?preview=true`}
                className="btn btn-primary"
              >
                <Eye className="h-4 w-4" />
                <span>Launch Sample Reader</span>
              </Link>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
                <span className="font-display text-3xl font-black text-slate-900 dark:text-white">
                  {rating.toFixed(1)}
                </span>
                <div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 mt-1 block">
                    Verified student rating across {reviewsLabel}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-4 text-xs text-slate-500 leading-relaxed">
                Reviews are submitted by verified enrolled students after completing order verification.
                Every study pack undergoes rigorous editorial checking for syllabus accuracy.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
