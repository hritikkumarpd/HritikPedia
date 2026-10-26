import React from 'react';
import LegalPage from '../../components/LegalPage';

export const metadata = {
  title: 'Refund & Cancellation Policy — Hritikpedia',
  description: 'Clear, fair refund and cancellation policy for digital educational goods on Hritikpedia.',
  alternates: {
    canonical: '/refund-policy',
  },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Refunds · fair use"
      title="Refund & cancellation policy"
      description="Digital notes are delivered instantly, so sales are generally final. These are the verified situations where we refund in full."
      updated="October 2026"
      breadcrumb={[{ label: 'Refund policy' }]}
    >
      <h1 className="sr-only">Refund &amp; Cancellation Policy</h1>

      <h2>1. Digital educational goods</h2>
      <p>
        Due to the immediate digital delivery and non-returnable nature of online study notes,
        chapter guides, and electronic learning materials,{' '}
        <strong>sales are generally final once access is granted</strong>.
      </p>

      <h2>2. Eligibility for refunds</h2>
      <p>
        We believe in treating students fairly. You are entitled to a full refund under the
        following verified conditions:
      </p>
      <ul>
        <li>
          <strong>Double billing / duplicate payment:</strong> If your card or UPI was charged
          multiple times for the same study note due to a network glitch.
        </li>
        <li>
          <strong>Technical defect:</strong> If a document cannot be rendered or viewed in the
          reader due to a corrupted file on our server, and our support team is unable to resolve
          the issue within 48 hours of notification.
        </li>
        <li>
          <strong>Entitlement failure:</strong> If payment was captured by Razorpay but access was
          not unlocked in your dashboard and our administrative reconciliation fails to unlock it
          manually within 24 hours.
        </li>
      </ul>

      <h2>3. How to request a refund</h2>
      <p>
        To submit a refund request, email us at{' '}
        <a href="mailto:support@hritikpedia.com">support@hritikpedia.com</a> within{' '}
        <strong>7 calendar days</strong> of the transaction with:
      </p>
      <ol>
        <li>Your registered student email address.</li>
        <li>
          The Razorpay Payment ID (e.g. <code>pay_...</code>) or Order ID.
        </li>
        <li>
          A concise description of the technical issue or duplicate payment screenshot.
        </li>
      </ol>
      <p>
        Approved refunds are credited back to the original payment source (bank account/UPI) within
        5-7 business days through Razorpay.
      </p>
    </LegalPage>
  );
}
