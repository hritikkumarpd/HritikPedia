import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_in_production_min_32_chars';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 12;

/**
 * Securely hashes a plain-text password using bcrypt.
 * @param {string} password Plaintext password
 * @returns {Promise<string>} Salted bcrypt hash
 */
export async function hashPassword(password) {
  if (!password || typeof password !== 'string' || password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Validates a plain-text password against a stored bcrypt hash.
 * @param {string} password Plaintext attempt
 * @param {string} hash Stored bcrypt hash
 * @returns {Promise<boolean>} True if match
 */
export async function verifyPassword(password, hash) {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

/**
 * Signs a secure JWT payload for session management.
 * @param {object} payload Non-secret user identity details (id, email, role)
 * @returns {string} Signed JWT token
 */
export function signToken(payload) {
  const safePayload = {
    userId: payload.userId || payload.id,
    email: payload.email,
    role: payload.role,
    name: payload.name,
    sessionId: payload.sessionId || Math.random().toString(36).substring(2, 15),
  };
  return jwt.sign(safePayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifies and decodes a JWT token.
 * @param {string} token Encoded JWT token string
 * @returns {object|null} Decoded payload or null if invalid/expired
 */
export function verifyToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Extracts session token from incoming request headers or cookies.
 * @param {Request|Headers|object} req Standard Request or Next.js headers
 * @param {string} cookieName Target cookie name
 * @returns {string|null} Token or null
 */
export function extractTokenFromRequest(req, cookieName = 'hritikpedia_session') {
  if (!req) return null;

  // 1. Check Bearer Authorization header
  let authHeader = null;
  if (typeof req.headers?.get === 'function') {
    authHeader = req.headers.get('authorization');
  } else if (req.headers && req.headers.authorization) {
    authHeader = req.headers.authorization;
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 2. Check Cookie header
  let cookieHeader = null;
  if (typeof req.headers?.get === 'function') {
    cookieHeader = req.headers.get('cookie');
  } else if (req.headers && req.headers.cookie) {
    cookieHeader = req.headers.cookie;
  } else if (req.cookies && typeof req.cookies.get === 'function') {
    const c = req.cookies.get(cookieName);
    return c ? (c.value || c) : null;
  }

  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    for (const c of cookies) {
      if (c.startsWith(`${cookieName}=`)) {
        return decodeURIComponent(c.substring(cookieName.length + 1));
      }
    }
  }

  return null;
}

export default {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  extractTokenFromRequest,
};
