'use client';

import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/student/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setProfile({ name: data.user.name, email: data.user.email });
          }
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      }
    }
    loadProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/student/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Your settings have been saved successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Failed to update settings');
      }
    } catch {
      setError('Network communication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#07172B] tracking-tight">
          Account Settings &amp; Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your student profile, security credentials, and email preferences
        </p>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs">
        {/* Profile Details */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#07172B] pb-2 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-[#087BFF]" />
            <span>Profile Information</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-[#07172B] mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#087BFF] text-[#26354B]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#07172B] mb-1">Email Address</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Email is your unique learning identifier and cannot be changed directly.
            </span>
          </div>
        </div>

        {/* Change Password */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-[#07172B] pb-2 border-b border-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#087BFF]" />
            <span>Update Password (Optional)</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-[#07172B] mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Leave blank to keep unchanged"
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#087BFF] text-[#26354B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#07172B] mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#087BFF] text-[#26354B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#07172B] mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#087BFF] text-[#26354B]"
              />
            </div>
          </div>
        </div>

        {/* Marketing Preferences */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-[#07172B] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#087BFF]" />
            <span>Communication &amp; Privacy Preferences</span>
          </h2>

          <div className="flex items-start gap-2.5">
            <input
              id="pref-marketing"
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#087BFF] focus:ring-[#087BFF]"
            />
            <label htmlFor="pref-marketing" className="text-xs text-slate-600 leading-snug">
              Receive notifications when new study notes, formula cheat-sheets, or PYQ solutions are released in your enrolled subjects.
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <span>Save Settings</span>
          )}
        </button>
      </form>
    </div>
  );
}
