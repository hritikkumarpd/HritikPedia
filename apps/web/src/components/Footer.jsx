'use client';

import React from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { Mail, ShieldCheck, BookOpen, Layers, Sparkles, FileText, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#07172B] text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column (Col Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo theme="dark" size="md" />
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed mt-3">
              Hritikpedia is an educational platform dedicated to delivering high-yield, structured computer science notes, university exam blueprints, and previous-year question solutions.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#FFB923] font-medium pt-2">
              <span className="w-2 h-2 rounded-full bg-[#FFB923] animate-pulse"></span>
              Official Tagline: <strong className="text-white">Stop Searching. Start Learning.</strong>
            </div>
            <div className="pt-2">
              <a
                href="mailto:support@hritikpedia.com"
                className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-[#087BFF] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#087BFF]" />
                support@hritikpedia.com
              </a>
            </div>
          </div>

          {/* Academic Resources */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#087BFF]" />
              Study Notes
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/notes" className="hover:text-white transition-colors">
                  All Study Notes
                </Link>
              </li>
              <li>
                <Link href="/notes/dbms-normalization-notes" className="hover:text-white transition-colors">
                  DBMS Normalization Notes
                </Link>
              </li>
              <li>
                <Link href="/notes/operating-systems-process-synchronization" className="hover:text-white transition-colors">
                  OS Synchronization &amp; Deadlocks
                </Link>
              </li>
              <li>
                <Link href="/notes/bihar-stet-cs-syllabus-blueprint" className="hover:text-white transition-colors">
                  Bihar STET CS Blueprint
                </Link>
              </li>
              <li>
                <Link href="/free-resources" className="text-[#FFB923] hover:underline flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Free Revision Materials
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Subjects */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#087BFF]" />
              Subjects
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/subjects/dbms" className="hover:text-white transition-colors">
                  Database Management Systems
                </Link>
              </li>
              <li>
                <Link href="/subjects/operating-systems" className="hover:text-white transition-colors">
                  Operating Systems
                </Link>
              </li>
              <li>
                <Link href="/subjects/computer-networks" className="hover:text-white transition-colors">
                  Computer Networks
                </Link>
              </li>
              <li>
                <Link href="/subjects/digital-logic" className="hover:text-white transition-colors">
                  Digital Logic &amp; Architecture
                </Link>
              </li>
              <li>
                <Link href="/subjects/data-structures-algorithms" className="hover:text-white transition-colors">
                  Data Structures &amp; Algorithms
                </Link>
              </li>
              <li>
                <Link href="/subjects" className="text-[#087BFF] hover:underline">
                  View All Subjects &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Legal Disclosures */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#087BFF]" />
              Company &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Hritikpedia
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-white transition-colors">
                  Educational Articles
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Refund &amp; Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/advertising-disclosure" className="hover:text-white transition-colors">
                  Advertising &amp; Sponsor Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Ethical Notice & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            &copy; {currentYear} <strong className="text-white">Hritikpedia</strong>. All rights reserved. Zero-Budget-First Educational Architecture.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Secure In-Browser PDF Reader</span>
            <span>•</span>
            <span>Protected Watermarked Learning</span>
            <span>•</span>
            <span>Encrypted Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
