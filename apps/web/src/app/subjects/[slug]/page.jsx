import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import NoteCard from '../../../components/NoteCard';
import AdSlot from '../../../components/AdSlot';
import { INITIAL_SUBJECTS, INITIAL_NOTES } from '@hritikpedia/shared/data';
import {
  Layers,
  BookOpen,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  FileText,
} from 'lucide-react';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const subject = INITIAL_SUBJECTS.find((s) => s.slug === resolvedParams.slug);
  if (!subject) return { title: 'Subject Not Found' };

  return {
    title: `${subject.name} Notes & Syllabus Guide`,
    description: `Download and read verified study notes, chapter summaries, and theoretical solutions for ${subject.name} on Hritikpedia.`,
  };
}

export default async function SubjectDetailPage({ params }) {
  const resolvedParams = await params;
  const subject = INITIAL_SUBJECTS.find((s) => s.slug === resolvedParams.slug);

  if (!subject) {
    notFound();
  }

  // Get notes for this subject
  const subjectNotes = INITIAL_NOTES.filter(
    (n) => n.subjectSlug === subject.slug || n.subjectId === subject.id
  );

  const relatedSubjects = INITIAL_SUBJECTS.filter((s) => s.id !== subject.id).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <Header />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#087BFF]">Home</Link>
            <span>/</span>
            <Link href="/subjects" className="hover:text-[#087BFF]">Subjects</Link>
            <span>/</span>
            <span className="text-[#07172B] font-semibold">{subject.name}</span>
          </nav>

          {/* Subject Hero Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#087BFF] border border-blue-200">
                    {subject.code}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {subjectNotes.length} Published Notes Available
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-[#07172B] tracking-tight">
                  {subject.name}
                </h1>

                <p className="text-sm text-[#64748B] max-w-3xl leading-relaxed">
                  {subject.description}
                </p>
              </div>

              <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
                <Link
                  href="/notes"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse All Notes</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Subject Notes Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#07172B]">
                Study Notes in {subject.name}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Showing {subjectNotes.length} notes
              </span>
            </div>

            {subjectNotes.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-[#07172B]">
                  No notes published for this subject yet.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Our editorial team is preparing comprehensive study guides for this subject.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjectNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            )}
          </div>

          {/* In-Page Ad Slot */}
          <AdSlot slotId="subject_between_content" />

          {/* Related Subjects */}
          <div className="mt-14 pt-10 border-t border-slate-200">
            <h3 className="text-lg font-bold text-[#07172B] mb-6">
              Explore Related Subjects
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedSubjects.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/subjects/${rel.slug}`}
                  className="p-4 bg-white rounded-xl border border-slate-200 hover:border-[#087BFF] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-bold text-[#087BFF] uppercase block mb-1">
                      {rel.code}
                    </span>
                    <h4 className="text-sm font-bold text-[#07172B] group-hover:text-[#087BFF] transition-colors line-clamp-1">
                      {rel.name}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-3 block">
                    {rel.noteCount} Notes available
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
