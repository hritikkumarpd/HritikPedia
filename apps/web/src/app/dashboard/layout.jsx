'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import BrandLogo from '../../components/BrandLogo';
import ThemeToggle from '../../components/ThemeToggle';
import {
  BookOpen,
  Receipt,
  User,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  Compass,
  Sparkles,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'My Library', href: '/dashboard', icon: BookOpen, number: '01' },
  { name: 'Orders & Invoices', href: '/dashboard/purchases', icon: Receipt, number: '02' },
  { name: 'Profile Settings', href: '/dashboard/settings', icon: User, number: '03' },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // The server-side session still expires
    }
    router.push('/');
    router.refresh();
  };

  const isActive = (href) =>
    href === '/dashboard'
      ? pathname === '/dashboard' || pathname === '/dashboard/my-notes'
      : pathname.startsWith(href);

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-5">
      <div>
        {/* Brand header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
          <BrandLogo size="sm" showTagline={false} />
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Student desk badge */}
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Student Desk
            </p>
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              Personal Reading Room
            </p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="mt-6 space-y-1.5" aria-label="Dashboard navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-primary transition-colors'}`} />
                <span className="flex-1">{item.name}</span>
                <span
                  className={`text-[10px] font-mono font-bold ${
                    active ? 'text-white/80' : 'text-slate-400/60'
                  }`}
                >
                  {item.number}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* External quick links */}
        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Catalog Exploration
          </p>
          <div className="mt-2.5 space-y-1">
            {[
              { label: 'Browse Study Notes', href: '/notes' },
              { label: 'Interactive Mock Tests', href: '/tests' },
              { label: 'Free Resource Shelf', href: '/free-resources' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <Compass className="h-3.5 w-3.5 text-primary" />
                  {item.label}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-40" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer controls & logout */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-semibold text-slate-500">Theme</span>
          <ThemeToggle />
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 pt-2 text-[10px] font-medium text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Active Authenticated Session</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close dashboard menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex-col overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl transition-transform duration-200 lg:sticky lg:top-0 lg:flex lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? 'flex translate-x-0' : 'hidden -translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main Container */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Navbar on Mobile */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            aria-label="Open dashboard menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <BrandLogo size="sm" showTagline={false} />
          <ThemeToggle />
        </header>

        {/* Content View */}
        <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8 sm:py-10">
          {children}
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            HritikPedia Student Desk • All personal licenses active
          </p>
          <p>
            Need help?{' '}
            <Link href="/contact" className="font-semibold text-primary hover:underline">
              Contact Student Support
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
