'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import BrandLogo from '../../components/BrandLogo';
import {
  LayoutDashboard,
  BookOpen,
  Receipt,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  User,
  Menu,
  X,
  Loader2,
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8FC]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#087BFF] animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading student dashboard...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Study Notes', href: '/dashboard/my-notes', icon: BookOpen },
    { name: 'Purchase History', href: '/dashboard/purchases', icon: Receipt },
    { name: 'Account Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#F5F8FC]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <BrandLogo size="sm" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Mini Badge */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#07172B] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#07172B] truncate">{user?.name || 'Student'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-[#087BFF]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#07172B]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#087BFF]' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-5 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#087BFF] bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <span>Back to Main Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-[#07172B] hidden sm:block">
              Student Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Watermarked Protection Active</span>
            </div>
          </div>
        </header>

        {/* Dashboard Pages Mount Here */}
        <div className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</div>
      </div>
    </div>
  );
}
