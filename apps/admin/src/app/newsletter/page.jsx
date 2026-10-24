'use client';

import { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Clock,
  X,
  Sparkles,
} from 'lucide-react';

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });
  const [loading, setLoading] = useState(true);
  const [broadcasting, setBroadcasting] = useState(false);
  const [message, setMessage] = useState(null);

  // Broadcast campaign state
  const [campaign, setCampaign] = useState({
    subject: 'New Computer Science Notes & STET Exam Analysis',
    previewText: 'Comprehensive lecture notes on Database Systems and Operating Systems are now live.',
    contentMarkdown: `Hello Learner,\n\nWe have just published new, high-yield educational notes on Hritikpedia:\n\n1. Database Indexing & B-Trees Complete Guide\n2. Process Synchronization & Deadlocks\n\nVisit https://hritikpedia.com/notes to access them.\n\nKeep Learning,\nHritik Kumar`,
  });

  const fetchNewsletter = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/newsletter');
      if (!res.ok) throw new Error('Failed to load newsletter subscribers');
      const data = await res.json();
      setSubscribers(data.subscribers || []);
      setStats(data.stats || { total: 0, active: 0, unsubscribed: 0 });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletter();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setBroadcasting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch broadcast');

      setMessage({ type: 'success', text: data.message });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Newsletter Audience &amp; Educational Broadcasts
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Compliant double-opt-in subscriber audience management and multi-channel student notifications
        </p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#0B1D36] p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="text-xs font-medium text-slate-400">Total Subscribers</div>
          <div className="text-2xl font-bold text-white mt-2">{stats.total}</div>
          <p className="text-[11px] text-slate-500 mt-1">Lifetime opt-ins</p>
        </div>
        <div className="bg-[#0B1D36] p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="text-xs font-medium text-slate-400">Active Verified Audience</div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{stats.active}</div>
          <p className="text-[11px] text-slate-500 mt-1">Eligible for email dispatches</p>
        </div>
        <div className="bg-[#0B1D36] p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="text-xs font-medium text-slate-400">Unsubscribed / Opted-Out</div>
          <div className="text-2xl font-bold text-slate-400 mt-2">{stats.unsubscribed}</div>
          <p className="text-[11px] text-slate-500 mt-1">GDPR &amp; CAN-SPAM honored</p>
        </div>
      </div>

      {/* Two Column Layout: Broadcast Composer & Subscribers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Broadcast Composer */}
        <div className="bg-[#0B1D36] p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Compose Educational Campaign</h2>
          </div>

          <form onSubmit={handleBroadcast} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Subject Line</label>
              <input
                type="text"
                required
                value={campaign.subject}
                onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Preview Preheader Snippet
              </label>
              <input
                type="text"
                value={campaign.previewText}
                onChange={(e) => setCampaign({ ...campaign, previewText: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Message Body (Markdown / Plain Text)
              </label>
              <textarea
                rows="6"
                required
                value={campaign.contentMarkdown}
                onChange={(e) => setCampaign({ ...campaign, contentMarkdown: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Will be delivered to {stats.active} active subscribers
              </span>
              <button
                type="submit"
                disabled={broadcasting || stats.active === 0}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {broadcasting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Broadcasting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Campaign</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Subscriber Registry */}
        <div className="bg-[#0B1D36] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-white">Subscriber Registry</h2>
            </div>
            <span className="text-xs text-slate-400">{subscribers.length} total</span>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto max-h-[380px] divide-y divide-slate-800/60">
            {loading ? (
              <div className="py-12 text-center text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                <span className="text-xs">Loading subscribers...</span>
              </div>
            ) : subscribers.length === 0 ? (
              <p className="text-xs text-slate-500 py-10 text-center">No subscribers yet.</p>
            ) : (
              subscribers.map((sub) => (
                <div key={sub.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-200">{sub.email}</div>
                    <div className="text-[10px] text-slate-500">
                      Via {sub.source} &bull; {new Date(sub.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      sub.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {sub.status}
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
