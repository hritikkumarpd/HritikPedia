import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BrandLogo from '../../components/BrandLogo';
import { BookOpen, Sparkles, ShieldCheck, Award, Heart, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Hritikpedia — Stop Searching. Start Learning.',
  description:
    'Learn about Hritikpedia, an educational platform providing high-yield Computer Science study notes, exam blueprints, and watermarked reading with a zero-budget-first mission.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Hero Banner */}
          <div className="text-center space-y-4">
            <BrandLogo size="lg" className="mx-auto" />
            <h1 className="text-3xl sm:text-5xl font-black text-[#07172B] tracking-tight mt-6">
              Stop Searching. <span className="text-[#087BFF]">Start Learning.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
              Hritikpedia was created with a clear, uncompromising mission: eliminate the confusion of fragmented internet searches and give engineering students structured, trustworthy study notes in one place.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-2xl font-black text-[#07172B]">Our Philosophy</h2>
            <p className="text-sm sm:text-base text-[#26354B] leading-relaxed">
              Standard engineering curriculum textbooks often span thousands of pages. While rich in academic research, students preparing for semester examinations, GATE, or teacher recruitment tests (such as Bihar STET Computer Science) frequently spend more time searching through random slide decks than actually understanding core computer science concepts.
            </p>
            <p className="text-sm sm:text-base text-[#26354B] leading-relaxed">
              At Hritikpedia, every note is crafted to deliver <strong>high conceptual density</strong>:
              relational database normalization steps, operating systems semaphores and deadlock avoidance algorithms, network IP subnetting conversions, and digital logic Karnaugh maps are presented with clean diagrams, illustrated state transitions, and step-by-step solved numerical problems.
            </p>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <Award className="w-8 h-8 text-[#087BFF] mb-3" />
              <h3 className="text-base font-bold text-[#07172B] mb-2">100% Genuine Data</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                We never fabricate student testimonials, fake pass rates, or simulated reviews. Every resource represents real, verified educational curriculum notes.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="text-base font-bold text-[#07172B] mb-2">Protected Learning</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Our in-browser canvas viewer prevents intellectual property leakage while providing user-specific dynamic watermarking and zero distraction.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <Sparkles className="w-8 h-8 text-[#FFB923] mb-3" />
              <h3 className="text-base font-bold text-[#07172B] mb-2">Zero-Budget-First</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Engineered with modern, hyper-efficient open-source web technologies so high-quality educational notes remain accessible starting from ₹0.
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="bg-gradient-to-r from-[#07172B] to-[#0B1D36] text-white rounded-3xl p-8 sm:p-10 text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Start Learning?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Browse our complete library of Computer Science notes or start immediately with our 100% free revision materials.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href="/notes"
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-xl transition-colors shadow-xs"
              >
                Browse Study Notes
              </Link>
              <Link
                href="/free-resources"
                className="px-6 py-2.5 text-xs font-bold text-[#07172B] bg-white hover:bg-slate-100 rounded-xl transition-colors"
              >
                Free Resources
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
