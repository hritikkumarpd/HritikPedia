'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BrandLogo from '../../components/BrandLogo';
import ThemeToggle from '../../components/ThemeToggle';
import CaptchaWidget from '../../components/CaptchaWidget';
import { AlertTriangle, ArrowRight, Loader2, ShieldCheck, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      const redirectTarget = new URLSearchParams(window.location.search).get('redirect');
      const safeRedirect =
        redirectTarget && redirectTarget.startsWith('/') && !redirectTarget.startsWith('//')
          ? redirectTarget
          : '/';

      router.push(safeRedirect);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
          <BrandLogo size="sm" showTagline={false} />
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Staff Portal
            </span>
            <ThemeToggle size="sm" />
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Operations Console Login
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Authorized credentials required for administrative access.
            </p>
          </div>

          <div className="admin-card p-6 sm:p-8">
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-3 text-xs font-semibold text-red-600 dark:text-red-400"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="admin-email" className="admin-label">
                  Staff Email Address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hritikpedia.com"
                  className="admin-input"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="admin-label">
                  Security Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="admin-input"
                />
              </div>

              <CaptchaWidget
                action="admin_login"
                onVerify={(tok) => setCaptchaToken(tok)}
                onExpire={() => setCaptchaToken('')}
              />

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full justify-center py-2.5 text-xs font-bold"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying Credentials…</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate Console Access</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Audited session • Client IP and timestamps recorded</span>
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 text-center">
        <p className="text-xs text-slate-500">
          HritikPedia Platform Management System • All rights reserved
        </p>
      </footer>
    </div>
  );
}
