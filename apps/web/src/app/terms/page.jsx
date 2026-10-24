import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Terms of Service — Hritikpedia',
  description: 'Terms of Service, educational licenses, and acceptable use policies for Hritikpedia.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs prose prose-slate max-w-none text-[#26354B] text-sm leading-relaxed space-y-6">
          <h1 className="text-3xl font-black text-[#07172B] tracking-tight">Terms of Service</h1>
          <p className="text-xs text-slate-400">Effective Date: October 2026</p>

          <h2 className="text-xl font-bold text-[#07172B]">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Hritikpedia (&quot;hritikpedia.vercel.app&quot; or &quot;hritikpedia.com&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not access or use the platform.
          </p>

          <h2 className="text-xl font-bold text-[#07172B]">2. Single-User Personal Educational License</h2>
          <p>
            When you purchase access to any paid study note or access a free resource on Hritikpedia, you are granted a non-exclusive, non-transferable, revocable single-user license to read the material strictly for your personal academic study.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You may <strong>NOT</strong> resell, redistribute, sub-license, upload to public cloud drives, or broadcast any material obtained from Hritikpedia.</li>
            <li>You may <strong>NOT</strong> attempt to bypass, circumvent, or disable the in-browser PDF reader, dynamic watermarks, or access-control APIs.</li>
            <li>Sharing account credentials with third parties or concurrent multi-device scraping is strictly prohibited and subject to immediate account revocation.</li>
          </ul>

          <h2 className="text-xl font-bold text-[#07172B]">3. Intellectual Property Rights</h2>
          <p>
            All original study notes, structural outlines, diagrams, editorial articles, brand logos, and software architecture are the exclusive intellectual property of Hritikpedia and its respective contributing authors.
          </p>

          <h2 className="text-xl font-bold text-[#07172B]">4. Platform Disclaimer</h2>
          <p>
            Hritikpedia is an independent educational provider. We explicitly disclaim any official affiliation with government exam bodies (e.g. BSEB/Bihar STET, NTA, GATE Forum) unless explicitly declared. Our study notes represent supplementary study aids designed to aid student comprehension.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
