/**
 * Hritikpedia - Production Server Launcher
 * Runs apps/web (port 3000) and apps/admin (port 3001) in optimized production mode.
 */

import { spawn } from 'child_process';
import path from 'path';

console.log('\n\x1b[1m\x1b[32m=======================================================');
console.log('       STARTING HRITIKPEDIA IN PRODUCTION MODE         ');
console.log('  Web Platform:   http://localhost:3000                ');
console.log('  Admin Console:  http://localhost:3001                ');
console.log('  Mode:           NODE_ENV=production                 ');
console.log('=======================================================\x1b[0m\n');

function runProcess(name, command, args, cwd, colorCode) {
  const proc = spawn(command, args, {
    cwd,
    shell: true,
    env: { ...process.env, NODE_ENV: 'production', FORCE_COLOR: '1' },
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

// Spawn Web App in production mode
const webProcess = runProcess(
  'WEB',
  'npx',
  ['next', 'start', '-p', '3000'],
  path.join(rootDir, 'apps/web'),
  '36'
);

// Spawn Admin App in production mode
const adminProcess = runProcess(
  'ADMIN',
  'npx',
  ['next', 'start', '-p', '3001'],
  path.join(rootDir, 'apps/admin'),
  '35'
);

function cleanup() {
  console.log('\nStopping Hritikpedia production servers...');
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
