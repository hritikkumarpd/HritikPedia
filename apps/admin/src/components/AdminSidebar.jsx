'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from './BrandLogo';
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  ShieldAlert,
  Sliders,
  Megaphone,
  Mail,
  ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/notes', label: 'Notes CMS', icon: FileText },
  { href: '/users', label: 'User Directory', icon: Users },
  { href: '/orders', label: 'Orders & Refunds', icon: CreditCard },
  { href: '/pdf-policies', label: 'PDF & Watermarks', icon: Sliders },
  { href: '/advertising', label: 'Ad Placements', icon: Megaphone },
  { href: '/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/security', label: 'SOC Threat Logs', icon: ShieldAlert },
];

export default function AdminSidebar({ userRole }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#07172B] border-r border-slate-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand Logo & Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" theme="dark" />
        </div>
        <div className="mt-2 text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-950/60 border border-blue-900/60 px-2.5 py-1 rounded-md inline-block">
          Staff Console
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info & Public App link */}
      <div className="p-4 border-t border-slate-800/80">
        <a
          href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
        >
          <span>View Public Platform</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="mt-3 text-center">
          <p className="text-[10px] text-slate-500 font-medium">Hritikpedia v2.0 Enterprise</p>
          <p className="text-[10px] text-slate-600">Zero-Budget-First Architecture</p>
        </div>
      </div>
    </aside>
  );
}
