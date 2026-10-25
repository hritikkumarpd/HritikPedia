import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdSlot from '../../components/AdSlot';
import SubjectsCatalogClient from './SubjectsCatalogClient';
import { INITIAL_SUBJECTS } from '@hritikpedia/shared/data';
import { Layers } from 'lucide-react';

export const metadata = {
  title: 'All Academic Subjects — Govt. Exams, Board Exams & Engineering Universities',
  description:
    'Browse organized study notes and revision materials categorized by academic domain: UPSC/BPSC Civil Services, CBSE & BSEB 10th/12th Boards, AKTU & BEU Engineering departments, and BCA degree courses.',
};

export default async function SubjectsPage({ searchParams }) {
  const resolvedParams = searchParams ? await searchParams : {};
  const initialDomain = resolvedParams.domain || 'all';

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#087BFF] text-xs font-bold mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Pan-India Curriculum Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#07172B] tracking-tight">
              Academic &amp; Competitive Exam Subjects
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#64748B] leading-relaxed">
              Explore subject-specific note libraries, topic breakdowns, and exam blueprints curated for Govt. Exams (UPSC, BPSC, SSC), School Boards (CBSE, BSEB), and Engineering Universities (AKTU, BEU).
            </p>
          </div>

          {/* Ad Slot */}
          <AdSlot slotId="subject_top" />

          {/* Interactive Subjects Catalog with Domain Filters */}
          <div className="mt-8">
            <SubjectsCatalogClient initialSubjects={INITIAL_SUBJECTS} initialDomain={initialDomain} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
