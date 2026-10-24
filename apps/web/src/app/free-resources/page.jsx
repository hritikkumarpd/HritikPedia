import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import NoteCard from '../../components/NoteCard';
import AdSlot from '../../components/AdSlot';
import { INITIAL_NOTES } from '@hritikpedia/shared/data';
import { Sparkles, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Free Study Resources & Revision Notes',
  description:
    'Access 100% free computer science study notes, revision cheat-sheets, syllabus blueprints, and worked solutions on Hritikpedia.',
};

export default function FreeResourcesPage() {
  const freeNotes = INITIAL_NOTES.filter((n) => n.isFree || n.price === 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-[#07172B] via-[#0B1D36] to-[#0A2548] rounded-3xl p-8 sm:p-12 text-white mb-10 shadow-md">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB923]" />
                <span>Zero-Cost Educational Initiative</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Free Revision Notes &amp; Blueprints
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                We believe core conceptual education should be accessible to all students. Browse 100% free chapter summaries, K-map tables, subnetting cheat-sheets, and official syllabus breakdowns.
              </p>
            </div>
          </div>

          <AdSlot slotId="home_top" />

          {/* Grid of Free Resources */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#07172B]">
                Available Free Study Notes ({freeNotes.length})
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                No credit card or payment required
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>

          {/* Ethical Notice */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-[#07172B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Free Tier Learning Guarantee</span>
            </h4>
            <p>
              Free resources on Hritikpedia include complete reading access in our web reader with zero artificial paywalls. All materials are created originally or legally compiled from open academic syllabi.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
