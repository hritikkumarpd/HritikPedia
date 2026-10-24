'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function NewsletterForm({ className = '' }) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    if (!consent) {
      setStatus('error');
      setMessage('Please check the consent box to receive study updates');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent: true, source: 'homepage' }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Thank you for subscribing! Check your inbox for confirmation.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Subscription failed. Please try again later.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className={`w-full max-w-xl mx-auto ${className}`}>
      {status === 'success' ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your student email (e.g. name@college.edu)"
                className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#087BFF] focus:border-[#087BFF] text-[#26354B] transition-all"
                disabled={status === 'loading'}
                required
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 text-sm font-bold text-white bg-[#087BFF] hover:bg-[#1688FF] rounded-xl transition-colors shrink-0 shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>Subscribe Free</span>
              )}
            </button>
          </div>

          <div className="flex items-start gap-2 pt-1 text-left">
            <input
              id="newsletter-consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#087BFF] focus:ring-[#087BFF]"
              required
            />
            <label htmlFor="newsletter-consent" className="text-xs text-slate-500 leading-snug">
              I consent to receive occasional academic updates, newly published notes, and revision guides. You can unsubscribe at any time with one click.
            </label>
          </div>

          {status === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs text-left">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{message}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
