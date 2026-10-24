/**
 * Hritikpedia - Concurrent Development Server Launcher
 * Launches apps/web (port 3000) and apps/admin (port 3001) simultaneously
 * with colored stream prefixes and graceful shutdown.
 */

import { spawn } from 'child_process';
import path from 'path';

console.log('\n\x1b[1m\x1b[34m=======================================================');
console.log('       STARTING HRITIKPEDIA FULL-STACK MONOREPO        ');
console.log('  Web Platform:   http://localhost:3000                ');
console.log('  Admin Console:  http://localhost:3001                ');
console.log('  PostgreSQL DB:  Embedded WASM PGlite (Zero-Budget)   ');
console.log('=======================================================\x1b[0m\n');

function runProcess(name, command, args, cwd, colorCode) {
  const proc = spawn(command, args, {
    cwd,
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  const prefix = `\x1b[1m\x1b[${colorCode}m[${name}]\x1b[0m `;

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${prefix}${line}`);
      }
    }
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        console.error(`${prefix}\x1b[31m${line}\x1b[0m`);
      }
    }
  });

  proc.on('close', (code) => {
    console.log(`${prefix}exited with code ${code}`);
  });

  return proc;
}

const rootDir = process.cwd();

// Spawn Web App (Port 3000)
const webProcess = runProcess(
  'WEB',
  'npx',
  ['next', 'dev', '-p', '3000', '--turbopack'],
  path.join(rootDir, 'apps/web'),
  '36' // Cyan
);

// Spawn Admin App (Port 3001)
const adminProcess = runProcess(
  'ADMIN',
  'npx',
  ['next', 'dev', '-p', '3001', '--turbopack'],
  path.join(rootDir, 'apps/admin'),
  '35' // Magenta
);

// Graceful cleanup
function cleanup() {
  console.log('\nShutting down Hritikpedia dev servers...');
  try {
    webProcess.kill('SIGINT');
    adminProcess.kill('SIGINT');
  } catch (err) {
    // Ignore
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
