'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';

/**
 * Admin CAPTCHA Widget
 *
 * Challenges are issued and signed by /api/admin/auth/captcha and verified
 * server-side. The old widget generated its answer in the browser, which the
 * server could never validate — that made admin sign-in impossible without
 * Cloudflare Turnstile.
 */
export default function CaptchaWidget({
  action = 'admin_login',
  challengeEndpoint = '/api/admin/auth/captcha',
  onVerify,
  onExpire,
}) {
  const [provider, setProvider] = useState('loading');
  const [siteKey, setSiteKey] = useState('');
  const [mathChallenge, setMathChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const turnstileContainerRef = useRef(null);
  const widgetIdRef = useRef(null);

  const fetchChallenge = async () => {
    setError('');
    setVerified(false);
    setUserAnswer('');
    setMathChallenge(null);
    setProvider('loading');
    if (onExpire) onExpire();

    try {
      const res = await fetch(
        `${challengeEndpoint}?action=${encodeURIComponent(action)}`,
        { cache: 'no-store' }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unable to load verification challenge.');
      }

      if (data.provider === 'cloudflare_turnstile' && data.siteKey) {
        setProvider('cloudflare_turnstile');
        setSiteKey(data.siteKey);
        return;
      }

      if (!data.question || !data.challenge) {
        throw new Error('Unable to load verification challenge.');
      }

      setProvider('crypto_math');
      setMathChallenge(data);
    } catch (err) {
      console.warn('Admin captcha challenge fetch failed:', err);
      setProvider('crypto_math');
      setMathChallenge(null);
      setError('Could not load human verification. Please retry.');
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, [action, challengeEndpoint]);

  // Handle Cloudflare Turnstile initialization
  useEffect(() => {
    if (provider !== 'cloudflare_turnstile' || !siteKey || !turnstileContainerRef.current) {
      return;
    }

    let isMounted = true;

    const renderTurnstile = () => {
      if (!window.turnstile || !turnstileContainerRef.current) return;

      try {
        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
        }

        widgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: siteKey,
          action,
          theme: 'dark',
          callback: (token) => {
            if (isMounted) {
              setVerified(true);
              setError('');
              if (onVerify) onVerify(token);
            }
          },
          'expired-callback': () => {
            if (isMounted) {
              setVerified(false);
              if (onExpire) onExpire();
            }
          },
          'error-callback': () => {
            if (isMounted) {
              setError('Security verification failed. Please try again.');
              setVerified(false);
            }
          },
        });
      } catch (e) {
        console.error('Turnstile render error:', e);
      }
    };

    if (window.turnstile) {
      renderTurnstile();
    } else {
      const scriptId = 'cloudflare-turnstile-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (isMounted) renderTurnstile();
        };
        document.head.appendChild(script);
      } else {
        const interval = setInterval(() => {
          if (window.turnstile) {
            clearInterval(interval);
            if (isMounted) renderTurnstile();
          }
        }, 100);
      }
    }

    return () => {
      isMounted = false;
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
    };
  }, [provider, siteKey, action]);

  const handleMathSubmit = (e) => {
    e.preventDefault();
    if (!mathChallenge?.challenge) {
      setError('Verification challenge is not ready. Please retry.');
      return;
    }
    if (!userAnswer.trim()) {
      setError('Please answer the question to proceed.');
      return;
    }

    // answer:timestamp:signature — verified server-side
    const token = `${userAnswer.trim()}:${mathChallenge.challenge}`;
    setVerified(true);
    setError('');
    if (onVerify) onVerify(token);
  };

  if (provider === 'cloudflare_turnstile') {
    return (
      <div className="my-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center">
        <div ref={turnstileContainerRef} id="cf-turnstile-box-admin" className="min-h-[65px] flex items-center justify-center" />
        {error && <p className="text-xs text-rose-400 mt-2 font-medium">{error}</p>}
      </div>
    );
  }

  return (
    <div className="my-3 p-3.5 rounded-xl bg-gradient-to-r from-slate-900/90 to-slate-950 border border-slate-800 text-slate-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Admin Human Verification</span>
        </div>
        <button
          type="button"
          onClick={fetchChallenge}
          title="New challenge"
          className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {provider === 'loading' ? (
        <div className="flex items-center gap-2 py-1.5 text-xs text-slate-400">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Loading verification challenge...</span>
        </div>
      ) : verified ? (
        <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Admin verification complete</span>
        </div>
      ) : mathChallenge ? (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-200 whitespace-nowrap">
            {mathChallenge.question}
          </span>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleMathSubmit(e);
              }
            }}
            placeholder="Answer"
            className="w-20 px-2.5 py-1 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-center"
          />
          <button
            type="button"
            onClick={handleMathSubmit}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Verify
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={fetchChallenge}
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 cursor-pointer"
        >
          Retry verification
        </button>
      )}

      {error && <p className="text-xs text-rose-400 mt-2 font-medium">{error}</p>}
    </div>
  );
}
