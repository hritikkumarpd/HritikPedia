/**
 * Hritikpedia - Concurrent Development Server Launcher
 * Launches apps/web and apps/admin simultaneously with the repository-root
 * environment, colored stream prefixes, and graceful shutdown.
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from './load-env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const nextBin = path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next');

const loadedFiles = loadEnv(rootDir, 'development');

const webPort = Number(process.env.PORT) || 3000;
const adminPort = Number(process.env.ADMIN_PORT) || 3001;
const appUrl = (
  process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${webPort}`
).replace(/\/+$/, '');
const adminUrl = (
  process.env.NEXT_PUBLIC_ADMIN_URL || `http://localhost:${adminPort}`
).replace(/\/+$/, '');
const databaseUrl = (process.env.DATABASE_URL || '').trim();

console.log('\n\x1b[1m\x1b[34m=======================================================');
console.log('       STARTING HRITIKPEDIA FULL-STACK MONOREPO        ');
console.log(`  Web Platform:   ${appUrl.padEnd(37)}`);
console.log(`  Admin Console:  ${adminUrl.padEnd(37)}`);
console.log(`  Ports:          web ${webPort} / admin ${adminPort}`);
console.log(
  `  Database:       ${databaseUrl ? 'external PostgreSQL' : 'embedded WASM PGlite'}`
);
console.log(`  Env files:      ${loadedFiles.length ? loadedFiles.join(', ') : 'process environment only'}`);
console.log('=======================================================\x1b[0m\n');

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
  }, 3000);
  forceTimer.unref();
}

function runProcess(name, appDir, args, colorCode) {
  const proc = spawn(process.execPath, [nextBin, ...args], {
    cwd: appDir,
    env: { ...process.env, NODE_ENV: 'development', FORCE_COLOR: '1' },
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

runProcess(
  'WEB',
  path.join(rootDir, 'apps/web'),
  ['dev', '-p', String(webPort), '--turbopack'],
  '36'
);
runProcess(
  'ADMIN',
  path.join(rootDir, 'apps/admin'),
  ['dev', '-p', String(adminPort), '--turbopack'],
  '35'
);

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
