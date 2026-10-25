'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from './BrandLogo';
import {
  Search,
  Menu,
  X,
  BookOpen,
  Layers,
  Sparkles,
  FileText,
  Info,
  User,
  LogOut,
  Landmark,
  School,
  Cpu,
  GraduationCap,
} from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check client session
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) setUser(data.user);
        }
      } catch {
        // Not authenticated
      }
    }
    checkAuth();
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/', icon: null },
    { name: 'All Notes', href: '/notes', icon: BookOpen },
    { name: 'Govt. Exams', href: '/notes?domain=general_competitions', icon: Landmark, badge: 'UPSC/BPSC' },
    { name: '10th & 12th Boards', href: '/notes?domain=school_boards', icon: School, badge: 'CBSE/BSEB' },
    { name: 'Engineering', href: '/notes?domain=engineering', icon: Cpu, badge: 'AKTU/BEU' },
    { name: 'Free (₹0)', href: '/free-resources', icon: Sparkles, badge: 'Free' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-2.5'
          : 'bg-[#F5F8FC] border-b border-slate-200/50 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6 xl:gap-8">
          <BrandLogo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || (pathname === '/notes' && link.href.includes('domain'));
              const Icon = link.icon;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'text-[#087BFF] bg-blue-50/80'
                      : 'text-[#26354B] hover:text-[#087BFF] hover:bg-slate-100/80'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 opacity-80" />}
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] font-black px-1.5 py-0.2 bg-[#FFB923]/20 text-[#07172B] rounded-full border border-[#FFB923]/40">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Search & Auth Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/search"
            aria-label="Search study notes, exams, boards"
            className="p-2 text-slate-600 hover:text-[#087BFF] hover:bg-slate-100 rounded-full transition-colors hidden sm:flex items-center gap-2 px-3 border border-slate-200/80 bg-white text-xs font-medium"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500 hidden md:inline">Search UPSC, BSEB, CBSE, AKTU...</span>
            <span className="text-slate-500 md:hidden">Search...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-500 rounded border border-slate-300">
              /
            </kbd>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#07172B] bg-slate-100 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#087BFF]" />
                <span className="max-w-[120px] truncate">{user.name || user.email.split('@')[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-semibold text-[#07172B] hover:text-[#087BFF] transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-lg shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#087BFF] hover:bg-slate-100 rounded-lg transition-colors"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-white border-b border-slate-200 shadow-xl px-4 py-5 space-y-3 animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 mb-2"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search UPSC, BPSC, BSEB, CBSE, AKTU notes...</span>
          </Link>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                    isActive
                      ? 'text-[#087BFF] bg-blue-50'
                      : 'text-[#26354B] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && <Icon className="w-4 h-4 text-[#087BFF]" />}
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-black px-2 py-0.5 bg-[#FFB923]/20 text-[#07172B] rounded-full border border-[#FFB923]/40">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <Link
              href="/subjects"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#26354B] hover:bg-slate-50 rounded-lg"
            >
              <Layers className="w-4 h-4 text-slate-500" />
              <span>Browse All Subjects</span>
            </Link>
            <Link
              href="/articles"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#26354B] hover:bg-slate-50 rounded-lg"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Exam Strategy Articles</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-semibold text-white bg-[#07172B] rounded-lg"
                >
                  Student Dashboard ({user.name || user.email})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-lg"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-semibold text-[#07172B] bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
