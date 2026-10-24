import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Refund & Cancellation Policy — Hritikpedia',
  description: 'Clear, fair refund and cancellation policy for digital educational goods on Hritikpedia.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs prose prose-slate max-w-none text-[#26354B] text-sm leading-relaxed space-y-6">
          <h1 className="text-3xl font-black text-[#07172B] tracking-tight">Refund &amp; Cancellation Policy</h1>
          <p className="text-xs text-slate-400">Last updated: October 2026</p>

          <h2 className="text-xl font-bold text-[#07172B]">1. Digital Educational Goods</h2>
          <p>
            Due to the immediate digital delivery and non-returnable nature of online study notes, chapter guides, and electronic learning materials, <strong>sales are generally final once access is granted</strong>.
          </p>

          <h2 className="text-xl font-bold text-[#07172B]">2. Eligibility for Refunds</h2>
          <p>We believe in treating students fairly. You are entitled to a full refund under the following verified conditions:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Double Billing / Duplicate Payment:</strong> If your card or UPI was charged multiple times for the same study note due to a network glitch.</li>
            <li><strong>Technical Defect:</strong> If a document cannot be rendered or viewed in the reader due to a corrupted file on our server, and our support team is unable to resolve the issue within 48 hours of notification.</li>
            <li><strong>Entitlement Failure:</strong> If payment was captured by Razorpay but access was not unlocked in your dashboard and our administrative reconciliation fails to unlock it manually within 24 hours.</li>
          </ul>

          <h2 className="text-xl font-bold text-[#07172B]">3. How to Request a Refund</h2>
          <p>
            To submit a refund request, email us at <a href="mailto:support@hritikpedia.com" className="text-[#087BFF] font-semibold">support@hritikpedia.com</a> within <strong>7 calendar days</strong> of the transaction with:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Your registered student email address.</li>
            <li>The Razorpay Payment ID (e.g. <code>pay_...</code>) or Order ID.</li>
            <li>A concise description of the technical issue or duplicate payment screenshot.</li>
          </ol>
          <p>
            Approved refunds are credited back to the original payment source (bank account/UPI) within 5-7 business days through Razorpay.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
