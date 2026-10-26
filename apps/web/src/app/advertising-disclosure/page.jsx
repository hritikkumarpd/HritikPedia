import React from 'react';
import LegalPage from '../../components/LegalPage';

export const metadata = {
  title: 'Advertising & Sponsor Disclosure — Hritikpedia',
  description: 'Ethical advertising policies, direct sponsor disclosures, and affiliate transparency on Hritikpedia.',
  alternates: {
    canonical: '/advertising-disclosure',
  },
};

export default function AdvertisingDisclosurePage() {
  return (
    <LegalPage
      eyebrow="Advertising · transparency"
      title="Advertising & sponsor disclosure"
      description="How the platform stays funded without putting ads inside your notes, checkout or account."
      updated="October 2026"
      breadcrumb={[{ label: 'Advertising disclosure' }]}
    >
      <h1 className="sr-only">Advertising &amp; Sponsor Disclosure</h1>

      <h2>1. Ethical monetization principles</h2>
      <p>
        Hritikpedia operates on a zero-budget-first model to keep quality educational notes either
        free or available at nominal one-time costs. To support server infrastructure, bandwidth, and
        content curation, we display ethical, non-intrusive advertisements and direct sponsorships.
      </p>

      <h2>2. Strict ad placement restrictions</h2>
      <p>To preserve student focus and reading integrity, we enforce strict ad policies:</p>
      <ul>
        <li>
          <strong>NO ads inside the reader:</strong> Advertisements are strictly prohibited inside
          the active PDF reader canvas. Your study environment is clean and distraction-free.
        </li>
        <li>
          <strong>NO ads in checkout or account:</strong> Checkout screens, login/recovery forms, and
          private dashboard settings will never contain ad banners.
        </li>
        <li>
          <strong>Clear labeling:</strong> All promotional placements are explicitly marked as
          &quot;Advertisement&quot; or &quot;Sponsored Resource&quot;.
        </li>
        <li>
          <strong>No deceptive click bait:</strong> We never disguise advertisements as download
          buttons or navigational elements.
        </li>
      </ul>

      <h2>3. Direct sponsors &amp; affiliates</h2>
      <p>
        When we partner with verified academic publishers, engineering bootcamps, or educational
        software providers, we evaluate their educational value beforehand. Some links may earn
        Hritikpedia a small referral commission at no additional cost to you.
      </p>
    </LegalPage>
  );
}
