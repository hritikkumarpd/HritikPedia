import React from 'react';
import LegalPage from '../../components/LegalPage';

export const metadata = {
  title: 'Terms of Service — Hritikpedia',
  description: 'Terms of Service, educational licenses, and acceptable use policies for Hritikpedia.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms · acceptable use"
      title="Terms of service"
      description="The license you receive when you buy or read a study pack, and the rules that keep the library fair for every student."
      updated="October 2026"
      breadcrumb={[{ label: 'Terms of service' }]}
    >
      <h1 className="sr-only">Terms of Service</h1>

      <h2>1. Acceptance of terms</h2>
      <p>
        By accessing or using Hritikpedia (&quot;hritikpedia.vercel.app&quot; or
        &quot;hritikpedia.com&quot;), you agree to be bound by these Terms of Service. If you do not
        agree to these terms, do not access or use the platform.
      </p>

      <h2>2. Single-user personal educational license</h2>
      <p>
        When you purchase access to any paid study note or access a free resource on Hritikpedia,
        you are granted a non-exclusive, non-transferable, revocable single-user license to read the
        material strictly for your personal academic study.
      </p>
      <ul>
        <li>
          You may <strong>NOT</strong> resell, redistribute, sub-license, upload to public cloud
          drives, or broadcast any material obtained from Hritikpedia.
        </li>
        <li>
          You may <strong>NOT</strong> attempt to bypass, circumvent, or disable the in-browser PDF
          reader, dynamic watermarks, or access-control APIs.
        </li>
        <li>
          Sharing account credentials with third parties or concurrent multi-device scraping is
          strictly prohibited and subject to immediate account revocation.
        </li>
      </ul>

      <h2>3. Intellectual property rights</h2>
      <p>
        All original study notes, structural outlines, diagrams, editorial articles, brand logos, and
        software architecture are the exclusive intellectual property of Hritikpedia and its
        respective contributing authors.
      </p>

      <h2>4. Platform disclaimer</h2>
      <p>
        Hritikpedia is an independent educational provider. We explicitly disclaim any official
        affiliation with government exam bodies (e.g. BSEB/Bihar STET, NTA, GATE Forum) unless
        explicitly declared. Our study notes represent supplementary study aids designed to aid
        student comprehension.
      </p>
    </LegalPage>
  );
}
