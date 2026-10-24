'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Shield, Database, Bell } from 'lucide-react';

export default function AdminHeader({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'security_analyst':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'content_admin':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <header className="h-16 bg-[#07172B]/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>PostgreSQL Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-white">{user.name || 'Staff'}</p>
              <p className="text-[11px] text-slate-400">{user.email}</p>
            </div>

            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getRoleBadgeColor(
                user.role
              )}`}
            >
              {user.role?.replace('_', ' ')}
            </span>
          </div>
        )}

        <button
          onClick={handleLogout}
          title="Sign out of console"
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition-colors ml-2"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
