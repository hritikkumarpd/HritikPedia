/**
 * Hritikpedia - Production Server Launcher
 * Runs apps/web (port 3000) and apps/admin (port 3001) in optimized production mode.
 *
 * Loads the repository-root environment (Next.js only reads app-level env files),
 * validates launch-critical configuration, and refuses to start with unsafe
 * production values.
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from './load-env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const nextBin = path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next');

const loadedFiles = loadEnv(rootDir, 'production');

const webPort = Number(process.env.PORT) || 3000;
const adminPort = Number(process.env.ADMIN_PORT) || 3001;
const appUrl = (
  process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${webPort}`
).replace(/\/+$/, '');
const adminUrl = (
  process.env.NEXT_PUBLIC_ADMIN_URL || `http://localhost:${adminPort}`
).replace(/\/+$/, '');

const isLocalUrl = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/i.test(
  appUrl
);

const errors = [];
const warnings = [];

// 0. Public URL
if (!(process.env.NEXT_PUBLIC_APP_URL || '').trim()) {
  errors.push(
    'NEXT_PUBLIC_APP_URL is not set. Session emails and canonical links would point at localhost.'
  );
} else if (isLocalUrl) {
  warnings.push(
    'NEXT_PUBLIC_APP_URL points to localhost. Use the public URL before accepting live traffic.'
  );
}

// 1. JWT secret
const KNOWN_DEV_SECRET =
  'hritikpedia_dev_secret_key_super_secure_8830172038102938472910293847562019283746';
const jwtSecret = (process.env.JWT_SECRET || '').trim();

if (!jwtSecret) {
  errors.push('JWT_SECRET is not set. Generate a long random secret before launching.');
} else if (jwtSecret.length < 32) {
  errors.push('JWT_SECRET must be at least 32 characters long.');
} else if (/replace_with|change[-_]?me|your[-_]?secret|generate[-_]?a[-_]?strong/i.test(jwtSecret)) {
  errors.push('JWT_SECRET still looks like a placeholder. Generate a real random secret.');
} else if (jwtSecret === KNOWN_DEV_SECRET && !isLocalUrl) {
  errors.push(
    'JWT_SECRET is still the development secret. Generate a new secret for the public deployment.'
  );
} else if (jwtSecret === KNOWN_DEV_SECRET) {
  warnings.push('JWT_SECRET is the development secret. Rotate it before exposing this server.');
}

// 2. Database: two Next.js processes cannot safely share embedded PGlite.
const databaseUrl = (process.env.DATABASE_URL || '').trim();
const allowEmbeddedDb = process.env.ALLOW_EMBEDDED_DB === 'true';

if (!databaseUrl && !allowEmbeddedDb) {
  errors.push(
    'DATABASE_URL is not set. The web and admin processes cannot safely share the embedded PGlite database. Set DATABASE_URL to managed PostgreSQL, or set ALLOW_EMBEDDED_DB=true for a single-process local preview.'
  );
}

if (databaseUrl && /user:password@|change-me|your-database/i.test(databaseUrl)) {
  warnings.push('DATABASE_URL looks like a placeholder. Verify the connection string.');
}

// 3. Cookies
const cookieSecure = (process.env.COOKIE_SECURE || '').trim().toLowerCase();
if (!isLocalUrl && cookieSecure === 'false') {
  errors.push(
    'COOKIE_SECURE=false is unsafe for a public deployment. Remove it so session cookies use the Secure flag.'
  );
}

// 4. Payments
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || '';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || '';
const publicRazorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

if (
  !razorpayKeyId ||
  !razorpayKeySecret ||
  /placeholder|dev_|change-me/i.test(razorpayKeyId) ||
  /placeholder|dev_|change-me/i.test(razorpayKeySecret)
) {
  warnings.push(
    'Razorpay keys are missing or placeholders. Paid checkout will fail until real live keys are configured.'
  );
}

if (razorpayKeyId && publicRazorpayKey && publicRazorpayKey !== razorpayKeyId) {
  warnings.push(
    'NEXT_PUBLIC_RAZORPAY_KEY_ID does not match RAZORPAY_KEY_ID. Checkout may open with the wrong key.'
  );
}

// 5. Email
if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
  warnings.push(
    'RESEND_API_KEY / EMAIL_FROM are not configured. Newsletter broadcasts are blocked in production.'
  );
}

// 6. Build artifacts
for (const app of ['web', 'admin']) {
  if (!fs.existsSync(path.join(rootDir, 'apps', app, '.next', 'BUILD_ID'))) {
    errors.push(`apps/${app} has no production build. Run "npm run build" first.`);
  }
}

console.log('\n\x1b[1m\x1b[32m=======================================================');
console.log('       STARTING HRITIKPEDIA IN PRODUCTION MODE         ');
console.log(`  Web Platform:   ${appUrl.padEnd(37)}`);
console.log(`  Admin Console:  ${adminUrl.padEnd(37)}`);
console.log(`  Ports:          web ${webPort} / admin ${adminPort}`);
console.log(`  Database:       ${databaseUrl ? 'external PostgreSQL' : allowEmbeddedDb ? 'embedded PGlite (explicit)' : 'not configured'}`);
console.log(`  Env files:      ${loadedFiles.length ? loadedFiles.join(', ') : 'process environment only'}`);
console.log('=======================================================\x1b[0m');

for (const warning of warnings) {
  console.log(`\x1b[33m[WARN]\x1b[0m ${warning}`);
}

if (errors.length > 0) {
  console.error('\n\x1b[1m\x1b[31mPRODUCTION PRE-FLIGHT FAILED\x1b[0m');
  for (const error of errors) {
    console.error(`  \x1b[31m✗\x1b[0m ${error}`);
  }
  console.error(
    '\nSet the missing values in .env.production (or the process environment) and run "npm start" again.\n'
  );
  process.exit(1);
}

if (warnings.length > 0) {
  console.log('\nContinuing with warnings. Review them before accepting live traffic.\n');
}

let shuttingDown = false;
const processes = [];

function stopAll(exitCode) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const proc of processes) {
    try {
      proc.kill('SIGINT');
    } catch {
      // Process may already be gone.
    }
  }

  const forceTimer = setTimeout(() => {
    for (const proc of processes) {
      try {
        proc.kill('SIGKILL');
      } catch {
        // Process may already be gone.
      }
    }
    process.exit(exitCode);
  }, 4000);
  forceTimer.unref();
}

function runProcess(name, appDir, args, colorCode) {
  const proc = spawn(process.execPath, [nextBin, ...args], {
    cwd: appDir,
    env: { ...process.env, NODE_ENV: 'production', FORCE_COLOR: '1' },
    windowsHide: true,
  });

  const prefix = `\x1b[1m\x1b[${colorCode}m[${name}]\x1b[0m `;

  const pipe = (stream, write) => {
    let buffer = '';
    stream.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (line.trim()) write(`${prefix}${line}`);
      }
    });
    stream.on('end', () => {
      if (buffer.trim()) write(`${prefix}${buffer}`);
    });
  };

  pipe(proc.stdout, (line) => console.log(line));
  pipe(proc.stderr, (line) => console.error(`${line}\x1b[31m`));

  proc.on('error', (err) => {
    console.error(`${prefix}failed to start: ${err.message}`);
    stopAll(1);
  });

  proc.on('exit', (code, signal) => {
    console.log(`${prefix}exited with code ${code}${signal ? ` (${signal})` : ''}`);
    if (!shuttingDown) {
      console.error(`${prefix}stopped unexpectedly. Shutting down the other process.`);
      stopAll(1);
    }
  });

  processes.push(proc);
  return proc;
}

runProcess('WEB', path.join(rootDir, 'apps/web'), ['start', '-p', String(webPort)], '36');
runProcess('ADMIN', path.join(rootDir, 'apps/admin'), ['start', '-p', String(adminPort)], '35');

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
