'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle,
  Clock,
  RotateCcw,
  AlertTriangle,
  Loader2,
  X,
  ShieldCheck,
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
        text: `Order ${selectedOrder.order_id} marked as refunded and access revoked.`,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Orders &amp; Payment Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Reconcile payments, track Razorpay settlement identifiers, and process policy refunds
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
            message.type === 'error'
              ? 'bg-red-950/60 border border-red-500/40 text-red-200'
              : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-[#0B1D36] p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders by order ID, email, or note..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium pr-2">
          {filteredOrders.length} transactions
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0B1D36] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Order ID &amp; Date</th>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Purchased Note</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Payment ID</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                    <span>Loading payment transactions...</span>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-slate-500">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-mono font-semibold text-white">{o.order_id}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(o.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{o.student_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{o.student_email}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-200">{o.note_title}</td>
                    <td className="px-5 py-4 font-bold text-white">{formatINR(o.amount)}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          o.status === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : o.status === 'refunded'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-slate-400">
                      {o.payment_id || '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {o.status === 'paid' && (
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
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

      {/* Refund Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1D36] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Confirm Order Refund</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRefund} className="mt-4 space-y-4">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <div>
                  <span className="text-slate-400">Order:</span>{' '}
                  <span className="font-mono text-white">{selectedOrder.order_id}</span>
                </div>
                <div>
                  <span className="text-slate-400">Student:</span>{' '}
                  <span className="text-white">{selectedOrder.student_email}</span>
                </div>
                <div>
                  <span className="text-slate-400">Amount:</span>{' '}
                  <span className="font-bold text-emerald-400">{formatINR(selectedOrder.amount)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Reason for Refund
                </label>
                <textarea
                  rows="2"
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200">
                Warning: Executing a refund will immediately revoke the student&apos;s digital access entitlement in the database and write an immutable audit log.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingRefund}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-red-600/20 disabled:opacity-50"
                >
                  {processingRefund ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Revoking Access...</span>
                    </>
                  ) : (
                    <span>Execute Refund</span>
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
