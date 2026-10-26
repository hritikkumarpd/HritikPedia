'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { ChevronDown, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';

const PAGE_TITLES = {
  '/': 'Operations Overview',
  '/notes': 'Product & Notes Catalog',
  '/orders': 'Transactions & Invoices',
  '/users': 'User Accounts & Roles',
  '/coupons': 'Promotional Coupons',
  '/newsletter': 'Newsletter Subscribers',
  '/security': 'Audit & Security Logs',
  '/pdf-policies': 'Document Security & Watermarking',
  '/advertising': 'Ad Slots & Sponsorships',
};

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  content_admin: 'Content Admin',
  marketing_admin: 'Marketing Admin',
  support_admin: 'Support Admin',
  security_analyst: 'Security Analyst',
};

export default function AdminHeader({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const displayName = user?.name || 'Administrator';
  const displayRole =
    ROLE_LABELS[user?.role] || (user?.role ? user.role.replace(/_/g, ' ') : 'Administrator');
  const pageTitle = PAGE_TITLES[pathname] || 'Admin Console';
  const initial = displayName.trim().charAt(0).toUpperCase() || 'A';

  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!dropdownOpen) return undefined;
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setDropdownOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {
      // The redirect below still clears local state
    }
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5 text-xs">
          <span className="hidden font-bold text-slate-400 sm:inline">Admin</span>
          <span className="hidden text-slate-300 dark:text-slate-700 sm:inline">/</span>
          <h1 className="truncate text-sm font-bold text-slate-900 dark:text-white">{pageTitle}</h1>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors sm:inline-flex"
          >
            <span>Live Student Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <ThemeToggle size="sm" />

          {/* User Profile Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((open) => !open)}
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-1.5 pr-2.5 transition-colors hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white shadow-xs">
                {initial}
              </span>
              <span className="hidden max-w-[130px] truncate text-xs font-bold text-slate-800 dark:text-slate-200 sm:inline">
                {displayName}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl"
                role="menu"
              >
                <div className="border-b border-slate-100 dark:border-slate-800 p-4">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{displayName}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {user?.email || 'Admin Session'}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{displayRole}</span>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    role="menuitem"
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Terminate Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
