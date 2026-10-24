import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_PGDATA = path.resolve(__dirname, '../../../.pgdata');

let pool = null;
let pgliteInstance = null;
let isEmbedded = false;

/**
 * Initializes the database client.
 * Connects to external PostgreSQL via Pool if DATABASE_URL is provided;
 * Otherwise initializes embedded WASM PostgreSQL via PGlite for zero-budget local dev & testing.
 */
export async function getDb() {
  if (pool) return { type: 'pool', client: pool };
  if (pgliteInstance) return { type: 'pglite', client: pgliteInstance };

  const connectionString = process.env.DATABASE_URL;

  if (connectionString && connectionString.trim().length > 0) {
    try {
      pool = new Pool({
        connectionString,
        ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
        min: parseInt(process.env.DATABASE_POOL_MIN || '2', 10),
        max: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      // Test connection
      const test = await pool.query('SELECT NOW() as now, version() as version');
      console.log(`[DB] Connected to PostgreSQL via Pool. Server: ${test.rows[0].version.split(' ')[0]}`);
      isEmbedded = false;
      return { type: 'pool', client: pool };
    } catch (err) {
      console.warn(`[DB] Failed to connect to DATABASE_URL: ${err.message}. Falling back to embedded WASM PostgreSQL.`);
      pool = null;
    }
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
