'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Send,
  Users,
  Loader2,
  X,
  Sparkles,
  AlertTriangle,
  MailCheck,
  MailX,
} from 'lucide-react';

const initialCampaign = {
  subject: 'New Computer Science Notes & STET Exam Analysis',
  previewText:
    'Comprehensive lecture notes on Database Systems and Operating Systems are now live.',
  contentMarkdown: `Hello Learner,

We have just published new, high-yield educational notes on Hritikpedia:

1. Database Indexing & B-Trees Complete Guide
2. Process Synchronization & Deadlocks

Visit https://hritikpedia.com/notes to access them.

Keep Learning,
Hritik Kumar`,
};

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });
  const [provider, setProvider] = useState({
    name: 'loading',
    configured: false,
    enabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [broadcasting, setBroadcasting] = useState(false);
  const [message, setMessage] = useState(null);
  const [campaign, setCampaign] = useState(initialCampaign);

  const fetchNewsletter = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/newsletter', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load newsletter subscribers');
      setSubscribers(data.subscribers || []);
      setStats(data.stats || { total: 0, active: 0, unsubscribed: 0 });
      setProvider({
        name: data.emailProvider || 'console_mock',
        configured: Boolean(data.emailConfigured),
        enabled: Boolean(data.deliveryEnabled),
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsletter();
  }, [fetchNewsletter]);

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
      await fetchNewsletter();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">
          Newsletter Audience &amp; Email Broadcasts
        </h1>
        <p className="text-xs text-muted mt-1">
          Explicit-consent subscriber management. Every campaign includes a signed unsubscribe link.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
            message.type === 'error'
              ? 'bg-brick-soft border border-brick/30 text-brick'
              : 'bg-mint-soft border border-mint/30 text-mint'
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-muted hover:text-ink ml-4"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {!loading && !provider.configured && (
        <div
          className={`p-4 rounded-xl text-xs flex items-start gap-2 border ${
            provider.enabled
              ? 'bg-sun-soft border-sun-dark/30 text-sun-dark'
              : 'bg-brick-soft border-brick/30 text-brick'
          }`}
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">
              {provider.enabled
                ? 'Email provider not configured — broadcasts are simulated'
                : 'Email provider not configured — production broadcasts are blocked'}
            </p>
            <p className="mt-1 opacity-90">
              {provider.enabled
                ? 'Set RESEND_API_KEY and EMAIL_FROM to deliver real email. In development, campaigns are logged to the server console instead of being sent.'
                : 'Set RESEND_API_KEY and EMAIL_FROM before launching. The API refuses to simulate a production campaign.'}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-cream p-5 rounded-2xl border border-line shadow-xl">
          <div className="text-xs font-medium text-muted flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Total Subscribers
          </div>
          <div className="text-2xl font-bold text-ink mt-2">{stats.total}</div>
          <p className="text-[11px] text-muted mt-1">Lifetime opt-ins</p>
        </div>
        <div className="bg-cream p-5 rounded-2xl border border-line shadow-xl">
          <div className="text-xs font-medium text-muted flex items-center gap-1.5">
            <MailCheck className="w-3.5 h-3.5" /> Active Subscribers
          </div>
          <div className="text-2xl font-bold text-mint mt-2">{stats.active}</div>
          <p className="text-[11px] text-muted mt-1">Eligible for email dispatches</p>
        </div>
        <div className="bg-cream p-5 rounded-2xl border border-line shadow-xl">
          <div className="text-xs font-medium text-muted flex items-center gap-1.5">
            <MailX className="w-3.5 h-3.5" /> Unsubscribed
          </div>
          <div className="text-2xl font-bold text-muted mt-2">{stats.unsubscribed}</div>
          <p className="text-[11px] text-muted mt-1">Opt-outs are honored immediately</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-cream p-6 rounded-2xl border border-line shadow-xl">
          <div className="flex items-center gap-2 pb-4 border-b border-line">
            <Sparkles className="w-4 h-4 text-sun-dark" />
            <h2 className="text-sm font-semibold text-ink">Compose Educational Campaign</h2>
          </div>

          <form onSubmit={handleBroadcast} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1">Subject Line</label>
              <input
                type="text"
                required
                maxLength={150}
                value={campaign.subject}
                onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                className="w-full px-3 py-2 bg-paper-2 border border-line-strong rounded-xl text-ink text-xs focus:outline-none focus:border-royal"
              />
              <p className="text-[10px] text-muted mt-1">{campaign.subject.length}/150</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1">
                Preview Preheader Snippet
              </label>
              <input
                type="text"
                maxLength={200}
                value={campaign.previewText}
                onChange={(e) => setCampaign({ ...campaign, previewText: e.target.value })}
                className="w-full px-3 py-2 bg-paper-2 border border-line-strong rounded-xl text-ink text-xs focus:outline-none focus:border-royal"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1">
                Message Body (Plain Text)
              </label>
              <textarea
                rows="8"
                required
                maxLength={20000}
                value={campaign.contentMarkdown}
                onChange={(e) => setCampaign({ ...campaign, contentMarkdown: e.target.value })}
                className="w-full px-3 py-2 bg-paper-2 border border-line-strong rounded-xl text-ink text-xs font-mono focus:outline-none focus:border-royal"
              ></textarea>
              <p className="text-[10px] text-muted mt-1">
                Line breaks are preserved. The unsubscribe link is appended automatically.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-line">
              <span className="text-[11px] text-muted">
                {provider.configured
                  ? `Will be delivered to ${stats.active} active subscribers`
                  : `Simulation only · ${stats.active} active subscribers`}
              </span>
              <button
                type="submit"
                disabled={broadcasting || stats.active === 0 || !provider.enabled}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-royal hover:bg-royal-dark text-cream rounded-xl text-xs font-semibold shadow-lg shadow-none disabled:opacity-50"
              >
                {broadcasting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
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

        <div className="bg-cream p-6 rounded-2xl border border-line shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-royal" />
              <h2 className="text-sm font-semibold text-ink">Subscriber Registry</h2>
            </div>
            <span className="text-xs text-muted">{subscribers.length} shown</span>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto max-h-[420px] divide-y divide-line">
            {loading ? (
              <div className="py-12 text-center text-muted">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-royal" />
                <span className="text-xs">Loading subscribers...</span>
              </div>
            ) : subscribers.length === 0 ? (
              <p className="text-xs text-muted py-10 text-center">No subscribers yet.</p>
            ) : (
              subscribers.map((sub) => (
                <div key={sub.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-ink-soft truncate">{sub.email}</div>
                    <div className="text-[10px] text-muted">
                      Via {sub.source} &bull; {new Date(sub.created_at).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      sub.status === 'active'
                        ? 'bg-mint-soft text-mint border border-mint/25'
                        : 'bg-paper-2 text-muted'
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
