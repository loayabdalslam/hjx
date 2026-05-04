/**
 * Hjx Config Loader
 * Reads .hjxrc (JSON) from CWD or home directory, merges with env vars.
 */

import { existsSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const DEFAULTS = {
  provider: 'ollama',
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'gemma4:31b-cloud',
  target: 'javascript',
  run: true,
  explain: false,
  timeout: 30000,
};

function loadRcFile(dir) {
  const rcPath = join(dir, '.hjxrc');
  if (!existsSync(rcPath)) return {};
  try {
    return JSON.parse(readFileSync(rcPath, 'utf8'));
  } catch {
    return {};
  }
}

export function loadConfig(overrides = {}) {
  const homeRc = loadRcFile(homedir());
  const localRc = loadRcFile(process.cwd());

  const envMap = {
    provider: process.env.HJX_PROVIDER,
    apiKey: process.env.HJX_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY,
    ollamaUrl: process.env.HJX_OLLAMA_URL,
    ollamaModel: process.env.HJX_OLLAMA_MODEL,
    target: process.env.HJX_TARGET,
    model: process.env.HJX_MODEL,
  };

  // Strip undefined env values
  const envConfig = Object.fromEntries(
    Object.entries(envMap).filter(([, v]) => v !== undefined)
  );

  return {
    ...DEFAULTS,
    ...homeRc,
    ...localRc,
    ...envConfig,
    ...overrides,
  };
}
