import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchHero from '../components/SearchHero';
import NoteCard from '../components/NoteCard';
import SubjectCard from '../components/SubjectCard';
import AdSlot from '../components/AdSlot';
import NewsletterForm from '../components/NewsletterForm';
import {
  INITIAL_SUBJECTS,
  INITIAL_NOTES,
  INITIAL_ARTICLES,
  PAN_INDIA_DOMAINS,
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
  Landmark,
  School,
  Cpu,
  GraduationCap,
  Check,
  Smartphone,
  Globe,
  Tag,
} from 'lucide-react';

export const metadata = {
  title: 'HritikPedia — Pan-India Study Notes for UPSC, BPSC, BSEB, CBSE & Engineering',
  description:
    'Quality study notes, formula sheets, and chapter blueprints across Govt. Exams (UPSC/BPSC/SSC), School Boards (CBSE/BSEB 10th & 12th), and Engineering Universities (AKTU/BEU). Affordable micro-pricing starting from ₹0 to ₹49.',
};

export default function HomePage() {
  const featuredNotes = INITIAL_NOTES.filter((n) => n.isFeatured);
  const freeNotes = INITIAL_NOTES.filter((n) => n.isFree);
  const featuredSubjects = INITIAL_SUBJECTS.filter((s) => s.isFeatured).slice(0, 6);

  const DOMAIN_SHOWCASE = [
    {
      id: 'general_competitions',
      title: 'Govt. & Competitive Exams',
      target: 'UPSC CSE • BPSC • SSC CGL/CHSL • STET',
      desc: 'Prelims & Mains GS blueprints, Bihar Special in Hindi medium, Topper handwritten notes, and high-yield Indian Polity.',
      icon: Landmark,
      color: 'bg-amber-500/10 text-amber-700 border-amber-200',
      badge: 'National & State Exams',
      link: '/notes?domain=general_competitions',
      count: INITIAL_NOTES.filter((n) => n.domain === 'general_competitions').length,
    },
    {
      id: 'school_boards',
      title: '10th & 12th School Boards',
      target: 'BSEB Bihar Board (हिंदी माध्यम) • CBSE Board • UP Board',
      desc: 'Inter 12th Physics & Chemistry in Hindi, CBSE Organic Chemistry reaction mind-maps, and Class 10th NCERT formula sheets.',
      icon: School,
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
      badge: 'Matric & Inter (10th/12th)',
      link: '/notes?domain=school_boards',
      count: INITIAL_NOTES.filter((n) => n.domain === 'school_boards').length,
    },
    {
      id: 'engineering',
      title: 'Engineering Universities',
      target: 'AKTU • BEU Bihar • MAKAUT • VTU • Autonomous',
      desc: 'B.Tech semester-wise syllabus mapped notes for Computer Science, Electrical, and Mechanical. PYQ blueprints and diagrams.',
      icon: Cpu,
      color: 'bg-blue-500/10 text-[#087BFF] border-blue-200',
      badge: 'University & Department Mapped',
      link: '/notes?domain=engineering',
      count: INITIAL_NOTES.filter((n) => n.domain === 'engineering').length,
    },
    {
      id: 'general_degree',
      title: 'General Degree Courses',
      target: 'BCA • B.Sc • B.Com • BBA Semesters',
      desc: 'Core programming theory, Python data structures, business economics, and database concepts for UG university exams.',
      icon: GraduationCap,
      color: 'bg-purple-500/10 text-purple-700 border-purple-200',
      badge: 'Undergraduate Semesters',
      link: '/notes?domain=general_degree',
      count: INITIAL_NOTES.filter((n) => n.domain === 'general_degree').length,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      {/* Top Navigation */}
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200/60 bg-gradient-to-b from-white via-[#F5F8FC] to-[#F5F8FC]">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[480px] bg-radial from-[#087BFF]/12 via-[#FFB923]/6 to-transparent blur-3xl pointer-events-none -z-10"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Visual Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#087BFF] text-xs font-black mb-6 shadow-xs">
              <span className="text-base">🇮🇳</span>
              <span>Pan-India Study Notes Platform • Quality Education For Every Aspirant</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#07172B] tracking-tight max-w-4xl mx-auto leading-[1.12]">
              One Platform for <span className="text-[#087BFF]">Every Student</span> in India.
            </h1>

            <p className="mt-5 text-lg sm:text-xl font-bold text-[#0B1D36] max-w-3xl mx-auto tracking-tight">
              Govt. Exams (UPSC, BPSC, SSC) • 10th &amp; 12th Boards (CBSE, BSEB) • Engineering Universities (AKTU, BEU)
            </p>

            <p className="mt-3 text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto leading-relaxed">
              Access comprehensive chapter notes, toppers&apos; blueprints, and formula mind-maps. Affordable micro-pricing starting from <strong>₹0 (Free)</strong> to <strong>₹29–₹49</strong> so every student across India can study without financial barriers.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/notes"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-[#087BFF] hover:bg-[#1688FF] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore All Notes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/free-resources"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-[#07172B] bg-white hover:bg-slate-50 border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FFB923]" />
                <span>Browse Free Notes (₹0)</span>
              </Link>
            </div>

            {/* Live Search Bar */}
            <div className="mt-10">
              <SearchHero />
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
                <span className="font-bold text-[#07172B]">Popular Searches:</span>
                <Link href="/notes?target=UPSC" className="hover:text-[#087BFF] bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  #UPSC_Polity
                </Link>
                <Link href="/notes?target=BPSC" className="hover:text-[#087BFF] bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  #BPSC_BiharSpecial
                </Link>
                <Link href="/notes?target=BSEB" className="hover:text-[#087BFF] bg-white px-2.5 py-1 rounded-md border border-slate-200 text-amber-700 font-medium">
                  #BSEB_12th_हिंदी
                </Link>
                <Link href="/notes?target=CBSE" className="hover:text-[#087BFF] bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  #CBSE_12th_Chemistry
                </Link>
                <Link href="/notes?target=AKTU" className="hover:text-[#087BFF] bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  #AKTU_BTech_DBMS
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4 MAJOR PILLARS: PAN-INDIA CATEGORIES */}
        <section className="py-12 md:py-16 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-bold text-[#087BFF] uppercase tracking-wider block mb-1">
                Choose Your Domain
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07172B] tracking-tight">
                Curated For Every Academic &amp; Exam Goal
              </h2>
              <p className="mt-2 text-sm text-[#64748B]">
                Whether you are targeting Civil Services, preparing for Board Exams, or clearing Engineering Semesters, find syllabus-verified study notes instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {DOMAIN_SHOWCASE.map((domain) => {
                const Icon = domain.icon;
                return (
                  <Link
                    key={domain.id}
                    href={domain.link}
                    className="p-6 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-[#087BFF]/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${domain.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200/70 text-[#07172B]">
                          {domain.count} Notes
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#07172B] group-hover:text-[#087BFF] transition-colors mb-1">
                        {domain.title}
                      </h3>

                      <p className="text-[11px] font-bold text-[#087BFF] mb-2">
                        {domain.target}
                      </p>

                      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                        {domain.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#087BFF] group-hover:text-[#1688FF]">
                      <span>Browse Notes</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* TOP AD SLOT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AdSlot slotId="home_top" />
        </div>

        {/* POPULAR SUBJECTS SECTION */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <span className="text-xs font-bold text-[#087BFF] uppercase tracking-wider block mb-1">
                  University &amp; Board Syllabi
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07172B] tracking-tight">
                  Featured Subjects
                </h2>
                <p className="mt-2 text-sm text-[#64748B] max-w-xl">
                  Subject units mapped to university curricula (AKTU, BEU), school boards (CBSE, BSEB), and competitive syllabus.
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
                  High-Yield Revision
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07172B] tracking-tight">
                  Featured Study Notes &amp; Blueprints
                </h2>
                <p className="mt-2 text-sm text-[#64748B] max-w-xl">
                  Notes with concept diagrams, formula summaries, Hindi and English explanations, and watermarked canvas previews.
                </p>
              </div>
              <Link
                href="/notes"
                className="mt-4 md:mt-0 text-sm font-bold text-[#087BFF] hover:text-[#1688FF] flex items-center gap-1 group"
              >
                <span>View Full Notes Catalog ({INITIAL_NOTES.length})</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AdSlot slotId="home_between_sections" />
        </div>

        {/* FREE RESOURCES SECTION */}
        <section className="py-12 md:py-16">
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
                  Start your preparation immediately without spending anything. Read formula sheets, quick chapter summaries, and syllabus breakdowns in our online reader.
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
                          FREE (₹0)
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

        {/* WHY HRITIKPEDIA? — PAN-INDIA ADVANTAGE */}
        <section className="py-16 md:py-20 bg-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-[#087BFF] uppercase tracking-wider block mb-1">
                The HritikPedia Advantage
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#07172B] tracking-tight">
                Designed for Every Student Across India
              </h2>
              <p className="mt-3 text-sm text-[#64748B]">
                Engineered for affordable learning, bilingual support, verified high-yield notes, and zero clutter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 rounded-2xl bg-[#F5F8FC] border border-slate-200/80">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#087BFF] flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#07172B] mb-2">
                  All Domains in One Place
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  UPSC, BPSC, SSC, BSEB 10th/12th, CBSE, AKTU, and BEU Engineering notes—all organized systematically by department and exam.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F5F8FC] border border-slate-200/80">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#FFB923] flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#07172B] mb-2">
                  हिंदी &amp; English Medium
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Complete handwritten and typed notes in Hindi medium for BSEB &amp; BPSC, alongside English and Hinglish notes for CBSE and B.Tech.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F5F8FC] border border-slate-200/80">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#07172B] mb-2">
                  Affordable Micro-Pricing
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Single notes priced at ₹19 to ₹49 with instant UPI payment (PhonePe, GPay, Paytm). No costly ₹10,000 subscriptions.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F5F8FC] border border-slate-200/80">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#07172B] mb-2">
                  Distraction-Free Notes
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  100% focused study notes. Strictly verified chapter guides, concept blueprints, formula sheets, and watermarked canvas reading.
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
                  Latest Articles &amp; Exam Roadmaps
                </h2>
                <p className="mt-2 text-sm text-[#64748B] max-w-xl">
                  Deep-dive explanations on exam blueprints, preparation roadmaps, and high-yield topics.
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
              Get Pan-India Academic Notes Delivered to Your Inbox
            </h2>

            <p className="mt-3 text-sm text-[#64748B] max-w-xl mx-auto mb-8">
              Stay ahead with newly published chapter notes for UPSC, BPSC, BSEB 12th, CBSE, and Engineering universities. No spam, ever.
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
