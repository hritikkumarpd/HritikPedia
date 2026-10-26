'use client';

import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  Loader2,
  Terminal,
  Activity,
  Code,
  X,
} from 'lucide-react';

export default function AdminSecurityPage() {
  const [securityEvents, setSecurityEvents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('threats'); // 'threats' or 'audit'
  const [search, setSearch] = useState('');
  const [activeInspector, setActiveInspector] = useState(null);
  const [error, setError] = useState(null);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/security');
      if (!res.ok) throw new Error('Failed to load security telemetry');
      const data = await res.json();
      setSecurityEvents(data.securityEvents || []);
      setAuditLogs(data.auditLogs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const getThreatSeverity = (eventType) => {
    if (eventType.includes('signature_failed') || eventType.includes('tampering')) {
      return { label: 'CRITICAL', color: 'bg-brick-soft text-brick border-brick/30' };
    }
    if (eventType.includes('denied_pdf') || eventType.includes('login_failed')) {
      return { label: 'HIGH', color: 'bg-sun-soft text-sun-dark border-sun-dark/30' };
    }
    if (eventType.includes('rate_limit')) {
      return { label: 'MEDIUM', color: 'bg-sun-soft text-sun-dark border-sun-dark/30' };
    }
    return { label: 'INFO', color: 'bg-royal-soft text-royal border-royal/25' };
  };

  const filteredThreats = securityEvents.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.event_type.toLowerCase().includes(q) ||
      e.ip_address.toLowerCase().includes(q) ||
      (e.user_email && e.user_email.toLowerCase().includes(q))
    );
  });

  const filteredAudit = auditLogs.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.action.toLowerCase().includes(q) ||
      (a.actor_email && a.actor_email.toLowerCase().includes(q)) ||
      a.entity_type.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            Security Operations Center (SOC) &amp; Audit Logs
          </h1>
          <p className="text-xs text-muted mt-1">
            Real-time intrusion detection, HMAC tampering alerts, and immutable administrative mutation logs
          </p>
        </div>

        <button
          onClick={fetchSecurityData}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-paper-2 hover:bg-paper-3 text-ink-soft text-xs font-semibold rounded-xl border border-line-strong transition-colors self-start sm:self-auto"
        >
          <Activity className="w-3.5 h-3.5 text-mint" />
          <span>Refresh Live Feed</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-brick-soft border border-brick/30 text-brick text-xs">
          {error}
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream p-3 rounded-2xl border border-line">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('threats')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              tab === 'threats'
                ? 'bg-royal text-cream shadow-md shadow-none'
                : 'text-muted hover:text-ink hover:bg-paper-2'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Threat Telemetry ({securityEvents.length})</span>
          </button>

          <button
            onClick={() => setTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              tab === 'audit'
                ? 'bg-royal text-cream shadow-md shadow-none'
                : 'text-muted hover:text-ink hover:bg-paper-2'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Staff Mutation Trail ({auditLogs.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter records..."
            className="w-full pl-9 pr-4 py-1.5 bg-paper-2 border border-line-strong rounded-xl text-ink text-xs focus:outline-none focus:border-royal"
          />
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-cream rounded-2xl border border-line shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          {tab === 'threats' ? (
            <table className="w-full text-left text-xs text-ink-soft">
              <thead className="bg-paper-2 text-[11px] font-semibold text-muted uppercase tracking-wider border-b border-line">
                <tr>
                  <th className="px-5 py-3.5">Severity</th>
                  <th className="px-5 py-3.5">Event Signature</th>
                  <th className="px-5 py-3.5">Client IP</th>
                  <th className="px-5 py-3.5">User Identity</th>
                  <th className="px-5 py-3.5">Recorded At</th>
                  <th className="px-5 py-3.5 text-right">Telemetry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center text-muted">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-royal" />
                      <span>Reading threat stream...</span>
                    </td>
                  </tr>
                ) : filteredThreats.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-10 text-center text-muted">
                      Zero threat events matching query. Perimeter is secure.
                    </td>
                  </tr>
                ) : (
                  filteredThreats.map((evt) => {
                    const sev = getThreatSeverity(evt.event_type);
                    return (
                      <tr key={evt.id} className="hover:bg-paper-2/30 transition-colors">
                        <td className="px-5 py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sev.color}`}
                          >
                            {sev.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono font-semibold text-ink">
                          {evt.event_type}
                        </td>
                        <td className="px-5 py-4 font-mono text-muted text-[11px]">
                          {evt.ip_address}
                        </td>
                        <td className="px-5 py-4 text-ink-soft">
                          {evt.user_email || 'Anonymous / Unauth'}
                        </td>
                        <td className="px-5 py-4 text-muted text-[11px]">
                          {new Date(evt.created_at).toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() =>
                              setActiveInspector({
                                title: `Threat Event #${evt.id}: ${evt.event_type}`,
                                data: evt,
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-paper-2 hover:bg-paper-3 text-royal hover:text-ink text-xs transition-colors"
                          >
                            <Terminal className="w-3.5 h-3.5" />
                            <span>Payload</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs text-ink-soft">
              <thead className="bg-paper-2 text-[11px] font-semibold text-muted uppercase tracking-wider border-b border-line">
                <tr>
                  <th className="px-5 py-3.5">Staff Actor</th>
                  <th className="px-5 py-3.5">Action Code</th>
                  <th className="px-5 py-3.5">Entity Target</th>
                  <th className="px-5 py-3.5">Recorded At</th>
                  <th className="px-5 py-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center text-muted">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-royal" />
                      <span>Reading audit trail...</span>
                    </td>
                  </tr>
                ) : filteredAudit.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-10 text-center text-muted">
                      No administrative mutation logs found.
                    </td>
                  </tr>
                ) : (
                  filteredAudit.map((log) => (
                    <tr key={log.id} className="hover:bg-paper-2/30 transition-colors">
                      <td className="px-5 py-4 font-semibold text-ink">
                        {log.actor_email}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-royal font-semibold">{log.action}</span>
                      </td>
                      <td className="px-5 py-4 text-ink-soft">
                        {log.entity_type} #{log.entity_id || ''}
                      </td>
                      <td className="px-5 py-4 text-muted text-[11px]">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() =>
                            setActiveInspector({
                              title: `Staff Audit Log #${log.id}: ${log.action}`,
                              data: log,
                            })
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-paper-2 hover:bg-paper-3 text-royal hover:text-ink text-xs transition-colors"
                        >
                          <Code className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* JSON Inspector Modal */}
      {activeInspector && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream border border-line rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Terminal className="w-4 h-4 text-royal" />
                <span>{activeInspector.title}</span>
              </h3>
              <button
                onClick={() => setActiveInspector(null)}
                className="text-muted hover:text-ink p-1 rounded-lg hover:bg-paper-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 bg-paper-2 p-4 rounded-xl border border-line overflow-x-auto max-h-80">
              <pre className="text-xs font-mono text-mint whitespace-pre-wrap">
                {JSON.stringify(activeInspector.data, null, 2)}
              </pre>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setActiveInspector(null)}
                className="px-4 py-1.5 bg-paper-2 hover:bg-paper-3 text-ink rounded-xl text-xs font-medium"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
