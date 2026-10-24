import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BrandLogo from '../components/BrandLogo';
import SearchHero from '../components/SearchHero';
import NoteCard from '../components/NoteCard';
import SubjectCard from '../components/SubjectCard';
import AdSlot from '../components/AdSlot';
import NewsletterForm from '../components/NewsletterForm';
import {
  INITIAL_SUBJECTS,
  INITIAL_NOTES,
  INITIAL_ARTICLES,
} from '@hritikpedia/shared/data';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FileText,
  Clock,
  Layers,
  Award,
  Lock,
} from 'lucide-react';

export default function HomePage() {
  const featuredNotes = INITIAL_NOTES.filter((n) => n.isFeatured);
  const freeNotes = INITIAL_NOTES.filter((n) => n.isFree);
  const premiumNotes = INITIAL_NOTES.filter((n) => !n.isFree);
  const featuredSubjects = INITIAL_SUBJECTS.filter((s) => s.isFeatured).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      {/* Top Navigation */}
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/60 bg-gradient-to-b from-white via-[#F5F8FC] to-[#F5F8FC]">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-radial from-[#087BFF]/10 via-[#FFB923]/5 to-transparent blur-3xl pointer-events-none -z-10"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Brand Logo Visual Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#087BFF] text-xs font-bold mb-8 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#FFB923]" />
              <span>Dedicated Educational Notes Platform</span>
            </div>

            {/* Official Headline & Subheadings */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#07172B] tracking-tight max-w-4xl mx-auto leading-[1.12]">
              Stop Searching. <span className="text-[#087BFF]">Start Learning.</span>
            </h1>

            <p className="mt-5 text-xl sm:text-2xl font-bold text-[#0B1D36] max-w-2xl mx-auto tracking-tight">
              Quality Study Notes. Smarter Preparation. Better Learning.
            </p>

            <p className="mt-4 text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto leading-relaxed">
              Discover organized study notes, exam-focused resources, previous-year questions, and carefully structured learning materials—all in one place.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/notes"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-[#087BFF] hover:bg-[#1688FF] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Notes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/free-resources"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-[#07172B] bg-white hover:bg-slate-50 border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FFB923]" />
                <span>Browse Free Resources</span>
              </Link>
            </div>

            {/* Interactive Live Search Bar */}
            <div className="mt-12">
              <SearchHero />
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
                <span className="font-semibold text-[#07172B]">Popular:</span>
                <Link href="/notes/dbms-normalization-notes" className="hover:text-[#087BFF] bg-white px-2.5 py-1 rounded-md border border-slate-200">DBMS Normalization</Link>
                <Link href="/notes/operating-systems-process-synchronization" className="hover:text-[#087BFF] bg-white px-2.5 py-1 rounded-md border border-slate-200">OS Concurrency</Link>
                <Link href="/notes/digital-logic-k-maps-revision" className="hover:text-[#087BFF] bg-white px-2.5 py-1 rounded-md border border-slate-200">K-Maps</Link>
                <Link href="/notes/bihar-stet-cs-syllabus-blueprint" className="hover:text-[#087BFF] bg-white px-2.5 py-1 rounded-md border border-slate-200">Bihar STET CS</Link>
              </div>
            </div>
          </div>
        </section>

        {/* TOP AD SLOT / SPONSOR PLACEMENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSlot slotId="home_top" />
        </div>

        {/* POPULAR SUBJECTS SECTION */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <span className="text-xs font-bold text-[#087BFF] uppercase tracking-wider block mb-1">
                  Curated Catalog
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07172B] tracking-tight">
                  Popular Subjects
                </h2>
                <p className="mt-2 text-sm text-[#64748B] max-w-xl">
                  Comprehensive notes organized by engineering semester curricula and competitive exam syllabi.
                </p>
              </div>
              <Link
                href="/subjects"
                className="mt-4 md:mt-0 text-sm font-bold text-[#087BFF] hover:text-[#1688FF] flex items-center gap-1 group"
              >
                <span>Browse All Subjects ({INITIAL_SUBJECTS.length})</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED STUDY NOTES SECTION */}
        <section className="py-16 md:py-20 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <span className="text-xs font-bold text-[#087BFF] uppercase tracking-wider block mb-1">
                  Top Recommended
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07172B] tracking-tight">
                  Featured Study Notes
                </h2>
                <p className="mt-2 text-sm text-[#64748B] max-w-xl">
                  Reviewed chapter notes with illustrated diagrams, worked examples, and online watermarked previews.
                </p>
              </div>
              <Link
                href="/notes"
                className="mt-4 md:mt-0 text-sm font-bold text-[#087BFF] hover:text-[#1688FF] flex items-center gap-1 group"
              >
                <span>View Full Notes Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        </section>

        {/* MID-PAGE AD SLOT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSlot slotId="home_between_sections" />
        </div>

        {/* FREE RESOURCES SECTION */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#07172B] via-[#0B1D36] to-[#0A2548] rounded-3xl p-8 sm:p-12 text-white shadow-lg overflow-hidden relative">
              <div className="relative z-10 max-w-2xl mb-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-4 border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>100% Free Educational Materials</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Free Revision Materials &amp; Blueprints
                </h2>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  Start your preparation immediately without payment. Read formulas, fast reference summaries, and syllabus breakdowns in our online reader.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {freeNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#FFB923]">
                          {note.subjectName}
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500 text-white">
                          FREE ACCESS
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {note.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {note.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">
                        {note.pageCount} Pages • Full Reading Allowed
                      </span>
                      <Link
                        href={`/reader/${note.slug}`}
                        className="px-4 py-2 text-xs font-bold text-[#07172B] bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <span>Read Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHY HRITIKPEDIA? */}
        <section className="py-16 md:py-20 bg-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-[#087BFF] uppercase tracking-wider block mb-1">
                The Platform Advantage
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07172B] tracking-tight">
                Why Study with Hritikpedia?
              </h2>
              <p className="mt-3 text-sm text-[#64748B]">
                Engineered from the ground up for focused learning, clear visual summaries, and distraction-free study.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 rounded-2xl bg-[#F5F8FC] border border-slate-200/80">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#087BFF] flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#07172B] mb-2">
                  Organized Learning
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  No scattered PDFs or disorganized drive links. Every note is indexed by subject, chapter, and exam weightage.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F5F8FC] border border-slate-200/80">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#FFB923] flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#07172B] mb-2">
                  High-Yield Summaries
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Focus on high-probability questions, algorithm steps, and core definitions rather than 1,000-page academic textbooks.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F5F8FC] border border-slate-200/80">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#07172B] mb-2">
                  Secure Online Reader
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Read smoothly on desktop or mobile with our built-in canvas viewer featuring personalized security watermarks.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F5F8FC] border border-slate-200/80">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#07172B] mb-2">
                  Fair Transparent Pricing
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Direct one-time pricing starting from ₹0 for foundational material, with zero recurring subscription locks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LATEST EDUCATIONAL ARTICLES */}
        <section className="py-16 md:py-20 bg-[#F5F8FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <span className="text-xs font-bold text-[#087BFF] uppercase tracking-wider block mb-1">
                  Editorial Insights
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07172B] tracking-tight">
                  Latest Articles &amp; Exam Guides
                </h2>
                <p className="mt-2 text-sm text-[#64748B] max-w-xl">
                  Deep-dive explanations on database normalization, synchronization primitives, and exam roadmaps.
                </p>
              </div>
              <Link
                href="/articles"
                className="mt-4 md:mt-0 text-sm font-bold text-[#087BFF] hover:text-[#1688FF] flex items-center gap-1 group"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {INITIAL_ARTICLES.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#087BFF] font-bold">
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readingTime}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#07172B] hover:text-[#087BFF] transition-colors leading-snug mb-3">
                      <Link href={`/articles/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">By {article.author}</span>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="font-bold text-[#087BFF] hover:text-[#1688FF] flex items-center gap-1"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* NEWSLETTER SECTION */}
        <section className="py-16 md:py-20 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="w-12 h-12 rounded-2xl bg-blue-50 text-[#087BFF] inline-flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-[#FFB923]" />
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07172B] tracking-tight">
              Get Academic Notes Delivered to Your Inbox
            </h2>

            <p className="mt-3 text-sm text-[#64748B] max-w-xl mx-auto mb-8">
              Stay ahead with newly published chapter notes, formula cheat-sheets, and Bihar STET syllabus breakdowns. No spam, ever.
            </p>

            <NewsletterForm />
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
