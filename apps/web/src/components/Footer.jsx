'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { Mail, ArrowRight, CheckCircle2, Clock3, ShieldCheck, Heart } from 'lucide-react';
import { BRAND } from '@hritikpedia/shared/brand';

const LINK_GROUPS = [
  {
    title: 'Study Library',
    links: [
      { label: 'All study notes', href: '/notes' },
      { label: 'Browse subjects', href: '/subjects' },
      { label: 'Mock practice tests', href: '/tests' },
      { label: 'Free revision sheets', href: '/free-resources' },
      { label: 'Preparation guides', href: '/articles' },
    ],
  },
  {
    title: 'Exam Syllabi',
    links: [
      { label: 'Bihar STET Paper-II', href: '/notes?exam=bihar-stet' },
      { label: 'BPSC Computer Teacher', href: '/notes?exam=bpsc' },
      { label: 'GATE CSE & Engineering', href: '/notes?domain=engineering' },
      { label: 'UGC NET Computer Science', href: '/notes' },
      { label: 'CBSE & BSEB 11-12 CS', href: '/notes?domain=school_boards' },
    ],
  },
  {
    title: 'Student Desk',
    links: [
      { label: 'About Hritikpedia', href: '/about' },
      { label: 'Support & queries', href: '/contact' },
      { label: 'My reading library', href: '/dashboard' },
      { label: 'Newsletter preferences', href: '/unsubscribe' },
      { label: 'Advertising disclosure', href: '/advertising-disclosure' },
    ],
  },
  {
    title: 'Trust & Legal',
    links: [
      { label: 'Privacy policy', href: '/privacy-policy' },
      { label: 'Terms of service', href: '/terms' },
      { label: 'Refund & cancellation', href: '/refund-policy' },
      { label: 'Payment security', href: '/refund-policy' },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const handleSubscribe = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;

    setSubscribing(true);
    setSubscribeError('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), consent: true, source: 'footer' }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      } else {
        setSubscribeError(data.error || 'Could not subscribe right now. Please try again.');
      }
    } catch {
      setSubscribeError('Network error. Check your connection and try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] transition-colors">
      {/* Newsletter Section */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <span className="eyebrow">The CSE Study Letter</span>
              <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Get new notes, syllabus alerts &amp; revision handbooks.
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Direct updates when verified notes or mock test solutions drop. No spam, ever.
              </p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    You are subscribed!
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    The next study dispatch will arrive directly in your inbox.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="student@college.edu"
                    required
                    className="input-field flex-1"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="btn btn-primary h-[2.625rem] px-5 text-xs shrink-0"
                  >
                    {subscribing ? 'Subscribing…' : 'Subscribe'}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>
                {subscribeError && (
                  <p className="mt-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                    {subscribeError}
                  </p>
                )}
                <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  By joining, you agree to our{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
                  >
                    privacy policy
                  </Link>
                  . Unsubscribe with 1-click anytime.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-3">
            <BrandLogo size="md" />
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Curated, syllabus-mapped Computer Science study notes, diagrams, verified PYQs, and
              timed mock tests for engineering and competitive examinations.
            </p>
            <div className="pt-2 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <a
                href="mailto:support@hritikpedia.com"
                className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                support@hritikpedia.com
              </a>
              <p className="flex items-center gap-2">
                <Clock3 className="h-3.5 w-3.5" />
                Mon–Sat, 10 AM – 7 PM IST
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Official Channels
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={BRAND.socials?.youtube || 'https://youtube.com/@hritikpedia'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hritikpedia YouTube Channel"
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href={BRAND.socials?.telegram || 'https://t.me/hritikpedia'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hritikpedia Telegram Community"
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.918z"/>
                  </svg>
                </a>
                <a
                  href={BRAND.socials?.linkedin || 'https://linkedin.com/company/hritikpedia'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hritikpedia LinkedIn Profile"
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a
                  href={BRAND.socials?.twitter || 'https://x.com/hritikpedia'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Hritikpedia X (Twitter) Channel"
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {LINK_GROUPS.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {group.title}
              </h3>
              <ul className="space-y-2 text-xs">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Security & Payment Trust Banner */}
        <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>256-Bit SSL Encrypted · Instant PDF Watermarking · Razorpay Payment Gateway</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span>UPI</span>
            <span>•</span>
            <span>Credit / Debit Cards</span>
            <span>•</span>
            <span>Net Banking</span>
            <span>•</span>
            <span>RuPay</span>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <p>© {currentYear} Hritikpedia Education Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with precision for Computer Science students.
          </p>
        </div>
      </div>
    </footer>
  );
}
