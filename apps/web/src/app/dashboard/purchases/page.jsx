'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Receipt, CheckCircle2, Clock, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { formatINR } from '@hritikpedia/shared/payment';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPurchases() {
      try {
        const res = await fetch('/api/student/purchases');
        if (res.ok) {
          const data = await res.json();
          setPurchases(data.purchases || []);
        }
      } catch (err) {
        console.error('Error fetching purchases:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPurchases();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#07172B] tracking-tight">
          Purchase &amp; Order History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your verified payments, tax receipts, and order identifiers
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#07172B]">No purchases recorded</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            When you purchase chapter notes or exam blueprints, your itemized receipts and order numbers will be recorded here.
          </p>
          <Link
            href="/notes"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-xl transition-colors"
          >
            <span>Explore Premium Notes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Order Reference</th>
                  <th className="py-3 px-4">Item / Study Note</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#07172B]">
                      {p.order_id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#07172B]">
                      {p.note_title}
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#07172B]">
                      {formatINR(p.amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Paid</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>{p.status}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/reader/${p.note_slug}`}
                        className="text-[#087BFF] hover:underline font-bold inline-flex items-center gap-1"
                      >
                        <span>Open Reader</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
