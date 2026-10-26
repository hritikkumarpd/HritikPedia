'use client';

import React, { useEffect, useState } from 'react';
import {
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  CalendarDays,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const res = await fetch('/api/student/settings', { cache: 'no-store' });
        const data = await res.json();

        if (cancelled) return;

        if (res.ok && data.user) {
          setProfile(data.user);
          setFullName(data.user.name || '');
        } else {
          setError(data.error || 'Unable to load your profile.');
        }
      } catch {
        if (!cancelled) setError('Unable to load your profile right now.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProfileMessage('');

    if (fullName.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await fetch('/api/student/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setProfile((prev) => ({ ...prev, name: fullName.trim() }));
        setProfileMessage('Profile details updated successfully.');
      } else {
        setError(data.error || 'Could not save your profile.');
      }
    } catch {
      setError('Network error while saving your profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch('/api/student/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setPasswordMessage('Your security password has been changed.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Could not change your password.');
      }
    } catch {
      setError('Network error while changing your password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="card flex items-center justify-center gap-3 p-12 text-xs font-bold text-slate-500 border border-slate-200 dark:border-slate-800">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span>Loading your profile details...</span>
      </div>
    );
  }

  const initial = (profile?.name || fullName || 'S').trim().charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header Profile Bubble */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="relative flex items-center gap-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 font-display text-2xl font-black text-white shadow-md">
            {initial}
          </span>
          <div className="min-w-0">
            <span className="badge badge-primary">Account Overview</span>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
              {profile?.name || 'Student Profile'}
            </h1>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-500">{profile?.email || 'Student Account'}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-4 text-xs font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {profileMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{profileMessage}</span>
        </div>
      )}

      {/* Personal Information Card */}
      <form onSubmit={handleProfileSubmit} className="card border border-slate-200 dark:border-slate-800 p-0 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-6 py-4">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <User className="h-4 w-4 text-primary" />
            Personal Details
          </span>
          <span className="text-[10px] font-bold text-slate-400">
            Section 01
          </span>
        </div>

        <div className="space-y-5 p-6 sm:p-7">
          <div>
            <label htmlFor="fullName" className="field-label">
              Student Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field"
              placeholder="Your full name"
              minLength={2}
              maxLength={150}
              required
            />
          </div>

          <div>
            <label htmlFor="profileEmail" className="field-label">
              Primary Account Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="profileEmail"
                type="email"
                value={profile?.email || ''}
                readOnly
                className="input-field cursor-not-allowed bg-slate-100 dark:bg-slate-800/60 pl-10 text-slate-500"
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              Email changes are restricted to ensure watermark security and license validation.
            </p>
          </div>

          {profile?.created_at && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-3.5 py-2.5 text-xs font-medium text-slate-500">
              <CalendarDays className="h-4 w-4 text-primary" />
              Registered since{' '}
              {new Date(profile.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          )}

          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
            <button type="submit" disabled={savingProfile} className="btn btn-primary">
              {savingProfile ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                'Save Profile Changes'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Password & Security Card */}
      <form onSubmit={handlePasswordSubmit} className="card border border-slate-200 dark:border-slate-800 p-0 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-6 py-4">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Lock className="h-4 w-4 text-primary" />
            Password &amp; Security
          </span>
          <span className="text-[10px] font-bold text-slate-400">
            Section 02
          </span>
        </div>

        <div className="space-y-5 p-6 sm:p-7">
          {passwordMessage && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{passwordMessage}</span>
            </div>
          )}

          <div>
            <label htmlFor="currentPassword" className="field-label">
              Current Password
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="input-field pl-10"
                placeholder="Enter current password"
              />
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="field-label">
              New Password <span className="text-slate-400 font-normal">(minimum 8 characters)</span>
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="input-field pl-10"
                placeholder="Create strong new password"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="field-label">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="input-field pl-10"
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-3.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Choosing a new password will protect your account and ensure only authorized sessions remain active on your account.
            </p>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
            <button type="submit" disabled={savingPassword} className="btn btn-secondary">
              {savingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
