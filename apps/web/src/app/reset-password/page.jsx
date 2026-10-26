'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AuthShell from '../../components/AuthShell';
import { Lock, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Password reset failed. Please request a new link.');
      }
    } catch {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <Link href="/login" className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline">
      <ArrowLeft className="h-3.5 w-3.5" />
      Back to sign in
    </Link>
  );

  if (success) {
    return (
      <AuthShell
        eyebrow="Account recovery"
        title="Password updated."
        subtitle="Your new password is active. Sign in to continue reading."
        footer={footer}
      >
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">You&apos;re All Set</h3>
          <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Your new password has been saved. Any prior reset sessions have been securely invalidated.
          </p>
          <Link href="/login" className="btn btn-primary btn-sm mt-6 inline-flex items-center gap-1.5">
            Sign In with New Password
          </Link>
        </div>
      </AuthShell>
    );
  }

  if (!token) {
    return (
      <AuthShell
        eyebrow="Account recovery"
        title="Incomplete Reset Link"
        subtitle="The security token is missing from this URL, so we cannot verify the request."
        footer={footer}
      >
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
            <AlertCircle className="h-7 w-7" />
          </span>
          <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">Invalid Reset Link</h3>
          <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Request a fresh link and open it directly from your email. Reset links are single-use and expire after a short time window.
          </p>
          <Link href="/forgot-password" className="btn btn-primary btn-sm mt-6 inline-flex items-center gap-1.5">
            Request New Link
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Choose a new password."
      subtitle="Pick something long and unique — at least 8 characters. You will stay signed out until you log in again."
      footer={footer}
    >
      {error && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-3 text-xs font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="new-password" className="field-label">
            New password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              minLength={8}
              required
              autoComplete="new-password"
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password" className="field-label">
            Confirm new password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              minLength={8}
              required
              autoComplete="new-password"
              className="input-field pl-10"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating password…
            </>
          ) : (
            'Update password'
          )}
        </button>
      </form>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-dashed border-line px-3 py-2.5">
        <Lock className="mt-0.5 h-3 w-3 shrink-0 text-muted" />
        <p className="text-[10px] leading-relaxed text-muted">
          Choose a password you have not used on another site. Hritikpedia never asks for it over
          email or chat.
        </p>
      </div>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-paper">
          <div className="text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-royal" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
              Checking your reset link
            </p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
