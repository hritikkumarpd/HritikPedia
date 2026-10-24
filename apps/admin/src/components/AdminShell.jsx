'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { Loader2 } from 'lucide-react';

export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we're already on login page, skip
    if (pathname === '/login') {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error('Session verification failed:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07172B] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-xs tracking-wider uppercase text-slate-400 font-semibold">
          Authenticating Security Console...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <AdminSidebar userRole={user?.role} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-950/60">
          {children}
        </main>
      </div>
    </div>
  );
}
