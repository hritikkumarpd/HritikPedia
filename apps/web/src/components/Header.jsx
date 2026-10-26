'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import BrandLogo from './BrandLogo';
import ThemeToggle from './ThemeToggle';
import { useCart } from './CartContext';
import {
  Search,
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  LayoutDashboard,
  BookOpen,
  Receipt,
  Settings,
  LogOut,
  Sparkles,
  Command,
  Library,
  GraduationCap,
} from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Notes', href: '/notes', hasDropdown: true },
  { name: 'Subjects', href: '/subjects' },
  { name: 'Mock Tests', href: '/tests' },
  { name: 'Free Resources', href: '/free-resources' },
  { name: 'About', href: '/about' },
];

const NOTES_MENU = [
  { name: 'All Study Notes', desc: 'Complete CSE & IT Library', href: '/notes' },
  { name: 'Bihar STET (Paper-II)', desc: 'Computer Science Core', href: '/notes?exam=bihar-stet' },
  { name: 'BPSC Computer Teacher', desc: 'TRE 3.0 & 4.0 Syllabus', href: '/notes?exam=bpsc' },
  { name: 'Engineering Core', desc: 'OS, DBMS, Networks & DSA', href: '/notes?domain=engineering' },
  { name: 'Free Revision Sheets', desc: 'Formulas & Handbooks', href: '/free-resources' },
];

function initialsFor(user) {
  const source = user?.name || user?.email || 'Student';
  const parts = source.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join('') || 'S';
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [user, setUser] = useState(null);

  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, setIsOpen: setCartOpen } = useCart();
  const notesRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setNotesOpen(false);
    setUserOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.user) setUser(data.user);
        }
      } catch {
        // Guest mode
      }
    }
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event) {
      if (notesRef.current && !notesRef.current.contains(event.target)) setNotesOpen(false);
      if (userRef.current && !userRef.current.contains(event.target)) setUserOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setNotesOpen(false);
        setUserOpen(false);
        setMobileMenuOpen(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        router.push('/search');
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setUserOpen(false);
      router.push('/');
      router.refresh();
    } catch {}
  };

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo */}
          <BrandLogo size="md" showTagline={true} />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {NAV_LINKS.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    ref={notesRef}
                    onMouseEnter={() => setNotesOpen(true)}
                    onMouseLeave={() => setNotesOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setNotesOpen((o) => !o)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        isActive(link.href)
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                          : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          notesOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>

                    {notesOpen && (
                      <div className="absolute left-0 top-full mt-1.5 w-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            Study Library
                          </span>
                          <Link
                            href="/notes"
                            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View All
                          </Link>
                        </div>
                        <div className="pt-1 space-y-0.5">
                          {NOTES_MENU.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex flex-col px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                            >
                              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                {item.name}
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                {item.desc}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-bold'
                      : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Hub */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Search */}
            <Link
              href="/search"
              aria-label="Search study notes"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search notes...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] font-mono border border-slate-200 dark:border-slate-700 text-slate-400">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </Link>

            {/* Accessible Theme Toggle */}
            <ThemeToggle />

            {/* Shopping Cart Trigger */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Shopping Cart with ${cartCount} item${cartCount === 1 ? '' : 's'}`}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / App Access */}
            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserOpen((o) => !o)}
                  aria-label="Open student profile menu"
                  aria-expanded={userOpen}
                  className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                    {initialsFor(user)}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-2 z-50 animate-in fade-in duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.name || 'Student'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-1 text-xs">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/my-notes"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        My Library
                      </Link>
                      <Link
                        href="/dashboard/purchases"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        Orders &amp; Receipts
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        Settings
                      </Link>
                    </div>
                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="hidden sm:inline-flex text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1.5 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/dashboard"
                  className="btn btn-primary btn-sm rounded-lg"
                >
                  Student Desk
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 transition-all">
          <Link
            href="/search"
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search study notes &amp; PYQs...</span>
          </Link>

          <nav className="flex flex-col gap-1 text-sm font-semibold">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Theme</span>
            <ThemeToggle showLabel={true} />
          </div>
        </div>
      )}
    </header>
  );
}
