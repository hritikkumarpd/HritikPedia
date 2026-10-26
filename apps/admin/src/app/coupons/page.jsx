'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Tag,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  RefreshCw,
  Percent,
  Users,
  Power,
} from 'lucide-react';

function couponStatus(coupon) {
  if (!coupon.is_active) {
    return { label: 'Inactive', className: 'bg-paper-3 text-ink-soft border-line' };
  }
  if (coupon.valid_until && new Date(coupon.valid_until).getTime() <= Date.now()) {
    return { label: 'Expired', className: 'bg-sun-soft text-sun-dark border-sun-dark/25' };
  }
  if (Number(coupon.current_uses) >= Number(coupon.max_uses)) {
    return { label: 'Exhausted', className: 'bg-sun-soft text-sun-dark border-sun-dark/25' };
  }
  return { label: 'Active', className: 'bg-mint-soft text-mint border-mint/25' };
}

function formatDate(value) {
  if (!value) return 'No expiry';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const initialForm = {
  code: '',
  discountPercent: 10,
  maxUses: 100,
  validUntil: '',
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState(null);

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load coupons');
      setCoupons(data.coupons || []);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code,
          discountPercent: Number(form.discountPercent),
          maxUses: Number(form.maxUses),
          validUntil: form.validUntil ? new Date(form.validUntil).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create coupon');

      setMessage({ type: 'success', text: data.message || 'Coupon created successfully.' });
      setForm(initialForm);
      await loadCoupons();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const toggleCoupon = async (coupon) => {
    setUpdatingId(coupon.id);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: coupon.id, isActive: !coupon.is_active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update coupon');

      setCoupons((prev) =>
        prev.map((item) => (item.id === coupon.id ? data.coupon : item))
      );
      setMessage({
        type: 'success',
        text: `${coupon.code} is now ${!coupon.is_active ? 'active' : 'inactive'}.`,
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const totalRedemptions = coupons.reduce(
    (sum, coupon) => sum + Number(coupon.current_uses || 0),
    0
  );
  const activeCount = coupons.filter(
    (coupon) => couponStatus(coupon).label === 'Active'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Coupon Management</h1>
          <p className="text-xs text-muted mt-1">
            Create checkout discounts. Coupons are validated server-side before an order is created.
          </p>
        </div>
        <button
          type="button"
          onClick={loadCoupons}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-paper-2 hover:bg-paper-2 border border-line-strong text-ink-soft rounded-xl text-xs font-semibold transition-colors self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
            message.type === 'error'
              ? 'bg-brick-soft border border-brick/30 text-brick'
              : 'bg-mint-soft border border-mint/30 text-mint'
          }`}
        >
          <span className="flex items-center gap-2">
            {message.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0" />
            )}
            {message.text}
          </span>
          <button
            onClick={() => setMessage(null)}
            className="text-muted hover:text-ink ml-4"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-cream p-5 rounded-2xl border border-line shadow-xl">
          <div className="text-xs font-medium text-muted flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Total Coupons
          </div>
          <div className="text-2xl font-bold text-ink mt-2">{coupons.length}</div>
        </div>
        <div className="bg-cream p-5 rounded-2xl border border-line shadow-xl">
          <div className="text-xs font-medium text-muted flex items-center gap-1.5">
            <Power className="w-3.5 h-3.5" /> Active Coupons
          </div>
          <div className="text-2xl font-bold text-mint mt-2">{activeCount}</div>
        </div>
        <div className="bg-cream p-5 rounded-2xl border border-line shadow-xl">
          <div className="text-xs font-medium text-muted flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Redemptions
          </div>
          <div className="text-2xl font-bold text-royal mt-2">{totalRedemptions}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <form
          onSubmit={handleCreate}
          className="bg-cream p-6 rounded-2xl border border-line shadow-xl space-y-4"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-line">
            <Plus className="w-4 h-4 text-mint" />
            <h2 className="text-sm font-semibold text-ink">Create Coupon</h2>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-soft mb-1">Coupon Code</label>
            <input
              type="text"
              required
              maxLength={30}
              value={form.code}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
              }
              placeholder="WELCOME10"
              className="w-full px-3 py-2 bg-paper-2 border border-line-strong rounded-xl text-ink text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-royal"
            />
            <p className="text-[10px] text-muted mt-1">
              3-30 characters: letters, numbers, hyphens, underscores.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1">
                Discount %
              </label>
              <div className="relative">
                <Percent className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={form.discountPercent}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, discountPercent: e.target.value }))
                  }
                  className="w-full pl-8 pr-3 py-2 bg-paper-2 border border-line-strong rounded-xl text-ink text-xs focus:outline-none focus:border-royal"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1">Max Uses</label>
              <input
                type="number"
                required
                min="1"
                max="100000"
                value={form.maxUses}
                onChange={(e) => setForm((prev) => ({ ...prev, maxUses: e.target.value }))}
                className="w-full px-3 py-2 bg-paper-2 border border-line-strong rounded-xl text-ink text-xs focus:outline-none focus:border-royal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-soft mb-1">
              Expiry (optional)
            </label>
            <input
              type="datetime-local"
              value={form.validUntil}
              onChange={(e) => setForm((prev) => ({ ...prev, validUntil: e.target.value }))}
              className="w-full px-3 py-2 bg-paper-2 border border-line-strong rounded-xl text-ink text-xs focus:outline-none focus:border-royal"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-royal hover:bg-royal-dark text-cream rounded-xl text-xs font-semibold shadow-lg shadow-none disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Create Coupon
              </>
            )}
          </button>
        </form>

        <div className="xl:col-span-2 bg-cream rounded-2xl border border-line shadow-xl overflow-hidden">
          <div className="p-5 border-b border-line">
            <h2 className="text-sm font-semibold text-ink">All Coupons</h2>
            <p className="text-xs text-muted mt-0.5">
              Deactivate a coupon to stop new checkouts immediately.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink-soft">
              <thead className="bg-paper-2 text-[11px] font-semibold text-muted uppercase tracking-wider border-b border-line">
                <tr>
                  <th className="px-5 py-3.5">Code</th>
                  <th className="px-5 py-3.5">Discount</th>
                  <th className="px-5 py-3.5">Uses</th>
                  <th className="px-5 py-3.5">Expiry</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center text-muted">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-royal" />
                      Loading coupons...
                    </td>
                  </tr>
                ) : coupons.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center text-muted">
                      <Tag className="w-6 h-6 text-muted mx-auto mb-2" />
                      No coupons created yet. Use the form to create your first discount code.
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => {
                    const status = couponStatus(coupon);
                    return (
                      <tr key={coupon.id} className="hover:bg-paper-2/30 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-ink">
                          {coupon.code}
                        </td>
                        <td className="px-5 py-4 font-semibold text-ink-soft">
                          {coupon.discount_percent}%
                        </td>
                        <td className="px-5 py-4">
                          {coupon.current_uses} / {coupon.max_uses}
                        </td>
                        <td className="px-5 py-4 text-muted">
                          {formatDate(coupon.valid_until)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => toggleCoupon(coupon)}
                            disabled={updatingId === coupon.id}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-50 ${
                              coupon.is_active
                                ? 'bg-brick-soft hover:bg-brick-soft text-brick border-brick/25'
                                : 'bg-mint-soft hover:bg-mint-soft text-mint border-mint/25'
                            }`}
                          >
                            {updatingId === coupon.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Power className="w-3.5 h-3.5" />
                            )}
                            {coupon.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
