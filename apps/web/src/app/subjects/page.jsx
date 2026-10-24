import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SubjectCard from '../../components/SubjectCard';
import AdSlot from '../../components/AdSlot';
import { INITIAL_SUBJECTS } from '@hritikpedia/shared/data';
import { Layers, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'All Subjects — Computer Science & Engineering Syllabi',
  description:
    'Browse organized study notes and revision materials categorized by Computer Science subjects including DBMS, Operating Systems, Computer Networks, Digital Logic, and Bihar STET.',
};

export default function SubjectsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#087BFF] text-xs font-bold mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Academic Curriculum Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#07172B] tracking-tight">
              Core Engineering &amp; Exam Subjects
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#64748B] leading-relaxed">
              Explore subject-specific note libraries, topic breakdowns, and exam blueprints curated for university semesters, GATE, and teacher recruitment tests.
            </p>
          </div>

          {/* Ad Slot */}
          <AdSlot slotId="subject_top" />

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {INITIAL_SUBJECTS.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
