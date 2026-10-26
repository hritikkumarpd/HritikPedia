'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthShell from '../../components/AuthShell';
import CaptchaWidget from '../../components/CaptchaWidget';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, captchaToken }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit request');
      }
    } catch {
      setError('Network connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Account recovery"
      title={submitted ? 'Check your inbox.' : 'Forgot your password?'}
      subtitle={
        submitted
          ? 'If the address matches an account, recovery instructions are on their way.'
          : 'Enter the email you registered with and we will send a secure reset link.'
      }
      footer={
        <Link href="/login" className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      }
    >
      {submitted ? (
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Recovery Instructions Dispatched
          </h3>
          <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            If an account is registered with{' '}
            <strong className="font-bold text-slate-900 dark:text-white">{email}</strong>, you will receive password reset instructions. The link expires shortly.
          </p>
          <Link href="/login" className="btn btn-primary btn-sm mt-6 inline-flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to Sign In
          </Link>
          <p className="mt-4 text-xs text-slate-400">
            Didn&apos;t receive it? Check spam folder or{' '}
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="font-bold text-primary underline underline-offset-2"
            >
              try another email
            </button>
            .
          </p>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-3 text-xs font-semibold text-red-600 dark:text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="forgot-email" className="field-label">
                Registered email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  autoComplete="email"
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>

            <CaptchaWidget
              action="forgot_password"
              onVerify={(tok) => setCaptchaToken(tok)}
              onExpire={() => setCaptchaToken('')}
            />

            <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending instructions…
                </>
              ) : (
                <>
                  Send reset instructions
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 flex items-start gap-2 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-3">
            <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <p className="text-xs leading-relaxed text-slate-500">
              Reset links are single-use and time-limited. For security, we never publicly disclose whether an email is registered.
            </p>
          </div>
        </>
      )}
    </AuthShell>
  );
}
