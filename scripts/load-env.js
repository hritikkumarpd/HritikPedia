/**
 * Hritikpedia - Root environment file loader
 *
 * Next.js only reads env files from each app's own directory. This monorepo
 * keeps shared configuration in the repository root, so the launchers read
 * those files explicitly and pass the values to both app processes.
 *
 * Precedence matches Next.js: shell environment wins, then
 * `.env.<mode>.local`, `.env.local`, `.env.<mode>`, `.env`.
 */

import fs from 'fs';
import path from 'path';

function parseEnvValue(rawValue) {
  let value = rawValue.trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    const quote = value[0];
    value = value.slice(1, -1);
    if (quote === '"') {
      value = value
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"');
    }
    return value;
  }

  const inlineComment = value.indexOf(' #');
  if (inlineComment >= 0) {
    value = value.slice(0, inlineComment).trim();
  }

  return value;
}

export function parseEnvFile(content) {
  const result = {};

  for (const rawLine of content.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    let line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('export ')) line = line.slice(7).trim();

    const separator = line.indexOf('=');
    if (separator <= 0) continue;

    const key = line.slice(0, separator).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;

    result[key] = parseEnvValue(line.slice(separator + 1));
  }

  return result;
}

export function loadEnv(rootDir, mode) {
  // Production intentionally skips `.env.local`: that file is for local overrides
  // and commonly contains localhost URLs and development secrets. Production
  // configuration must come from `.env.production(.local)`, `.env`, or the
  // process environment.
  const files =
    mode === 'production'
      ? ['.env.production.local', '.env.production', '.env']
      : ['.env.development.local', '.env.local', '.env.development', '.env'];

  const loadedFiles = [];

  for (const file of files) {
    const fullPath = path.join(rootDir, file);
    if (!fs.existsSync(fullPath)) continue;

    let parsed;
    try {
      parsed = parseEnvFile(fs.readFileSync(fullPath, 'utf8'));
    } catch (err) {
      console.warn(`[env] Could not read ${file}: ${err.message}`);
      continue;
    }

    for (const [key, value] of Object.entries(parsed)) {
      // Runtime mode is always controlled by the launcher, never by a file.
      if (key === 'NODE_ENV') continue;
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }

    loadedFiles.push(file);
  }

  return loadedFiles;
}
