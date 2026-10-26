import React from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';
import ThemeToggle from './ThemeToggle';
import { ShieldCheck, ArrowLeft, BookOpen, FileCheck2, Sparkles, CheckCircle2 } from 'lucide-react';

const FEATURE_POINTS = [
  {
    title: 'Lifetime Library Access',
    desc: 'Every purchased study pack stays in your account permanently with free updates.',
  },
  {
    title: 'Instant Web & PDF Reader',
    desc: 'Read seamlessly across any device with dark mode, zoom, and instant notes.',
  },
  {
    title: 'Verified PYQs & Solutions',
    desc: 'Topic-wise past year questions mapped to official examination syllabi.',
  },
];

export default function AuthShell({
  eyebrow = 'Student Account',
  title,
  subtitle,
  children,
  footer,
  backHref = '/',
  backLabel = 'Back to library',
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr] bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Left Feature Showcase Banner (Desktop) */}
      <aside className="hidden lg:flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-10 xl:p-14">
        <div>
          <div className="flex items-center justify-between">
            <BrandLogo size="md" showTagline={true} />
            <ThemeToggle />
          </div>

          <div className="mt-14 max-w-md">
            <span className="eyebrow">
              Computer Science &amp; IT Platform
            </span>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Study notes, solved PYQs and mock tests in one place.
            </h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Log in to sync your study desk, resume reading notes from any device, and access
              official syllabus-mapped question banks.
            </p>

            <div className="mt-8 space-y-4">
              {FEATURE_POINTS.map((feat) => (
                <div key={feat.title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {feat.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>256-Bit SSL Encrypted Sessions</span>
          </p>
          <span>Hritikpedia Education</span>
        </div>
      </aside>

      {/* Main Form Canvas */}
      <main id="main-content" className="flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-12">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Header Bar */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <BrandLogo size="sm" showTagline={false} />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href={backHref}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Home</span>
              </Link>
            </div>
          </div>

          <Link
            href={backHref}
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{backLabel}</span>
          </Link>

          <div>
            {eyebrow && (
              <span className="eyebrow mb-1">
                {eyebrow}
              </span>
            )}
            <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <div className="card mt-6 p-6 sm:p-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
            {children}
          </div>

          {footer && (
            <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
              {footer}
            </div>
          )}

          <p className="mt-6 text-center text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
            By continuing, you agree to Hritikpedia's{' '}
            <Link
              href="/terms"
              className="text-slate-600 dark:text-slate-400 underline hover:text-blue-600"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy-policy"
              className="text-slate-600 dark:text-slate-400 underline hover:text-blue-600"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
