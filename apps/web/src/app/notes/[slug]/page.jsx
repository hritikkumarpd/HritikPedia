import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import NoteCard from '../../../components/NoteCard';
import AdSlot from '../../../components/AdSlot';
import { INITIAL_NOTES, INITIAL_SUBJECTS } from '@hritikpedia/shared/data';
import { formatINR } from '@hritikpedia/shared/payment';
import {
  BookOpen,
  Eye,
  ShoppingCart,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Star,
  Calendar,
  User,
  Sparkles,
  Lock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const note = INITIAL_NOTES.find((n) => n.slug === resolvedParams.slug);
  if (!note) return { title: 'Note Not Found' };

  return {
    title: `${note.title} — Study Notes`,
    description: note.description,
    openGraph: {
      title: `${note.title} | Hritikpedia`,
      description: note.description,
      type: 'article',
      url: `/notes/${note.slug}`,
    },
  };
}

export default async function NoteDetailPage({ params }) {
  const resolvedParams = await params;
  const note = INITIAL_NOTES.find((n) => n.slug === resolvedParams.slug);

  if (!note) {
    notFound();
  }

  const isFree = note.isFree || Number(note.price) === 0;
  const relatedNotes = INITIAL_NOTES.filter(
    (n) => n.id !== note.id && (n.subjectId === note.subjectId || n.isFeatured)
  ).slice(0, 3);

  // Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: note.title,
    description: note.description,
    category: note.subjectName,
    offers: {
      '@type': 'Offer',
      price: isFree ? '0' : String(note.price),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(note.rating || '4.9'),
      reviewCount: '48',
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#087BFF]">Home</Link>
            <span>/</span>
            <Link href="/notes" className="hover:text-[#087BFF]">Notes</Link>
            <span>/</span>
            <Link href={`/subjects/${note.subjectSlug}`} className="hover:text-[#087BFF]">
              {note.subjectName}
            </Link>
            <span>/</span>
            <span className="text-[#07172B] font-semibold truncate max-w-[200px]">
              {note.title}
            </span>
          </nav>

          {/* Product Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left 2 Cols: Main Product Presentation */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                {/* Subject and Category Badge */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Link
                    href={`/subjects/${note.subjectSlug}`}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#087BFF] hover:bg-blue-100 transition-colors"
                  >
                    {note.subjectName}
                  </Link>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {note.topic}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">
                    {note.examCategory}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#07172B] tracking-tight leading-tight mb-4">
                  {note.title}
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base text-[#64748B] leading-relaxed mb-6">
                  {note.description}
                </p>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FileText className="w-4 h-4 text-[#087BFF]" />
                    {note.pageCount} Pages
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 font-medium text-amber-600">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {note.rating || '4.9'} / 5.0 Rating
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <User className="w-4 h-4 text-slate-400" />
                    Author: {note.author}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Updated: {note.publishedAt}
                  </span>
                </div>
              </div>

              {/* Topics Covered Checklist */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <h2 className="text-lg font-bold text-[#07172B] mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Key Chapters &amp; Topics Covered</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {note.topicsCovered?.map((topic, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2.5 text-xs text-[#26354B] font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#087BFF] shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security & Watermark Guarantee */}
              <div className="p-6 rounded-3xl bg-blue-50/60 border border-blue-200/80 text-xs text-[#26354B] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#07172B] text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#087BFF]" />
                  <span>Protected Reading &amp; Anti-Piracy Policy</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  To protect content integrity, this document is read inside Hritikpedia&apos;s secure online reader.
                  Every page displays a repeating dynamic watermark with your registered masked email and timestamp.
                  Direct file downloads and printing are disabled by default.
                </p>
              </div>
            </div>

            {/* Right Column: Pricing & Purchase Card (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-md space-y-6">
                {/* Price Display */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Access Type
                    </span>
                    {isFree ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        100% Free
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFB923]/20 text-[#07172B] border border-[#FFB923]/40">
                        Lifetime Access
                      </span>
                    )}
                  </div>

                  {isFree ? (
                    <div className="text-3xl font-black text-emerald-600">₹0</div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#07172B]">
                        {formatINR(note.price)}
                      </span>
                      {note.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">
                          {formatINR(note.originalPrice)}
                        </span>
                      )}
                      <span className="text-xs font-bold text-emerald-600">
                        Save 50%
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-slate-400 mt-1">
                    {isFree ? 'Read online anytime without payment' : 'One-time payment • No recurring subscriptions'}
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-3">
                  {isFree ? (
                    <Link
                      href={`/reader/${note.slug}`}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Start Reading Free Now</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/checkout/${note.slug}`}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#087BFF] hover:bg-[#1688FF] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Get Instant Access — {formatINR(note.price)}</span>
                    </Link>
                  )}

                  {note.hasPreview && (
                    <Link
                      href={`/reader/${note.slug}?preview=true`}
                      className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-[#07172B] bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4 text-[#087BFF]" />
                      <span>Preview First {note.previewPages || 5} Sample Pages</span>
                    </Link>
                  )}
                </div>

                {/* Included Features List */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant access via student dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full reading on desktop &amp; mobile browser</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>User-specific watermarking protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Verified Razorpay payment gateway</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ad Slot */}
          <AdSlot slotId="public_note_page" />

          {/* Related Notes */}
          {relatedNotes.length > 0 && (
            <div className="mt-14 pt-10 border-t border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#07172B]">
                  More Notes in {note.subjectName}
                </h3>
                <Link
                  href={`/subjects/${note.subjectSlug}`}
                  className="text-xs font-bold text-[#087BFF] hover:underline flex items-center gap-1"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedNotes.map((rel) => (
                  <NoteCard key={rel.id} note={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
