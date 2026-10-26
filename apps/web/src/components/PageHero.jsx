import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs = [],
  children,
  aside,
  className = '',
}) {
  return (
    <section
      className={`border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xs ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            {breadcrumbs.map((crumb) => (
              <React.Fragment key={crumb.label}>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className={`grid items-center gap-8 ${aside ? 'lg:grid-cols-[1.4fr_1fr]' : ''}`}>
          <div className="max-w-3xl">
            {eyebrow && (
              <span className="eyebrow mb-2">
                {eyebrow}
              </span>
            )}
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
            {children && <div className="mt-6">{children}</div>}
          </div>
          {aside && <div className="w-full">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
