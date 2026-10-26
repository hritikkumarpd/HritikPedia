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
    // If we're already on login page, skip verification
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
          Authenticating Admin Session...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <AdminSidebar userRole={user?.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader user={user} />
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
