import React from 'react';
import LegalPage from '../../components/LegalPage';

export const metadata = {
  title: 'Privacy Policy — Hritikpedia',
  description: 'Privacy policy and student data protection standards for Hritikpedia.',
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy · data protection"
      title="Privacy policy"
      description="What we collect, why we collect it, and the controls you have over your student data. No cross-site tracking, no sale of personal information."
      updated="October 2026"
      breadcrumb={[{ label: 'Privacy policy' }]}
    >
      <h1 className="sr-only">Privacy Policy</h1>

      <h2>1. Overview</h2>
      <p>
        Hritikpedia (&quot;we&quot;, &quot;our&quot;, &quot;platform&quot;) is committed to
        protecting your privacy and personal data. This Privacy Policy details what information we
        collect, how it is processed, and your rights as a registered student or visitor.
      </p>

      <h2>2. Information we collect</h2>
      <ul>
        <li>
          <strong>Account information:</strong> Full name, email address, password hash (encrypted
          using industry-standard salted bcrypt), and account creation timestamps.
        </li>
        <li>
          <strong>Purchases &amp; entitlements:</strong> Order IDs, amounts paid, currency, note IDs
          purchased, and payment gateway references (via Razorpay). We never receive or store
          credit/debit card numbers or CVVs.
        </li>
        <li>
          <strong>Watermark metadata:</strong> When reading protected notes, a masked version of
          your registered email (e.g. <code>hr***@domain.com</code>) and user identifier is rendered
          on reader canvas pages as a security deterrence watermark.
        </li>
        <li>
          <strong>Technical &amp; audit logs:</strong> IP address, user agent, login timestamps, and
          security anomaly records for rate limiting and fraud prevention.
        </li>
      </ul>

      <h2>3. How we use your data</h2>
      <p>
        Your information is used strictly to provide access to study notes, verify order
        entitlements, send requested newsletters or transactional receipt emails, and safeguard our
        educational platform against unauthorized scraping or malicious attacks.
      </p>

      <h2>4. Cookies &amp; sessions</h2>
      <p>
        We use secure, HTTP-only session cookies to authenticate logged-in students and
        administrators. We do not use intrusive third-party cross-site tracking cookies.
      </p>

      <h2>5. Contact us</h2>
      <p>
        If you have questions regarding your data or wish to exercise your data deletion rights,
        please contact our Data Protection Officer at{' '}
        <a href="mailto:support@hritikpedia.com">support@hritikpedia.com</a>.
      </p>
    </LegalPage>
  );
}
