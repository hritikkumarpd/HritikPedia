import React from 'react';
import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import PageHero from './PageHero';
import { FileText, ShieldCheck, Mail, ArrowRight, CalendarDays } from 'lucide-react';

const POLICY_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Refund & Cancellation Policy', href: '/refund-policy' },
  { label: 'Advertising Disclosure', href: '/advertising-disclosure' },
];

export default function LegalPage({
  eyebrow = 'Official Policy',
  title,
  description,
  updated,
  breadcrumb,
  children,
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow={eyebrow}
          title={title}
          description={description}
          breadcrumbs={breadcrumb || [{ label: 'Legal' }]}
          aside={
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <FileText className="h-4 w-4" />
                </span>
                <p className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  Plain-Language Transparency
                </p>
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We believe students deserve clear, concise policies without confusing legalese.
              </p>
              <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {updated && (
                  <p className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    Last Updated: {updated}
                  </p>
                )}
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Applies to all services on hritikpedia.com
                </p>
              </div>
            </div>
          }
        />

        <section className="py-8 sm:py-12">
          <div className="container-narrow">
            <article className="card overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 px-5 py-3 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  Hritikpedia Document Record
                </span>
                <span className="text-[11px] text-slate-400">
                  {updated || 'Active Version'}
                </span>
              </div>

              <div className="prose-legal p-6 sm:p-10">{children}</div>
            </article>

            {/* Questions Banner & Other Policies */}
            <div className="mt-6 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
              <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Questions regarding this policy?
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Reach out to our student desk at{' '}
                      <a
                        href="mailto:support@hritikpedia.com"
                        className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        support@hritikpedia.com
                      </a>
                      . We typically reply within one business day.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Other Legal Policies
                </h4>
                <ul className="space-y-1.5 text-xs font-semibold">
                  {POLICY_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
