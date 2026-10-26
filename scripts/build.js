/**
 * Hritikpedia - Production Build Pipeline
 *
 * Loads the repository-root production environment before running both Next.js
 * builds. NEXT_PUBLIC_* values are inlined into client bundles at build time, so
 * building without this step can hard-code localhost URLs or missing keys.
 */

import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from './load-env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const loadedFiles = loadEnv(rootDir, 'production');

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || '').trim().replace(/\/+$/, '');
const adminUrl = (process.env.NEXT_PUBLIC_ADMIN_URL || '').trim().replace(/\/+$/, '');
const databaseUrl = (process.env.DATABASE_URL || '').trim();
const allowLocalBuild = process.env.ALLOW_LOCAL_PRODUCTION_BUILD === 'true';
const allowEmbeddedDb = process.env.ALLOW_EMBEDDED_DB === 'true';

const errors = [];
const warnings = [];

if (!appUrl) {
  errors.push(
    'NEXT_PUBLIC_APP_URL is required for a production build. Set it to the public web URL (for example https://hritikpedia.com).'
  );
} else if (
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/i.test(appUrl) &&
  !allowLocalBuild
) {
  errors.push(
    'NEXT_PUBLIC_APP_URL points to localhost. Use the public URL, or set ALLOW_LOCAL_PRODUCTION_BUILD=true for a local preview build.'
  );
}

if (!adminUrl) {
  warnings.push(
    'NEXT_PUBLIC_ADMIN_URL is not set. Admin links to the public store will fall back to localhost.'
  );
}

if (!databaseUrl && !allowEmbeddedDb) {
  errors.push(
    'DATABASE_URL is required for a production build because catalogue pages are prerendered from the database. Set it, or set ALLOW_EMBEDDED_DB=true for a local preview build.'
  );
}

if (databaseUrl && /user:password@|change-me|your-database/i.test(databaseUrl)) {
  warnings.push('DATABASE_URL looks like a placeholder. Verify the connection string.');
}

const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
if (!razorpayKey || /placeholder|dev_|change-me/i.test(razorpayKey)) {
  warnings.push(
    'NEXT_PUBLIC_RAZORPAY_KEY_ID is missing or a placeholder. Razorpay Checkout will not open in the built app.'
  );
}

console.log('\n\x1b[1m\x1b[34m=======================================================');
console.log('          HRITIKPEDIA PRODUCTION BUILD                 ');
console.log(`  Public URL:     ${appUrl || '(missing)'}`);
console.log(`  Admin URL:      ${adminUrl || '(missing)'}`);
console.log(`  Database:       ${databaseUrl ? 'external PostgreSQL' : 'embedded PGlite'}`);
console.log(`  Env files:      ${loadedFiles.length ? loadedFiles.join(', ') : 'process environment only'}`);
console.log('=======================================================\x1b[0m\n');

for (const warning of warnings) {
  console.log(`\x1b[33m[WARN]\x1b[0m ${warning}`);
}

if (errors.length > 0) {
  console.error('\n\x1b[1m\x1b[31mPRODUCTION BUILD CONFIGURATION FAILED\x1b[0m');
  for (const error of errors) {
    console.error(`  \x1b[31m✗\x1b[0m ${error}`);
  }
  console.error(
    '\nCreate .env.production (see .env.example) or export the values, then run "npm run build" again.\n'
  );
  process.exit(1);
}

if (warnings.length > 0) {
  console.log('\nContinuing build with warnings. Review them before deploying.\n');
}

const nextBin = path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next');

for (const app of ['web', 'admin']) {
  console.log(`\n\x1b[1m\x1b[36m[BUILD]\x1b[0m apps/${app}`);

  const result = spawnSync(process.execPath, [nextBin, 'build'], {
    cwd: path.join(rootDir, 'apps', app),
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
  });

  if (result.error) {
    console.error(`\n\x1b[31m[BUILD FAILED]\x1b[0m ${result.error.message}\n`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`\n\x1b[31m[BUILD FAILED]\x1b[0m apps/${app} exited with code ${result.status}\n`);
    process.exit(result.status || 1);
  }
}

console.log('\n\x1b[1m\x1b[32mBoth production builds completed successfully.\x1b[0m');
console.log('Start them with "npm start" using the same production environment.\n');
