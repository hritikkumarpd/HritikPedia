import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PageHero from '../../components/PageHero';
import SectionHeading from '../../components/SectionHeading';
import {
  Mail,
  Clock,
  ShieldCheck,
  CreditCard,
  BookOpen,
  RefreshCw,
  ArrowRight,
  MessageSquare,
  KeyRound,
} from 'lucide-react';

export const metadata = {
  title: 'Contact & Student Support — HritikPedia',
  description:
    'Get help with your HritikPedia account, payments, note access, refunds or content corrections. Email our student support team.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact & Student Support — HritikPedia',
    description:
      'Get help with your HritikPedia account, payments, note access, refunds or content corrections. Email our student support team.',
    url: '/contact',
    type: 'website',
  },
};

const SUPPORT_TOPICS = [
  {
    icon: CreditCard,
    title: 'Payments & Order References',
    description: 'Transaction questions, duplicate payment resolution, or invoice receipts.',
    subject: 'Payment Inquiry',
  },
  {
    icon: BookOpen,
    title: 'Study Note Access',
    description: 'Purchased document unlocking, secured reader access, or viewing issues.',
    subject: 'Study Note Access',
  },
  {
    icon: RefreshCw,
    title: 'Refunds & Guarantees',
    description: 'Questions regarding our 7-day technical defect refund policy.',
    subject: 'Refund Request',
  },
  {
    icon: ShieldCheck,
    title: 'Academic Content Corrections',
    description: 'Report a mathematical typo, outdated syllabus code, or errata in a note.',
    subject: 'Content Correction',
  },
];

export default function ContactPage() {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://hritikpedia.vercel.app').replace(/\/$/, '');
  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `${baseUrl}/contact`,
    name: 'Contact & Student Support — Hritikpedia',
    description: 'Official student support desk for Hritikpedia study notes, payments, and account queries.',
    mainEntity: {
      '@type': 'ContactPoint',
      contactType: 'student support',
      email: 'support@hritikpedia.com',
      availableLanguage: ['en', 'hi'],
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:00',
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <Header />

      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow="Student Helpdesk"
          title={
            <>
              Dedicated Academic Support. <span className="text-primary">Human Replies.</span>
            </>
          }
          description="Have questions regarding an order, syllabus coverage, account access, or technical feedback? Reach out directly to our student support desk."
          breadcrumbs={[{ label: 'Support & Contact' }]}
          aside={
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </span>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Official Support Desk
              </p>
              <a
                href="mailto:support@hritikpedia.com"
                className="mt-1 block break-all text-lg font-bold text-primary hover:underline"
              >
                support@hritikpedia.com
              </a>
              <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs font-medium text-slate-500">
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>Mon–Sat • 10:00–19:00 IST</span>
                </p>
                <p className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Prompt reply within 24 business hours</span>
                </p>
              </div>
            </div>
          }
        />

        <section className="py-12 sm:py-16">
          <div className="container-page">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
              <a
                href="mailto:support@hritikpedia.com"
                className="card card-hover flex items-center gap-5 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
                  <Mail className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Fastest Response Channel
                  </p>
                  <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Direct Email Support
                  </h2>
                  <p className="mt-0.5 break-all text-xs sm:text-sm font-semibold text-primary">
                    support@hritikpedia.com
                  </p>
                </div>
                <ArrowRight className="hidden sm:block h-5 w-5 text-slate-400" />
              </a>

              <div className="card p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Support Schedule</h2>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-semibold">Monday – Saturday</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">10:00 AM – 7:00 PM IST</p>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Closed on national holidays.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <SectionHeading
                eyebrow="Triage Channels"
                title="Common Topics &amp; Inquiries"
                description="Selecting a specific department pre-fills your email subject for faster turnaround."
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-8">
                {SUPPORT_TOPICS.map((topic) => {
                  const Icon = topic.icon;
                  const mailto = `mailto:support@hritikpedia.com?subject=${encodeURIComponent(
                    `[${topic.subject}] `
                  )}`;
                  return (
                    <a
                      key={topic.title}
                      href={mailto}
                      className="group card card-hover flex flex-col justify-between gap-4 p-6 border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{topic.title}</h3>
                          <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            {topic.description}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs font-bold text-primary">
                        Send message regarding this
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="card p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <KeyRound className="h-5 w-5 text-primary" />
                  Helpful Details to Include
                </h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>Include the registered account email address and, for billing inquiries, your Razorpay payment ID.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>Purchased notes are available instantly in your <Link href="/dashboard" className="font-bold text-primary hover:underline">Student Dashboard</Link>. Confirm you are logged into the account used at checkout.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>Review our comprehensive <Link href="/refund-policy" className="font-bold text-primary hover:underline">Refund Policy</Link> for full details on qualifying technical issues.</span>
                  </li>
                </ul>
              </div>

              <div className="card p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    Account Security Notice
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    HritikPedia staff will never ask for your account password, OTP, or full credit card details. Never share confidential credentials over email.
                  </p>
                </div>
                <Link
                  href="/privacy-policy"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  View Privacy Statement
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
