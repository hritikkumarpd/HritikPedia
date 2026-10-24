'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  FileText,
  CreditCard,
  Mail,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileCheck,
  Sliders,
} from 'lucide-react';
import { formatINR } from '@hritikpedia/shared/payment';

export default function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/overview');
      if (!res.ok) throw new Error('Failed to load overview telemetry');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-800/60 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200">
        <p className="font-semibold">Failed to fetch platform metrics</p>
        <p className="text-xs text-red-300 mt-1">{error}</p>
        <button
          onClick={fetchOverview}
          className="mt-4 px-4 py-2 bg-red-800/80 hover:bg-red-700 text-white text-xs font-semibold rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  const m = data?.metrics || {};

  return (
    <div className="space-y-8">
      {/* Page Title & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Security &amp; Operations Command
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics, content catalogue governance, and threat telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Manage Content</span>
          </Link>
          <Link
            href="/security"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>View SOC Threat Feed</span>
          </Link>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Revenue */}
        <div className="bg-[#0B1D36] p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Net Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{formatINR(m.totalRevenue || 0)}</div>
            <p className="text-[11px] text-slate-400 mt-1">
              {m.paidOrders || 0} completed orders ({m.totalOrders || 0} created)
            </p>
          </div>
        </div>

        {/* Card 2: Learners */}
        <div className="bg-[#0B1D36] p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Registered Learners</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{m.totalUsers || 0}</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Active student accounts &amp; staff
            </p>
          </div>
        </div>

        {/* Card 3: Notes Catalogue */}
        <div className="bg-[#0B1D36] p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Educational Notes</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{m.publishedNotes || 0} Published</div>
            <p className="text-[11px] text-slate-400 mt-1">
              {m.freeNotes || 0} Free Resources &bull; {m.paidNotes || 0} Premium
            </p>
          </div>
        </div>

        {/* Card 4: Newsletter Subscribers */}
        <div className="bg-[#0B1D36] p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Subscribers</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{m.newsletterSubscribers || 0} Active</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Double opt-in verified audience
            </p>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Security Events & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Security Incidents */}
        <div className="bg-[#0B1D36] p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">SOC Threat Feed (Recent)</h2>
            </div>
            <Link
              href="/security"
              className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {data?.recentSecurityEvents?.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No security incidents detected.</p>
            ) : (
              data?.recentSecurityEvents?.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-amber-400">{evt.event_type}</span>
                      <span className="text-slate-500 text-[10px] font-mono">{evt.ip_address}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      {typeof evt.details === 'object'
                        ? JSON.stringify(evt.details)
                        : evt.details || 'Telemetry captured'}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {new Date(evt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Admin Audit Activity */}
        <div className="bg-[#0B1D36] p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-white">Staff Audit Trail (Recent)</h2>
            </div>
            <Link
              href="/security"
              className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {data?.recentAuditLogs?.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No staff changes recorded yet.</p>
            ) : (
              data?.recentAuditLogs?.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-400">{log.action}</span>
                      <span className="text-slate-400 text-[10px]">&bull; {log.actor_email}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Target: {log.entity_type} #{log.entity_id || ''}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
