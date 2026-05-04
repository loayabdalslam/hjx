/**
 * Hjx History Manager
 * Persists every translation to ~/.hjx/history.json
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const HJX_DIR = join(homedir(), '.hjx');
const HISTORY_FILE = join(HJX_DIR, 'history.json');

function ensureDir() {
  if (!existsSync(HJX_DIR)) {
    mkdirSync(HJX_DIR, { recursive: true });
  }
}

function loadHistory() {
  ensureDir();
  if (!existsSync(HISTORY_FILE)) return [];
  try {
    return JSON.parse(readFileSync(HISTORY_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveHistory(entries) {
  ensureDir();
  writeFileSync(HISTORY_FILE, JSON.stringify(entries, null, 2), 'utf8');
}

export function addEntry(entry) {
  const history = loadHistory();
  const record = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    intent: entry.intent,
    target: entry.target,
    code: entry.code,
    provider: entry.provider || 'unknown',
    source: entry.source || null,     // original .hjx file path
    execution: entry.execution || null, // { success, output }
  };
  history.unshift(record); // newest first
  // Keep last 200 entries
  saveHistory(history.slice(0, 200));
  return record;
}

export function getHistory(limit = 20) {
  return loadHistory().slice(0, limit);
}

export function clearHistory() {
  saveHistory([]);
}

export function getHistoryPath() {
  return HISTORY_FILE;
}

export function findEntry(id) {
  return loadHistory().find(e => e.id === id || String(e.id) === String(id));
}
