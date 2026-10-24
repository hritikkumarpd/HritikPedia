'use client';

import { useState, useEffect } from 'react';
import {
  Sliders,
  Shield,
  Download,
  Printer,
  Smartphone,
  Eye,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Lock,
  Save,
  X,
} from 'lucide-react';

export default function AdminPdfPoliciesPage() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState(null);

  // Dynamic preview controls
  const [previewEmail, setPreviewEmail] = useState('student@example.com');
  const [previewOpacity, setPreviewOpacity] = useState(0.18);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/pdf-policies');
      if (!res.ok) throw new Error('Failed to load PDF access policies');
      const data = await res.json();
      setPolicies(data.policies || []);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleUpdatePolicy = async (policy) => {
    setUpdatingId(policy.note_id);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/pdf-policies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteId: policy.note_id,
          allowDownload: policy.allow_download,
          allowPrint: policy.allow_print,
          watermarkRequired: policy.watermark_required,
          maxDevices: policy.max_devices,
          revoked: policy.revoked,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update policy');

      setMessage({ type: 'success', text: `Policy for "${policy.title}" saved successfully!` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLocalChange = (noteId, field, value) => {
    setPolicies((prev) =>
      prev.map((p) => (p.note_id === noteId ? { ...p, [field]: value } : p))
    );
  };

  const maskedEmailPreview = previewEmail
    ? previewEmail.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => `${a}***${c}`)
    : 'st***@example.com';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          PDF Protection &amp; Dynamic Watermark Policies
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure server-side dynamic watermarking, zero-download enforcement, and forensic trace headers
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

      {/* Live Watermark Simulator */}
      <div className="bg-[#0B1D36] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>In-Browser Dynamic Watermark Simulator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Every rendered page overlays authenticated learner identity across diagonal coordinates
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Opacity:</span>
              <input
                type="range"
                min="0.08"
                max="0.4"
                step="0.02"
                value={previewOpacity}
                onChange={(e) => setPreviewOpacity(parseFloat(e.target.value))}
                className="w-24 accent-blue-500"
              />
              <span className="text-slate-300 font-mono w-8">
                {Math.round(previewOpacity * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Visual Simulated Page */}
        <div className="mt-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl h-64 bg-slate-900 border border-slate-700/80 rounded-xl relative overflow-hidden shadow-2xl flex flex-col justify-between p-6">
            {/* Background Sample Content */}
            <div className="space-y-3 opacity-30 select-none pointer-events-none">
              <div className="h-4 bg-slate-400 rounded w-3/4"></div>
              <div className="h-3 bg-slate-500 rounded w-full"></div>
              <div className="h-3 bg-slate-500 rounded w-5/6"></div>
              <div className="h-3 bg-slate-500 rounded w-4/6"></div>
              <div className="h-3 bg-slate-500 rounded w-full"></div>
              <div className="h-3 bg-slate-500 rounded w-2/3"></div>
            </div>

            {/* Diagonal SVG Watermark Overlay */}
            <div
              className="absolute inset-0 pointer-events-none select-none flex items-center justify-center"
              style={{ opacity: previewOpacity }}
            >
              <div className="rotate-[-28deg] text-center space-y-1">
                <p className="font-extrabold text-white text-lg tracking-widest font-mono uppercase">
                  HRITIKPEDIA &bull; {maskedEmailPreview}
                </p>
                <p className="text-[11px] font-mono text-slate-300 font-bold tracking-wider">
                  UID: 1042 &bull; IP: 203.0.113.88 &bull; UTC: {new Date().toISOString().slice(0, 19)}
                </p>
                <p className="text-[9px] font-mono text-amber-300 uppercase tracking-widest">
                  PROPRIETARY &bull; UNAUTHORIZED REDISTRIBUTION IS ILLEGAL
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-3 select-none">
              <span>Hritikpedia Notes Viewer &bull; Page 1 of 24</span>
              <span>Protected by Dynamic Watermark Engine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Note Policy Configuration Table */}
      <div className="bg-[#0B1D36] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-white">Access &amp; Download Enforcement by Note</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Overrides default zero-download security on a per-resource basis
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Note Title</th>
                <th className="px-5 py-3.5">Watermark Required</th>
                <th className="px-5 py-3.5">Allow Download</th>
                <th className="px-5 py-3.5">Allow Print</th>
                <th className="px-5 py-3.5">Max Concurrent Devices</th>
                <th className="px-5 py-3.5">Emergency Revoke</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                    <span>Loading security policies...</span>
                  </td>
                </tr>
              ) : (
                policies.map((p) => (
                  <tr key={p.note_id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 font-semibold text-white">
                      <div>{p.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {p.note_id}</div>
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={p.watermark_required}
                        onChange={(e) =>
                          handleLocalChange(p.note_id, 'watermark_required', e.target.checked)
                        }
                        className="w-4 h-4 rounded text-blue-600 accent-blue-600 bg-slate-900 border-slate-700"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={p.allow_download}
                        onChange={(e) =>
                          handleLocalChange(p.note_id, 'allow_download', e.target.checked)
                        }
                        className="w-4 h-4 rounded text-blue-600 accent-blue-600 bg-slate-900 border-slate-700"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={p.allow_print}
                        onChange={(e) =>
                          handleLocalChange(p.note_id, 'allow_print', e.target.checked)
                        }
                        className="w-4 h-4 rounded text-blue-600 accent-blue-600 bg-slate-900 border-slate-700"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={p.max_devices || 3}
                        onChange={(e) =>
                          handleLocalChange(p.note_id, 'max_devices', parseInt(e.target.value, 10))
                        }
                        className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs text-center"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={p.revoked}
                        onChange={(e) =>
                          handleLocalChange(p.note_id, 'revoked', e.target.checked)
                        }
                        className="w-4 h-4 rounded text-red-600 accent-red-600 bg-slate-900 border-slate-700"
                      />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleUpdatePolicy(p)}
                        disabled={updatingId === p.note_id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition-colors disabled:opacity-50"
                      >
                        {updatingId === p.note_id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        <span>Save</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
