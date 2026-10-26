import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const { Pool } = pg;

let ROOT_PGDATA;
try {
  const rawUrl = typeof import.meta.url === 'string' ? import.meta.url : (import.meta.url?.href || String(import.meta.url));
  const __filename = fileURLToPath(String(rawUrl));
  const __dirname = path.dirname(__filename);
  ROOT_PGDATA = path.resolve(__dirname, '../../../.pgdata');
} catch {
  ROOT_PGDATA = path.resolve(process.cwd(), '.pgdata');
}

let pool = null;
let pgliteInstance = null;
let isEmbedded = false;
let dbInitPromise = null;

/**
 * Resolves TLS settings without disabling certificate verification silently.
 * `sslmode=require` is treated as verified TLS (the secure interpretation).
 * Set DATABASE_SSL_REJECT_UNAUTHORIZED=false only for a provider that cannot
 * present a publicly trusted certificate.
 */
function resolveConnectionSecurity(rawConnectionString) {
  const modeMatch = /[?&]sslmode=([^&]+)/i.exec(rawConnectionString);
  const mode = (modeMatch?.[1] || '').toLowerCase();
  const useSsl =
    process.env.DATABASE_SSL === 'true' ||
    rawConnectionString.includes('neon.tech') ||
    ['prefer', 'require', 'verify-ca', 'verify-full'].includes(mode);

  if (!useSsl || mode === 'disable') {
    return { connectionString: rawConnectionString, ssl: false };
  }

  const connectionString = rawConnectionString
    .replace(/([?&])sslmode=[^&]*&?/i, '$1')
    .replace(/[?&]$/, '');

  return {
    connectionString,
    ssl: { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' },
  };
}

/**
 * Initializes the database client.
 * Connects to external PostgreSQL via Pool if DATABASE_URL is provided;
 * Otherwise initializes embedded WASM PostgreSQL via PGlite for zero-budget local dev & testing.
 */
export async function getDb() {
  if (pool) return { type: 'pool', client: pool };
  if (pgliteInstance) return { type: 'pglite', client: pgliteInstance };

  // Memoize initialization so concurrent requests cannot create duplicate pools.
  if (!dbInitPromise) {
    dbInitPromise = initializeDb().catch((error) => {
      dbInitPromise = null;
      throw error;
    });
  }
  return dbInitPromise;
}

async function initializeDb() {
  const rawConnectionString = process.env.DATABASE_URL;

  if (rawConnectionString && rawConnectionString.trim().length > 0) {
    const { connectionString, ssl } = resolveConnectionSecurity(rawConnectionString.trim());
    const candidatePool = new Pool({
      connectionString,
      ssl,
      min: parseInt(process.env.DATABASE_POOL_MIN || '0', 10),
      max: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
      idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT_MS || '30000', 10),
      connectionTimeoutMillis: parseInt(process.env.DATABASE_CONNECT_TIMEOUT_MS || '10000', 10),
      // Detect half-open sockets (e.g. paused Neon compute) instead of waiting forever.
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    });

    // pg emits 'error' on the pool when an *idle* client is dropped by the server.
    // Without this listener Node treats it as an uncaughtException and kills the
    // whole server. The pool removes the broken client and reconnects on demand.
    let lastIdleErrorLogAt = 0;
    candidatePool.on('error', (error) => {
      const now = Date.now();
      if (now - lastIdleErrorLogAt > 30000) {
        lastIdleErrorLogAt = now;
        console.warn(
          `[DB] Idle PostgreSQL connection dropped (${error.code || 'unknown'}: ${error.message}). The pool will reconnect automatically.`
        );
      }
    });

    try {
      const test = await candidatePool.query('SELECT NOW() as now, version() as version');
      pool = candidatePool;
      console.log(`[DB] Connected to PostgreSQL via Pool. Server: ${test.rows[0].version.split(' ')[0]}`);
      isEmbedded = false;
      return { type: 'pool', client: pool };
    } catch (err) {
      try {
        await candidatePool.end();
      } catch {
        // Ignore shutdown errors for a pool that never became usable.
      }

      if (process.env.NODE_ENV === 'production' && process.env.ALLOW_EMBEDDED_DB !== 'true') {
        throw new Error(
          `FATAL: Production database connection failed. Refusing to fall back to embedded storage. ${err.message}`
        );
      }
      console.warn(`[DB] Failed to connect to DATABASE_URL: ${err.message}. Falling back to embedded WASM PostgreSQL.`);
    }
  }

  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_EMBEDDED_DB !== 'true') {
    throw new Error(
      'FATAL: DATABASE_URL is required in production. Embedded PGlite is not safe for a deployed web + admin deployment.'
    );
  }

  // Zero-budget fallback: Embedded WASM PostgreSQL anchored to monorepo root
  const dataDir = process.env.PGDATA_DIR || ROOT_PGDATA;
  if (!fs.existsSync(/*turbopackIgnore: true*/ dataDir)) {
    fs.mkdirSync(/*turbopackIgnore: true*/ dataDir, { recursive: true });
  }

  pgliteInstance = new PGlite(dataDir);
  await pgliteInstance.waitReady;
  isEmbedded = true;
  console.log(`[DB] Initialized embedded WASM PostgreSQL at ${dataDir}`);
  return { type: 'pglite', client: pgliteInstance };
}

/**
 * Executes a parameterized SQL query.
 * @param {string} text Parameterized SQL statement
 * @param {Array} params Array of bind parameters ($1, $2, etc.)
 * @returns {Promise<{rows: Array, rowCount: number}>}
 */
export async function query(text, params = []) {
  const db = await getDb();

  if (db.type === 'pool') {
    const result = await db.client.query(text, params);
    return {
      rows: result.rows,
      rowCount: result.rowCount,
    };
  } else {
    // PGlite interface
    const result = await db.client.query(text, params);
    return {
      rows: result.rows,
      rowCount: result.rows.length,
    };
  }
}

/**
 * Executes a multi-statement raw SQL script (e.g. migrations or DDL).
 * @param {string} sql Raw SQL script
 */
export async function exec(sql) {
  const db = await getDb();
  if (db.type === 'pool') {
    return await db.client.query(sql);
  } else {
    return await db.client.exec(sql);
  }
}

/**
 * Runs a transactional series of operations.
 * @param {Function} callback Callback receiving a query function scoped to the transaction
 */
export async function transaction(callback) {
  const db = await getDb();

  if (db.type === 'pool') {
    const client = await db.client.connect();
    try {
      await client.query('BEGIN');
      const scopedQuery = (text, params) => client.query(text, params);
      const result = await callback(scopedQuery);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } else {
    // PGlite transaction
    try {
      await db.client.query('BEGIN');
      const scopedQuery = (text, params) => db.client.query(text, params);
      const result = await callback(scopedQuery);
      await db.client.query('COMMIT');
      return result;
    } catch (error) {
      await db.client.query('ROLLBACK');
      throw error;
    }
  }
}

/**
 * Health check reporting connection type and server time.
 */
export async function checkHealth() {
  try {
    const start = Date.now();
    const res = await query('SELECT NOW() as now, 1 as active');
    const latency = Date.now() - start;
    return {
      status: 'healthy',
      engine: isEmbedded ? 'embedded_pglite_wasm' : 'postgresql_pool',
      timestamp: res.rows[0].now,
      latencyMs: latency,
    };
  } catch (err) {
    return {
      status: 'unhealthy',
      engine: isEmbedded ? 'embedded_pglite_wasm' : 'postgresql_pool',
      error: err.message,
    };
  }
}

export default {
  getDb,
  query,
  exec,
  transaction,
  checkHealth,
};
