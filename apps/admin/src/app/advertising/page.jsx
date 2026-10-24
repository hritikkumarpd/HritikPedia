'use client';

import { useState, useEffect } from 'react';
import {
  Megaphone,
  CheckCircle,
  AlertCircle,
  Save,
  Loader2,
  ExternalLink,
  Eye,
  MousePointer,
  X,
} from 'lucide-react';

export default function AdminAdvertisingPage() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingSlot, setUpdatingSlot] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/advertising');
      if (!res.ok) throw new Error('Failed to load ad placements');
      const data = await res.json();
      setPlacements(data.placements || []);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const handleLocalChange = (slotId, field, value) => {
    setPlacements((prev) =>
      prev.map((p) => (p.slot_id === slotId ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = async (slot) => {
    setUpdatingSlot(slot.slot_id);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/advertising', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: slot.slot_id,
          active: slot.active,
          adType: slot.ad_type,
          title: slot.title,
          sponsorName: slot.sponsor_name,
          link: slot.link,
          bannerText: slot.banner_text,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update ad placement');

      setMessage({ type: 'success', text: `Ad slot "${slot.name}" successfully updated!` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUpdatingSlot(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Advertising Placements &amp; Direct Sponsors
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage Google AdSense responsive slots and direct corporate sponsor campaigns with zero content disruption
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

      {loading ? (
        <div className="p-12 text-center text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
          <span className="text-xs">Loading advertisement slots...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {placements.map((slot) => (
            <div
              key={slot.slot_id}
              className="bg-[#0B1D36] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider bg-blue-950/60 border border-blue-900/60 px-2 py-0.5 rounded">
                      {slot.slot_id}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        slot.active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {slot.active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{slot.name}</h3>
                  <p className="text-xs text-slate-400">{slot.description}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={slot.active}
                    onChange={(e) => handleLocalChange(slot.slot_id, 'active', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Telemetry Stats */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Impressions</div>
                    <div className="font-semibold text-white">
                      {parseInt(slot.impression_count || '0', 10).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MousePointer className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Clicks</div>
                    <div className="font-semibold text-white">
                      {parseInt(slot.click_count || '0', 10).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Slot Settings */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Provider Type</label>
                    <select
                      value={slot.ad_type}
                      onChange={(e) => handleLocalChange(slot.slot_id, 'ad_type', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                    >
                      <option value="sponsor">Direct Educational Sponsor</option>
                      <option value="adsense">Google AdSense</option>
                      <option value="affiliate">Affiliate Partner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Sponsor Org Name</label>
                    <input
                      type="text"
                      value={slot.sponsor_name || ''}
                      onChange={(e) =>
                        handleLocalChange(slot.slot_id, 'sponsor_name', e.target.value)
                      }
                      placeholder="e.g. Hostinger / GitHub Education"
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Headline Title</label>
                  <input
                    type="text"
                    value={slot.title || ''}
                    onChange={(e) => handleLocalChange(slot.slot_id, 'title', e.target.value)}
                    placeholder="e.g. Free Cloud Hosting for Engineering Students"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Link (HTTPS)</label>
                  <input
                    type="url"
                    value={slot.link || ''}
                    onChange={(e) => handleLocalChange(slot.slot_id, 'link', e.target.value)}
                    placeholder="https://example.com/student-offer"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Banner Description</label>
                  <textarea
                    rows="2"
                    value={slot.banner_text || ''}
                    onChange={(e) => handleLocalChange(slot.slot_id, 'banner_text', e.target.value)}
                    placeholder="Short promotional copy displayed inside the banner..."
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  ></textarea>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleSave(slot)}
                  disabled={updatingSlot === slot.slot_id}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition-colors disabled:opacity-50"
                >
                  {updatingSlot === slot.slot_id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
