'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  AlertTriangle,
  Loader2,
  X,
  ShieldCheck,
  ReceiptText,
  Wallet,
} from 'lucide-react';
import { formatINR } from '@hritikpedia/shared/payment';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refundReason, setRefundReason] = useState('Student requested cancellation within policy window');
  const [processingRefund, setProcessingRefund] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefund = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setProcessingRefund(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.order_id,
          reason: refundReason,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Refund execution failed');

      setMessage({
        type: 'success',
        text: json.message || `Order ${selectedOrder.order_id} refunded and access revoked.`,
      });
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setProcessingRefund(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.order_id.toLowerCase().includes(q) ||
      o.student_email.toLowerCase().includes(q) ||
      o.note_title.toLowerCase().includes(q)
    );
  });

  const paidTotal = useMemo(
    () => orders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + Number(o.amount || 0), 0),
    [orders]
  );
  const refundedCount = useMemo(() => orders.filter((o) => o.status === 'refunded').length, [orders]);

  return (
    <div className="space-y-6">
      <div>
        <p className="admin-eyebrow">Commerce</p>
        <h2 className="mt-1.5 font-display text-[1.7rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[2rem]">
          Every payment, accounted for.
        </h2>
        <p className="mt-1.5 max-w-2xl text-xs font-medium leading-relaxed text-ink-soft">
          Reconcile Razorpay settlements, inspect payment identifiers and process policy-compliant
          refunds against the live ledger.
        </p>
      </div>

      {message && (
        <div
          role={message.type === 'error' ? 'alert' : 'status'}
          className={`flex items-center justify-between gap-3 rounded-xl border p-3 text-[11px] font-semibold ${
            message.type === 'error'
              ? 'border-brick/25 bg-brick-soft text-brick'
              : 'border-mint/25 bg-mint-soft text-mint'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="opacity-70 hover:opacity-100" aria-label="Dismiss message">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-cream p-3.5 shadow-[0_1px_0_#e4dac9]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-muted">
              Transactions
            </span>
            <ReceiptText className="h-4 w-4 text-royal" />
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold leading-none tracking-tight text-ink">
            {orders.length.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-muted">All orders on record</p>
        </div>
        <div className="rounded-xl border border-line bg-cream p-3.5 shadow-[0_1px_0_#e4dac9]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-muted">
              Paid value
            </span>
            <Wallet className="h-4 w-4 text-mint" />
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold leading-none tracking-tight text-ink">
            {formatINR(paidTotal)}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-muted">Currently paid orders</p>
        </div>
        <div className="rounded-xl border border-line bg-cream p-3.5 shadow-[0_1px_0_#e4dac9]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-muted">
              Refunds
            </span>
            <RotateCcw className="h-4 w-4 text-sun-dark" />
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold leading-none tracking-tight text-ink">
            {refundedCount.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-muted">Orders refunded to date</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-line bg-cream p-3 shadow-[0_1px_0_#e4dac9] sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, student email or note…"
            className="admin-input pl-9"
          />
        </div>
        <div className="shrink-0 pr-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted">
          {filteredOrders.length} transactions
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-cream shadow-[0_1px_0_#e4dac9]">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID &amp; date</th>
                <th>Student</th>
                <th>Purchased note</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment ID</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-muted">
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-royal" />
                    <span>Loading payment transactions…</span>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-muted">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <div className="font-mono text-[11px] font-bold text-ink">{o.order_id}</div>
                      <div className="mt-0.5 text-[10px] font-medium text-muted">
                        {new Date(o.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div className="text-[11px] font-bold text-ink">{o.student_name}</div>
                      <div className="mt-0.5 font-mono text-[10px] font-medium text-muted">{o.student_email}</div>
                    </td>
                    <td className="max-w-[220px] text-[11px] font-medium text-ink-soft">{o.note_title}</td>
                    <td className="whitespace-nowrap text-[11px] font-extrabold text-ink">{formatINR(o.amount)}</td>
                    <td>
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.08em] ${
                          o.status === 'paid'
                            ? 'border-mint/25 bg-mint-soft text-mint'
                            : o.status === 'refunded'
                              ? 'border-sun-dark/25 bg-sun-soft text-sun-dark'
                              : 'border-line bg-paper-3 text-ink-soft'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="font-mono text-[10px] font-medium text-muted">{o.payment_id || '—'}</td>
                    <td className="text-right">
                      {o.status === 'paid' && (
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="inline-flex items-center gap-1 rounded-lg border border-brick/25 bg-brick-soft px-2.5 py-1 text-[10px] font-extrabold text-brick transition-colors hover:border-brick/50"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Refund</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-line bg-cream p-5 shadow-[0_40px_80px_-40px_rgba(18,32,58,0.6)] sm:p-6">
            <div className="flex items-start justify-between gap-3 border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sun-soft text-sun-dark">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <div>
                  <p className="admin-eyebrow">Irreversible action</p>
                  <h3 className="mt-0.5 font-display text-lg font-extrabold tracking-tight text-ink">
                    Confirm order refund
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-paper-2 hover:text-ink"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRefund} className="mt-4 space-y-4">
              <div className="space-y-1 rounded-xl border border-line bg-paper-2 p-3 text-[11px] font-medium">
                <div>
                  <span className="text-muted">Order:</span>{' '}
                  <span className="font-mono font-bold text-ink">{selectedOrder.order_id}</span>
                </div>
                <div>
                  <span className="text-muted">Student:</span>{' '}
                  <span className="text-ink">{selectedOrder.student_email}</span>
                </div>
                <div>
                  <span className="text-muted">Amount:</span>{' '}
                  <span className="font-extrabold text-mint">{formatINR(selectedOrder.amount)}</span>
                </div>
              </div>

              <div>
                <label className="admin-label" htmlFor="refund-reason">
                  Reason for refund
                </label>
                <textarea
                  id="refund-reason"
                  rows="2"
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="admin-input"
                ></textarea>
              </div>

              <div
                className={`rounded-xl border p-3 text-[10px] font-medium leading-relaxed ${
                  String(selectedOrder.order_id).startsWith('order_dev_')
                    ? 'border-sun-dark/30 bg-sun-soft text-sun-dark'
                    : 'border-brick/25 bg-brick-soft text-brick'
                }`}
              >
                {String(selectedOrder.order_id).startsWith('order_dev_') ? (
                  <>
                    This is a local test order. It will be marked refunded and the student&apos;s
                    access will be revoked, but <strong>no live money will be moved</strong>.
                  </>
                ) : (
                  <>
                    This will issue a <strong>full refund through Razorpay</strong> and immediately
                    revoke the student&apos;s digital access. The order is only marked refunded if
                    Razorpay accepts the refund.
                  </>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={processingRefund} className="admin-btn admin-btn-danger">
                  {processingRefund ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Processing refund…</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Execute refund</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
