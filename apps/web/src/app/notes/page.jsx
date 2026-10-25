import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import NotesCatalogClient from './NotesCatalogClient';
import { INITIAL_NOTES, INITIAL_SUBJECTS } from '@hritikpedia/shared/data';
import { BookOpen, Sparkles, GraduationCap } from 'lucide-react';

export const metadata = {
  title: 'All India Study Notes Catalog — UPSC, BPSC, SSC, CBSE, BSEB & Engineering',
  description:
    'Comprehensive study notes, formula sheets, chapter blueprints, and toppers handwritten notes for UPSC, BPSC, SSC, CBSE Class 10/12, BSEB Bihar Board, and Engineering Universities (AKTU/BEU).',
};

export default async function NotesPage({ searchParams }) {
  const resolvedParams = searchParams ? await searchParams : {};
  const initialDomain = resolvedParams.domain || 'all';
  const initialMedium = resolvedParams.medium || 'all';
  const initialTarget = resolvedParams.target || 'all';

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#087BFF] text-xs font-bold mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pan-India Study Notes Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#07172B] tracking-tight">
              Quality Study Notes &amp; Exam Blueprints
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#64748B] leading-relaxed">
              Explore chapter-wise verified notes across Govt. Exams (UPSC, BPSC, SSC), School Boards (CBSE, BSEB Matric &amp; Inter), and Engineering Universities (AKTU, BEU). Pure study notes with formula summaries, mind-maps, and watermarked online reading.
            </p>
          </div>

          {/* Ad Slot */}
          <AdSlot slotId="home_top" />

          {/* Client Filter & Grid */}
          <NotesCatalogClient
            initialNotes={INITIAL_NOTES}
            subjects={INITIAL_SUBJECTS}
            initialDomain={initialDomain}
            initialMedium={initialMedium}
            initialTarget={initialTarget}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
