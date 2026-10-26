'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from './BrandLogo';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Mail,
  ShieldAlert,
  Sliders,
  Megaphone,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { hasPermission, PERMISSIONS, ROLES } from '@hritikpedia/shared/permissions';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ href: '/', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Commerce & Content',
    items: [
      { href: '/notes', label: 'Study Products', icon: Package, permission: PERMISSIONS.CONTENT_VIEW },
      {
        href: '/orders',
        label: 'Orders & Receipts',
        icon: ShoppingBag,
        permission: PERMISSIONS.COMMERCE_VIEW_ORDERS,
      },
      {
        href: '/coupons',
        label: 'Promo Coupons',
        icon: Tag,
        permission: PERMISSIONS.COMMERCE_MANAGE_COUPONS,
      },
    ],
  },
  {
    label: 'Community & Growth',
    items: [
      { href: '/users', label: 'Users & Roles', icon: Users, permission: PERMISSIONS.USERS_VIEW },
      {
        href: '/newsletter',
        label: 'Mailing List',
        icon: Mail,
        permission: PERMISSIONS.NEWSLETTER_MANAGE,
      },
      {
        href: '/advertising',
        label: 'Ad Slots',
        icon: Megaphone,
        permission: PERMISSIONS.ADS_MANAGE,
      },
    ],
  },
  {
    label: 'Security & Governance',
    items: [
      {
        href: '/security',
        label: 'Audit Log',
        icon: ShieldAlert,
        permission: PERMISSIONS.AUDIT_VIEW,
      },
      {
        href: '/pdf-policies',
        label: 'Watermark Policies',
        icon: Sliders,
        permission: PERMISSIONS.PDF_MANAGE_POLICY,
      },
    ],
  },
];

const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.CONTENT_ADMIN]: 'Content Admin',
  [ROLES.MARKETING_ADMIN]: 'Marketing Admin',
  [ROLES.SUPPORT_ADMIN]: 'Support Admin',
  [ROLES.SECURITY_ANALYST]: 'Security Analyst',
};

export default function AdminSidebar({ userRole }) {
  const pathname = usePathname();

  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => !item.permission || hasPermission(userRole, item.permission)
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <aside className="sticky top-0 z-40 flex h-screen w-20 shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 lg:w-64 transition-all">
      {/* Brand header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6">
        <BrandLogo size="sm" showTagline={false} className="lg:hidden" variant="icon-only" />
        <BrandLogo size="sm" showTagline={false} className="hidden lg:inline-flex" />
        <span className="hidden rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary lg:inline-block">
          Console
        </span>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Admin console navigation">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 hidden px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 lg:block">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center justify-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-all lg:justify-start ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer information */}
      <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 p-4">
        <div className="hidden lg:block">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Role
          </p>
          <p className="mt-0.5 text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{ROLE_LABELS[userRole] || 'Administrator'}</span>
          </p>
        </div>
        <a
          href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
          target="_blank"
          rel="noopener noreferrer"
          title="Open public site"
          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors lg:justify-between"
        >
          <span className="hidden lg:inline text-[11px]">View Student Portal</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </aside>
  );
}
