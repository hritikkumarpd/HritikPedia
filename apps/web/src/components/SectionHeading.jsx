import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className = '',
}) {
  return (
    <div
      className={`mb-6 ${
        align === 'center'
          ? 'text-center max-w-2xl mx-auto'
          : 'sm:flex sm:items-end sm:justify-between sm:gap-6'
      } ${className}`}
    >
      <div className={align === 'center' ? '' : 'max-w-2xl'}>
        {eyebrow && (
          <span className="eyebrow mb-1">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0"
        >
          <span>{action.label}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
