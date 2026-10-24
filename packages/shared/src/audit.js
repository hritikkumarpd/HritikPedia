import { query } from './db.js';
import { alertSecurityThreat } from './alerts.js';

/**
 * Audit and Security Event Types
 */
export const SECURITY_EVENT_TYPES = {
  AUTH_LOGIN_SUCCESS: 'auth:login_success',
  AUTH_LOGIN_FAILED: 'auth:login_failed',
  AUTH_LOGOUT: 'auth:logout',
  AUTH_REGISTER: 'auth:register',
  AUTH_PASSWORD_RESET: 'auth:password_reset',
  ACCESS_DENIED_PDF: 'access:denied_pdf',
  ACCESS_DENIED_ADMIN: 'access:denied_admin',
  RATE_LIMIT_EXCEEDED: 'rate_limit:exceeded',
  PAYMENT_SIGNATURE_FAILED: 'payment:signature_failed',
  PAYMENT_CAPTURED: 'payment:captured',
  WEBHOOK_INVALID: 'webhook:invalid',
  CONTENT_MUTATION: 'content:mutation',
  ROLE_CHANGED: 'role:changed',
};

/**
 * High-severity events that trigger instant SOC alerting
 */
const HIGH_SEVERITY_EVENTS = new Set([
  SECURITY_EVENT_TYPES.ACCESS_DENIED_ADMIN,
  SECURITY_EVENT_TYPES.PAYMENT_SIGNATURE_FAILED,
  SECURITY_EVENT_TYPES.RATE_LIMIT_EXCEEDED,
  SECURITY_EVENT_TYPES.WEBHOOK_INVALID,
]);

/**
 * Records an immutable security event into database.
 * Strictly sanitizes sensitive fields (never logs passwords, raw tokens, or secrets).
 */
export async function recordSecurityEvent({
  eventType,
  userId = null,
  ipAddress = '127.0.0.1',
  userAgent = 'Unknown',
  details = {},
}) {
  const safeDetails = { ...details };
  // Redact any accidental sensitive parameters
  delete safeDetails.password;
  delete safeDetails.token;
  delete safeDetails.secret;
  delete safeDetails.card;
  delete safeDetails.cvv;

  try {
    await query(
      `INSERT INTO security_events (event_type, user_id, ip_address, user_agent, details, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [eventType, userId, ipAddress, userAgent, JSON.stringify(safeDetails)]
    );
  } catch (err) {
    // Failsafe logging to console if DB write fails
    console.error(`[SECURITY ALERT] ${eventType} from ${ipAddress}:`, safeDetails, `(DB Log Error: ${err.message})`);
  }

  // Real-time SOC Webhook Alerting for High-Severity Threats
  if (HIGH_SEVERITY_EVENTS.has(eventType)) {
    alertSecurityThreat({ eventType, ipAddress, details: safeDetails }).catch(() => {});
  }
}

/**
 * In-memory sliding window rate limiter
 */
const rateLimitBuckets = new Map();

export function checkRateLimit(ipAddress, maxRequests = 60, windowSeconds = 60) {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const key = ipAddress || 'unknown';

  let bucket = rateLimitBuckets.get(key);
  if (!bucket) {
    bucket = [];
    rateLimitBuckets.set(key, bucket);
  }

  // Remove timestamps outside window
  const validTimestamps = bucket.filter((timestamp) => now - timestamp < windowMs);
  validTimestamps.push(now);
  rateLimitBuckets.set(key, validTimestamps);

  const isAllowed = validTimestamps.length <= maxRequests;
  const remaining = Math.max(0, maxRequests - validTimestamps.length);
  const resetSeconds = Math.ceil((windowMs - (now - validTimestamps[0])) / 1000);

  return {
    allowed: isAllowed,
    remaining,
    total: validTimestamps.length,
    limit: maxRequests,
    resetSeconds: Math.max(1, resetSeconds),
  };
}

export default {
  SECURITY_EVENT_TYPES,
  recordSecurityEvent,
  checkRateLimit,
};
