'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Users,
  CreditCard,
  BookOpen,
} from 'lucide-react';
import { formatINR } from '@hritikpedia/shared/payment';

function formatDay(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  });
}

function statusClass(status) {
  if (status === 'paid') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
  if (status === 'refunded') return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
  if (status === 'failed') return 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800';
  return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [overviewRes, ordersRes] = await Promise.all([
        fetch('/api/admin/overview', { cache: 'no-store' }),
        fetch('/api/admin/orders', { cache: 'no-store' }),
      ]);

      if (!overviewRes.ok) {
        const payload = await overviewRes.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to load dashboard metrics');
      }
      if (!ordersRes.ok) {
        const payload = await ordersRes.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to load recent orders');
      }

      const overviewData = await overviewRes.json();
      const ordersData = await ordersRes.json();

      setOverview(overviewData);
      setRecentOrders((ordersData.orders || []).slice(0, 6));
    } catch (err) {
      setError(err.message || 'Unable to load the dashboard right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-80 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 lg:col-span-7" />
          <div className="h-80 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 lg:col-span-5" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Could Not Load Metrics</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{error}</p>
          </div>
        </div>
        <button type="button" onClick={loadDashboard} className="btn btn-secondary btn-sm mt-4">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Connection
        </button>
      </div>
    );
  }

  const metrics = overview?.metrics || {};
  const revenue = overview?.revenue || {};
  const series = Array.isArray(revenue.series) ? revenue.series : [];
  const changePercent = revenue.changePercent;
  const isRevenueUp = typeof changePercent === 'number' && changePercent >= 0;
  const maxRevenue = Math.max(0, ...series.map((point) => point.revenue));
  const chartPoints = series.map((point, index) => ({
    ...point,
    x: 10 + (index * 480) / Math.max(1, series.length - 1),
    y: maxRevenue > 0 ? 165 - (point.revenue / maxRevenue) * 130 : 165,
  }));
  const linePoints = chartPoints.map((point) => `${point.x},${point.y}`).join(' ');
  const areaPath = chartPoints.length
    ? `M ${chartPoints[0].x} 178 L ${chartPoints
        .map((point) => `${point.x} ${point.y}`)
        .join(' L ')} L ${chartPoints[chartPoints.length - 1].x} 178 Z`
    : '';
  const labelIndices = [0, 7, 14, 21, 29].filter((index) => index < series.length);

  const stats = [
    {
      label: 'Verified Students',
      icon: Users,
      value: Number(metrics.totalUsers || 0).toLocaleString('en-IN'),
      hint: `${Number(metrics.newsletterSubscribers || 0).toLocaleString('en-IN')} on active newsletter`,
    },
    {
      label: 'Paid Orders',
      icon: CreditCard,
      value: Number(metrics.paidOrders || 0).toLocaleString('en-IN'),
      hint: `${Number(metrics.totalOrders || 0).toLocaleString('en-IN')} checkouts initiated`,
    },
    {
      label: 'Gross Platform Revenue',
      icon: TrendingUp,
      value: formatINR(Number(metrics.totalRevenue || 0)),
      hint: `${formatINR(Number(revenue.last30Days || 0))} in last 30 days`,
    },
    {
      label: 'Catalog Handbooks',
      icon: BookOpen,
      value: Number(metrics.publishedNotes || 0).toLocaleString('en-IN'),
      hint: `${Number(metrics.freeNotes || 0)} free • ${Number(metrics.paidNotes || 0)} premium`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="badge badge-primary">Operations Heartbeat</span>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Platform Analytics &amp; Health
          </h2>
          <p className="text-xs text-slate-500">
            Real-time analytics from PostgreSQL / PGlite database
            {overview?.generatedAt
              ? ` • Updated ${new Date(overview.generatedAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`
              : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={loadDashboard}
          className="btn btn-secondary btn-sm self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="card p-5 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {stat.value}
              </p>
              <p className="mt-1.5 truncate text-xs text-slate-500">{stat.hint}</p>
            </div>
          );
        })}
      </div>

      {/* Charts & Recent Orders */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Revenue Chart */}
        <section className="card p-0 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden lg:col-span-7">
          <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Revenue Performance (Last 30 Days)</h3>
              <p className="text-xs text-slate-500">
                {formatINR(Number(revenue.last30Days || 0))} net revenue recorded
              </p>
            </div>
            {typeof changePercent === 'number' ? (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                  isRevenueUp
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                }`}
              >
                {isRevenueUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {Math.abs(changePercent)}% vs previous 30 days
              </span>
            ) : (
              <span className="text-xs text-slate-400">Baseline window</span>
            )}
          </div>

          <div className="relative h-60 w-full select-none p-5">
            <svg viewBox="0 0 500 190" fill="none" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="35" x2="500" y2="35" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="165" x2="500" y2="165" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" strokeDasharray="4 4" />

              {areaPath && <path d={areaPath} fill="url(#revenueGrad)" />}
              {linePoints && (
                <polyline
                  points={linePoints}
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}
              {chartPoints.length > 0 && (
                <circle
                  cx={chartPoints[chartPoints.length - 1].x}
                  cy={chartPoints[chartPoints.length - 1].y}
                  r="4"
                  className="fill-white dark:fill-slate-900"
                  stroke="#2563EB"
                  strokeWidth="2"
                >
                  <title>
                    {formatDay(chartPoints[chartPoints.length - 1].date)}:{' '}
                    {formatINR(chartPoints[chartPoints.length - 1].revenue)}
                  </title>
                </circle>
              )}
            </svg>

            {Number(revenue.last30Days || 0) === 0 && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <p className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 text-xs text-slate-500 shadow-sm">
                  No paid transactions recorded in the last 30 days
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 text-[10px] font-semibold text-slate-400">
              {labelIndices.map((index) => (
                <span key={series[index].date}>{formatDay(series[index].date)}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Orders List */}
        <section className="card p-0 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden lg:col-span-5">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-5 py-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
              <p className="text-xs text-slate-500">Live order stream</p>
            </div>
            <Link
              href="/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              All Orders
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingBag className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700" />
                <p className="mt-2 text-xs font-bold text-slate-900 dark:text-white">No Orders Logged</p>
                <p className="text-[11px] text-slate-500">New checkouts will stream here in real time.</p>
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <span className="block max-w-[110px] truncate font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {order.order_id}
                        </span>
                        <span className="block max-w-[130px] truncate text-[11px] text-slate-400">
                          {order.note_title}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="block max-w-[90px] truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {order.student_name}
                        </span>
                        <span className="block max-w-[110px] truncate text-[10px] text-slate-400">
                          {order.student_email}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-900 dark:text-white">
                        {formatINR(order.amount)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
