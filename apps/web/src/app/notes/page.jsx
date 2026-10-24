import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import NotesCatalogClient from './NotesCatalogClient';
import { INITIAL_NOTES, INITIAL_SUBJECTS } from '@hritikpedia/shared/data';
import { BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Complete Notes Catalog — Computer Science & Engineering Study Materials',
  description:
    'Explore verified study notes for DBMS, Operating Systems, Computer Networks, Digital Logic, Algorithms, and Bihar STET preparation with secure online reading.',
};

export default function NotesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#087BFF] text-xs font-bold mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Study Notes Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#07172B] tracking-tight">
              Quality Study Notes &amp; Exam Materials
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#64748B] leading-relaxed">
              Every chapter note includes conceptual diagrams, formula summaries, algorithm steps, and watermarked online reading.
            </p>
          </div>

          {/* Ad Slot */}
          <AdSlot slotId="home_top" />

          {/* Client Filter & Grid */}
          <NotesCatalogClient initialNotes={INITIAL_NOTES} subjects={INITIAL_SUBJECTS} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
