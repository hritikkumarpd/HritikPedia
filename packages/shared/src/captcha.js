/**
 * CAPTCHA & BOT DEFENSE UTILITY
 * Supports Cloudflare Turnstile with cryptographic fallback and anti-replay protection.
 */

import crypto from 'crypto';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const CAPTCHA_SECRET = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || process.env.CAPTCHA_SECRET_KEY || '';
const CAPTCHA_ENFORCE = process.env.CAPTCHA_ENFORCE === 'true' || Boolean(CAPTCHA_SECRET);
const HMAC_SECRET = process.env.JWT_SECRET || 'hritikpedia_captcha_hmac_fallback_secret_2026';

// In-memory set of used tokens to prevent replay attacks (with timestamp pruning)
const usedTokens = new Map();

function pruneUsedTokens() {
  const now = Date.now();
  for (const [token, timestamp] of usedTokens.entries()) {
    if (now - timestamp > 10 * 60 * 1000) {
      usedTokens.delete(token);
    }
  }
}

/**
 * Verifies a CAPTCHA response token from Cloudflare Turnstile or fallback HMAC challenge.
 * @param {object} params
 * @param {string} params.token Turnstile response token or HMAC verification string
 * @param {string} params.ipAddress Client IP address
 * @param {string} [params.action] Expected action name (e.g. 'register', 'login', 'reset_password')
 * @returns {Promise<{success: boolean, error?: string, provider?: string}>}
 */
export async function verifyCaptcha({ token, ipAddress = '', action = '' }) {
  pruneUsedTokens();

  // If CAPTCHA is not enforced and no secret is configured, allow in dev/test
  if (!CAPTCHA_ENFORCE && !CAPTCHA_SECRET) {
    // If dev bypass token provided or empty in local dev, allow
    if (!token || token === 'dev_captcha_pass' || token === 'test_captcha_bypass') {
      return { success: true, provider: 'dev_bypass' };
    }
  }

  // Token is mandatory when enforcement is enabled
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return {
      success: false,
      error: 'CAPTCHA token is required. Please verify you are human.',
    };
  }

  const cleanToken = token.trim();

  // Check for Token Replay (Pattern 2 from security arsenal)
  if (usedTokens.has(cleanToken)) {
    return {
      success: false,
      error: 'CAPTCHA token has already been used. Please refresh the challenge.',
    };
  }

  // 1. Verify with Cloudflare Turnstile if secret key is present
  if (CAPTCHA_SECRET) {
    try {
      const formData = new URLSearchParams();
      formData.append('secret', CAPTCHA_SECRET);
      formData.append('response', cleanToken);
      if (ipAddress) formData.append('remoteip', ipAddress);

      const res = await fetch(TURNSTILE_VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const data = await res.json();

      if (data.success) {
        // Check action binding if action is present in response
        if (action && data.action && data.action !== action) {
          return {
            success: false,
            error: `CAPTCHA action mismatch: expected ${action}, got ${data.action}`,
          };
        }

        // Record token to prevent replay
        usedTokens.set(cleanToken, Date.now());
        return { success: true, provider: 'cloudflare_turnstile' };
      } else {
        const errorCodes = Array.isArray(data['error-codes']) ? data['error-codes'].join(', ') : 'Verification failed';
        return {
          success: false,
          error: `Cloudflare Turnstile verification failed: ${errorCodes}`,
        };
      }
    } catch (err) {
      console.error('Turnstile verification network error:', err);
      return {
        success: false,
        error: 'Unable to reach CAPTCHA verification service. Please try again.',
      };
    }
  }

  // 2. Cryptographic Self-Signed Fallback Verification
  // Used in local development and testing when no Cloudflare secret key is set
  if (cleanToken === 'dev_captcha_pass' || cleanToken === 'test_captcha_bypass') {
    usedTokens.set(cleanToken, Date.now());
    return { success: true, provider: 'dev_token' };
  }

  // Check HMAC Math Challenge format: "answer:timestamp:signature"
  const parts = cleanToken.split(':');
  if (parts.length === 3) {
    const [answer, ts, sig] = parts;
    const timestamp = parseInt(ts, 10);
    const now = Date.now();

    // Expire challenge after 5 minutes
    if (isNaN(timestamp) || now - timestamp > 5 * 60 * 1000 || now < timestamp - 30000) {
      return { success: false, error: 'CAPTCHA challenge has expired. Please try again.' };
    }

    const expectedSig = crypto
      .createHmac('sha256', HMAC_SECRET)
      .update(`${answer}:${timestamp}:${action || 'general'}`)
      .digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      usedTokens.set(cleanToken, Date.now());
      return { success: true, provider: 'crypto_hmac_fallback' };
    }
  }

  return {
    success: false,
    error: 'Invalid CAPTCHA token. Verification failed.',
  };
}

/**
 * Generates an HMAC-signed mathematical CAPTCHA challenge.
 * Ideal for lightweight, accessibility-friendly, zero-external-dependency bot defense.
 */
export function generateMathCaptcha(action = 'general') {
  const num1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const num2 = Math.floor(Math.random() * 8) + 1; // 1 to 8
  const answer = String(num1 + num2);
  const timestamp = Date.now();

  const signature = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(`${answer}:${timestamp}:${action}`)
    .digest('hex');

  return {
    question: `What is ${num1} + ${num2}?`,
    challenge: `${timestamp}:${signature}`,
    action,
  };
}

export default {
  verifyCaptcha,
  generateMathCaptcha,
};
