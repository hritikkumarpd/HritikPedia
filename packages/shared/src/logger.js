/**
 * HRITIKPEDIA ENTERPRISE PRODUCTION LOGGER & OBSERVABILITY ENGINE
 * Structured JSON logging with context correlation, automatic PII sanitization,
 * latency measurement, and automated alert triggering for production environments.
 */

import { sendAlert, ALERT_TYPES } from './alerts.js';

const IS_PROD = process.env.NODE_ENV === 'production';
const SERVICE_NAME = process.env.SERVICE_NAME || 'hritikpedia-core';

// Keys that must NEVER be printed in production logs
const REDACTED_KEYS = new Set([
  'password',
  'password_hash',
  'token',
  'access_token',
  'refresh_token',
  'secret',
  'jwt_secret',
  'authorization',
  'cookie',
  'set-cookie',
  'card',
  'card_number',
  'cvv',
  'signature',
  'payment_signature',
  'key',
]);

/**
 * Deep clones and sanitizes an object, redacting sensitive parameters.
 */
function sanitize(obj, depth = 0) {
  if (depth > 5) return '[DepthLimit]';
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitize(item, depth + 1));
  }

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (REDACTED_KEYS.has(lowerKey) || lowerKey.includes('secret') || lowerKey.includes('password')) {
      clean[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitize(value, depth + 1);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Core log emitter.
 */
function output(level, message, metadata = {}) {
  const timestamp = new Date().toISOString();
  const cleanMeta = sanitize(metadata);

  if (IS_PROD) {
    // Cloud-native JSON log entry for Datadog / CloudWatch / BetterStack / Loki
    const logPayload = {
      timestamp,
      level,
      service: SERVICE_NAME,
      message,
      ...cleanMeta,
    };
    const logString = JSON.stringify(logPayload);
    if (level === 'ERROR' || level === 'FATAL') {
      console.error(logString);
    } else if (level === 'WARN') {
      console.warn(logString);
    } else {
      console.log(logString);
    }
  } else {
    // Development console formatting
    const colors = {
      DEBUG: '\x1b[90m',
      INFO: '\x1b[36m',
      WARN: '\x1b[33m',
      ERROR: '\x1b[31m',
      SECURITY: '\x1b[35m',
      PERF: '\x1b[32m',
    };
    const color = colors[level] || '\x1b[0m';
    const reset = '\x1b[0m';

    const metaStr = Object.keys(cleanMeta).length > 0 ? ` ${JSON.stringify(cleanMeta)}` : '';
    console.log(`${color}[${level}]${reset} \x1b[2m${timestamp.substring(11, 19)}\x1b[0m ${message}${metaStr}`);
  }
}

export const logger = {
  debug(message, meta = {}) {
    if (process.env.LOG_LEVEL === 'debug') {
      output('DEBUG', message, meta);
    }
  },

  info(message, meta = {}) {
    output('INFO', message, meta);
  },

  warn(message, meta = {}) {
    output('WARN', message, meta);
  },

  error(message, errorOrMeta = {}, meta = {}) {
    let payload = { ...meta };

    if (errorOrMeta instanceof Error) {
      payload.errorName = errorOrMeta.name;
      payload.errorMessage = errorOrMeta.message;
      payload.stack = errorOrMeta.stack;
    } else if (typeof errorOrMeta === 'object') {
      payload = { ...errorOrMeta, ...payload };
    }

    output('ERROR', message, payload);

    // If critical alert flag is set, trigger webhook notification
    if (payload.alert) {
      sendAlert({
        type: ALERT_TYPES.SYSTEM,
        title: `🚨 Server Error: ${message}`,
        message: payload.errorMessage || message,
        metadata: {
          Service: SERVICE_NAME,
          ...payload,
        },
      }).catch(() => {});
    }
  },

  security(eventType, meta = {}) {
    output('SECURITY', `[SEC-EVENT] ${eventType}`, meta);
  },

  perf(action, durationMs, meta = {}) {
    output('PERF', `⏱ ${action} took ${durationMs.toFixed(2)}ms`, {
      action,
      durationMs,
      ...meta,
    });
  },

  /**
   * Returns a child logger pre-seeded with request context (e.g. reqId, client IP, path).
   */
  child(baseMeta = {}) {
    return {
      debug: (msg, meta) => logger.debug(msg, { ...baseMeta, ...meta }),
      info: (msg, meta) => logger.info(msg, { ...baseMeta, ...meta }),
      warn: (msg, meta) => logger.warn(msg, { ...baseMeta, ...meta }),
      error: (msg, err, meta) => logger.error(msg, err, { ...baseMeta, ...meta }),
      security: (evt, meta) => logger.security(evt, { ...baseMeta, ...meta }),
      perf: (act, ms, meta) => logger.perf(act, ms, { ...baseMeta, ...meta }),
    };
  },
};

export default logger;
