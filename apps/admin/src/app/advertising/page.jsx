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
        <h1 className="text-2xl font-bold text-ink tracking-tight">
          Advertising Placements &amp; Direct Sponsors
        </h1>
        <p className="text-xs text-muted mt-1">
          Manage Google AdSense responsive slots and direct corporate sponsor campaigns with zero content disruption
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
          <button onClick={() => setMessage(null)} className="text-muted hover:text-ink">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-muted">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-royal" />
          <span className="text-xs">Loading advertisement slots...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {placements.map((slot) => (
            <div
              key={slot.slot_id}
              className="bg-cream p-6 rounded-2xl border border-line shadow-xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-royal uppercase tracking-wider bg-royal-soft border border-line px-2 py-0.5 rounded">
                      {slot.slot_id}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        slot.active
                          ? 'bg-mint-soft text-mint border border-mint/25'
                          : 'bg-paper-2 text-muted'
                      }`}
                    >
                      {slot.active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-ink mt-1">{slot.name}</h3>
                  <p className="text-xs text-muted">{slot.description}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={slot.active}
                    onChange={(e) => handleLocalChange(slot.slot_id, 'active', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-paper-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-cream after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-cream after:border-line-strong after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-royal"></div>
                </label>
              </div>

              {/* Telemetry Stats */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-paper-2 rounded-xl border border-line text-xs">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted" />
                  <div>
                    <div className="text-[10px] text-muted uppercase">Impressions</div>
                    <div className="font-semibold text-ink">
                      {parseInt(slot.impression_count || '0', 10).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MousePointer className="w-4 h-4 text-muted" />
                  <div>
                    <div className="text-[10px] text-muted uppercase">Clicks</div>
                    <div className="font-semibold text-ink">
                      {parseInt(slot.click_count || '0', 10).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Slot Settings */}
              <div className="space-y-3 pt-2 border-t border-line">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Provider Type</label>
                    <select
                      value={slot.ad_type}
                      onChange={(e) => handleLocalChange(slot.slot_id, 'ad_type', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-paper-2 border border-line-strong rounded-lg text-ink text-xs"
                    >
                      <option value="sponsor">Direct Educational Sponsor</option>
                      <option value="adsense">Google AdSense</option>
                      <option value="affiliate">Affiliate Partner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink-soft mb-1">Sponsor Org Name</label>
                    <input
                      type="text"
                      value={slot.sponsor_name || ''}
                      onChange={(e) =>
                        handleLocalChange(slot.slot_id, 'sponsor_name', e.target.value)
                      }
                      placeholder="e.g. Hostinger / GitHub Education"
                      className="w-full px-2.5 py-1.5 bg-paper-2 border border-line-strong rounded-lg text-ink text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-soft mb-1">Headline Title</label>
                  <input
                    type="text"
                    value={slot.title || ''}
                    onChange={(e) => handleLocalChange(slot.slot_id, 'title', e.target.value)}
                    placeholder="e.g. Free Cloud Hosting for Engineering Students"
                    className="w-full px-2.5 py-1.5 bg-paper-2 border border-line-strong rounded-lg text-ink text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-soft mb-1">Target Link (HTTPS)</label>
                  <input
                    type="url"
                    value={slot.link || ''}
                    onChange={(e) => handleLocalChange(slot.slot_id, 'link', e.target.value)}
                    placeholder="https://example.com/student-offer"
                    className="w-full px-2.5 py-1.5 bg-paper-2 border border-line-strong rounded-lg text-ink text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink-soft mb-1">Banner Description</label>
                  <textarea
                    rows="2"
                    value={slot.banner_text || ''}
                    onChange={(e) => handleLocalChange(slot.slot_id, 'banner_text', e.target.value)}
                    placeholder="Short promotional copy displayed inside the banner..."
                    className="w-full px-2.5 py-1.5 bg-paper-2 border border-line-strong rounded-lg text-ink text-xs"
                  ></textarea>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleSave(slot)}
                  disabled={updatingSlot === slot.slot_id}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-royal hover:bg-royal-dark text-cream rounded-lg text-xs font-semibold shadow transition-colors disabled:opacity-50"
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
