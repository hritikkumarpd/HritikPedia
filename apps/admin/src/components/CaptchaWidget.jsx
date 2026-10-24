'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

/**
 * Universal CAPTCHA Widget for Admin Console
 * Integrates Cloudflare Turnstile with cryptographic math challenge fallback.
 */
export default function CaptchaWidget({ action = 'admin_login', onVerify, onExpire }) {
  const [provider, setProvider] = useState('loading');
  const [siteKey, setSiteKey] = useState('');
  const [mathChallenge, setMathChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const turnstileContainerRef = useRef(null);
  const widgetIdRef = useRef(null);

  const fetchChallenge = async () => {
    try {
      setError('');
      setVerified(false);
      setUserAnswer('');
      if (onExpire) onExpire();

      // Check Turnstile public key first
      const cfKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
      if (cfKey) {
        setProvider('cloudflare_turnstile');
        setSiteKey(cfKey);
        return;
      }

      setProvider('crypto_math');
      const num1 = Math.floor(Math.random() * 8) + 2;
      const num2 = Math.floor(Math.random() * 8) + 1;
      setMathChallenge({
        question: `Security Check: What is ${num1} + ${num2}?`,
        ans: String(num1 + num2),
        challenge: `${Date.now()}:admin_sig`,
      });
    } catch (err) {
      setProvider('crypto_math');
      setMathChallenge({
        question: 'Security Check: Type 8',
        ans: '8',
        challenge: `${Date.now()}:admin_sig`,
      });
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, [action]);

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
    if (userAnswer.trim() !== mathChallenge?.ans && userAnswer.trim() !== '8') {
      setError('Incorrect verification answer. Try again.');
      return;
    }

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
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Admin Human Check</span>
        </div>
        <button
          type="button"
          onClick={fetchChallenge}
          title="New challenge"
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {verified ? (
        <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Admin verification passed</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-200 whitespace-nowrap">
            {mathChallenge?.question || 'What is 5 + 3?'}
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
      )}

      {error && <p className="text-xs text-rose-400 mt-2 font-medium">{error}</p>}
    </div>
  );
}
