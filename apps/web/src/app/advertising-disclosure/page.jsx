import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Advertising & Sponsor Disclosure — Hritikpedia',
  description: 'Ethical advertising policies, direct sponsor disclosures, and affiliate transparency on Hritikpedia.',
};

export default function AdvertisingDisclosurePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs prose prose-slate max-w-none text-[#26354B] text-sm leading-relaxed space-y-6">
          <h1 className="text-3xl font-black text-[#07172B] tracking-tight">Advertising &amp; Sponsor Disclosure</h1>
          <p className="text-xs text-slate-400">Effective Date: October 2026</p>

          <h2 className="text-xl font-bold text-[#07172B]">1. Ethical Monetization Principles</h2>
          <p>
            Hritikpedia operates on a zero-budget-first model to keep quality educational notes either free or available at nominal one-time costs. To support server infrastructure, bandwidth, and content curation, we display ethical, non-intrusive advertisements and direct sponsorships.
          </p>

          <h2 className="text-xl font-bold text-[#07172B]">2. Strict Ad Placement Restrictions</h2>
          <p>To preserve student focus and reading integrity, we enforce strict ad policies:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>NO Ads Inside Reader:</strong> Advertisements are strictly prohibited inside the active PDF reader canvas. Your study environment is clean and distraction-free.</li>
            <li><strong>NO Ads in Checkout or Account:</strong> Checkout screens, login/recovery forms, and private dashboard settings will never contain ad banners.</li>
            <li><strong>Clear Labeling:</strong> All promotional placements are explicitly marked as &quot;Advertisement&quot; or &quot;Sponsored Resource&quot;.</li>
            <li><strong>No Deceptive Click Bait:</strong> We never disguise advertisements as download buttons or navigational elements.</li>
          </ul>

          <h2 className="text-xl font-bold text-[#07172B]">3. Direct Sponsors &amp; Affiliates</h2>
          <p>
            When we partner with verified academic publishers, engineering bootcamps, or educational software providers, we evaluate their educational value beforehand. Some links may earn Hritikpedia a small referral commission at no additional cost to you.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
