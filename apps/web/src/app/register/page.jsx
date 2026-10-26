'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthShell from '../../components/AuthShell';
import CaptchaWidget from '../../components/CaptchaWidget';
import { User, Mail, Lock, ArrowRight, AlertCircle, Loader2, Check } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirectTarget, setRedirectTarget] = useState('');
  const router = useRouter();

  // Keep the post-registration destination when students switch to sign-in.
  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get('redirect') || '';
    if (target.startsWith('/') && !target.startsWith('//')) setRedirectTarget(target);
  }, []);

  const loginHref = redirectTarget
    ? `/login?redirect=${encodeURIComponent(redirectTarget)}`
    : '/login';

  const getSafeRedirect = () => {
    if (typeof window === 'undefined') return '/dashboard';
    const target = new URLSearchParams(window.location.search).get('redirect');
    if (target && target.startsWith('/') && !target.startsWith('//')) return target;
    return '/dashboard';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, captchaToken }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(getSafeRedirect());
        router.refresh();
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Create your account"
      title="Your own study desk, in two minutes."
      subtitle="Save your notes, keep your receipts and read on any device. Creating an account is free."
      footer={
        <>
          Already registered?{' '}
          <Link href={loginHref} className="font-bold text-primary hover:underline">
            Sign in instead
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-3 text-xs font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="register-name" className="field-label">
            Full name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              required
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-email" className="field-label">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="register-email"
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

        <div>
          <label htmlFor="register-password" className="field-label">
            Password <span className="normal-case tracking-normal text-slate-400 font-normal">(min. 8 characters)</span>
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              autoComplete="new-password"
              minLength={8}
              required
              className="input-field pl-10"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-3">
          <span
            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
              agreeTerms ? 'border-primary bg-primary text-white' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
            }`}
          >
            {agreeTerms && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
          </span>
          <input
            id="agree-terms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="sr-only"
            required
          />
          <span className="text-xs leading-relaxed text-slate-500">
            I agree to the{' '}
            <Link href="/terms" className="font-semibold text-primary hover:underline" target="_blank">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy-policy"
              className="font-semibold text-primary hover:underline"
              target="_blank"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <CaptchaWidget
          action="register"
          onVerify={(tok) => setCaptchaToken(tok)}
          onExpire={() => setCaptchaToken('')}
        />

        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating your account…
            </>
          ) : (
            <>
              Create free account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
