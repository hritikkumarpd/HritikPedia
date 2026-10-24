import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Privacy Policy — Hritikpedia',
  description: 'Privacy policy and student data protection standards for Hritikpedia.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs prose prose-slate max-w-none text-[#26354B] text-sm leading-relaxed space-y-6">
          <h1 className="text-3xl font-black text-[#07172B] tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Last updated: October 2026</p>

          <h2 className="text-xl font-bold text-[#07172B]">1. Overview</h2>
          <p>
            Hritikpedia (&quot;we&quot;, &quot;our&quot;, &quot;platform&quot;) is committed to protecting your privacy and personal data. This Privacy Policy details what information we collect, how it is processed, and your rights as a registered student or visitor.
          </p>

          <h2 className="text-xl font-bold text-[#07172B]">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account Information:</strong> Full name, email address, password hash (encrypted using industry-standard salted bcrypt), and account creation timestamps.</li>
            <li><strong>Purchases &amp; Entitlements:</strong> Order IDs, amounts paid, currency, note IDs purchased, and payment gateway references (via Razorpay). We never receive or store credit/debit card numbers or CVVs.</li>
            <li><strong>Watermark Metadata:</strong> When reading protected notes, a masked version of your registered email (e.g. <code>hr***@domain.com</code>) and user identifier is rendered on reader canvas pages as a security deterrence watermark.</li>
            <li><strong>Technical &amp; Audit Logs:</strong> IP address, user agent, login timestamps, and security anomaly records for rate limiting and fraud prevention.</li>
          </ul>

          <h2 className="text-xl font-bold text-[#07172B]">3. How We Use Your Data</h2>
          <p>
            Your information is used strictly to provide access to study notes, verify order entitlements, send requested newsletters or transactional receipt emails, and safeguard our educational platform against unauthorized scraping or malicious attacks.
          </p>

          <h2 className="text-xl font-bold text-[#07172B]">4. Cookies &amp; Sessions</h2>
          <p>
            We use secure, HTTP-only session cookies to authenticate logged-in students and administrators. We do not use intrusive third-party cross-site tracking cookies.
          </p>

          <h2 className="text-xl font-bold text-[#07172B]">5. Contact Us</h2>
          <p>
            If you have questions regarding your data or wish to exercise your data deletion rights, please contact our Data Protection Officer at <a href="mailto:support@hritikpedia.com" className="text-[#087BFF] font-semibold">support@hritikpedia.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
