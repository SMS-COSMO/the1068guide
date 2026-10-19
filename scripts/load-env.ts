import { existsSync, readFileSync } from 'node:fs';
import process from 'node:process';

export function loadEnvFile(path: string, override = false) {
  if (!existsSync(path))
    return;

  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#'))
      continue;

    const separator = trimmed.indexOf('=');
    if (separator === -1)
      continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith('\'') && value.endsWith('\''))
    ) {
      value = value.slice(1, -1);
    }

    if (override || process.env[key] === undefined)
      process.env[key] = value;
  }
}

export function loadProjectEnv() {
  loadEnvFile('.env');
  loadEnvFile('.env.local', true);
}
