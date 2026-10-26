'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthShell from '../../components/AuthShell';
import CaptchaWidget from '../../components/CaptchaWidget';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirectTarget, setRedirectTarget] = useState('');
  const router = useRouter();

  // Keep the post-login destination when students switch to registration.
  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get('redirect') || '';
    if (target.startsWith('/') && !target.startsWith('//')) setRedirectTarget(target);
  }, []);

  const registerHref = redirectTarget
    ? `/register?redirect=${encodeURIComponent(redirectTarget)}`
    : '/register';

  const getSafeRedirect = () => {
    if (typeof window === 'undefined') return '/dashboard';
    const target = new URLSearchParams(window.location.search).get('redirect');
    if (target && target.startsWith('/') && !target.startsWith('//')) return target;
    return '/dashboard';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(getSafeRedirect());
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Network connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Pick up where you left off."
      subtitle="Log in to open the notes you own, your reading list and every order receipt."
      footer={
        <>
          New to HritikPedia?{' '}
          <Link href={registerHref} className="font-bold text-primary hover:underline">
            Create a free account
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

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="field-label">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="login-email"
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
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label htmlFor="login-password" className="field-label mb-0">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="input-field pl-10"
            />
          </div>
        </div>

        <CaptchaWidget
          action="login"
          onVerify={(tok) => setCaptchaToken(tok)}
          onExpire={() => setCaptchaToken('')}
        />

        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-4 flex items-start gap-2 border-t border-dashed border-line pt-3">
        <Lock className="mt-0.5 h-3 w-3 shrink-0 text-muted" />
        <p className="text-[10px] leading-relaxed text-muted">
          Sessions are secured with HTTP-only cookies. We never store your password in the
          browser.
        </p>
      </div>
    </AuthShell>
  );
}
