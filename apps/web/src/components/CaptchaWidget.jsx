'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';

/**
 * Universal CAPTCHA Widget
 *
 * The challenge is always issued by the server so the signed answer can be
 * verified server-side. Cloudflare Turnstile is used when both halves of the
 * key pair are configured; otherwise the API returns a signed math challenge.
 */
export default function CaptchaWidget({
  action = 'general',
  challengeEndpoint = '/api/auth/captcha',
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
      console.warn('Captcha challenge fetch failed:', err);
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
          theme: 'light',
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

  // Handle Fallback Math Submission
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

    // Compose token format: answer:timestamp:signature (verified server-side)
    const token = `${userAnswer.trim()}:${mathChallenge.challenge}`;
    setVerified(true);
    setError('');
    if (onVerify) onVerify(token);
  };

  if (provider === 'cloudflare_turnstile') {
    return (
      <div className="rounded-xl border border-line bg-paper-2/60 p-3">
        <div className="flex items-center gap-2 pb-2">
          <ShieldCheck className="h-3.5 w-3.5 text-mint" />
          <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-muted">
            Human verification
          </span>
        </div>
        <div
          ref={turnstileContainerRef}
          id="cf-turnstile-box"
          className="flex min-h-[65px] items-center justify-center"
        />
        {error && <p className="mt-2 text-[11px] font-semibold text-brick">{error}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-paper-2/60 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-mint" />
          <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-muted">
            Human verification
          </span>
        </div>
        <button
          type="button"
          onClick={fetchChallenge}
          title="New challenge"
          aria-label="New verification challenge"
          className="rounded-xl p-1 text-muted transition-colors hover:bg-paper-3 hover:text-ink"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>

      {provider === 'loading' ? (
        <div className="flex items-center gap-2 py-1.5 text-[11px] font-medium text-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-royal" />
          Loading a fresh challenge…
        </div>
      ) : verified ? (
        <div className="flex items-center gap-2 rounded-xl border border-mint/25 bg-mint-soft px-3 py-2 text-[11px] font-bold text-mint">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Verification complete
        </div>
      ) : mathChallenge ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="whitespace-nowrap font-display text-sm font-semibold text-ink">
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
            aria-label="Answer the verification question"
            className="w-20 rounded-xl border border-line-strong bg-cream px-2.5 py-1 text-center text-sm font-bold text-ink placeholder:font-medium placeholder:text-muted/60 focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/15"
          />
          <button
            type="button"
            onClick={handleMathSubmit}
            className="btn btn-dark btn-sm px-3 py-1.5 text-[10px]"
          >
            Verify
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={fetchChallenge}
          className="text-[11px] font-bold text-royal underline underline-offset-2"
        >
          Retry verification
        </button>
      )}

      {error && <p className="mt-2 text-[11px] font-semibold text-brick">{error}</p>}
    </div>
  );
}
