import { describe, it, expect, vi, beforeAll } from 'vitest';
import { runHjx } from '../src/index.js';
import * as generator from '../src/generator/index.js';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

// Mock the core generator function
vi.spyOn(generator, 'generate').mockImplementation(async (parsed) => {
  return {
    code: parsed.target === 'javascript' ? 'return "mocked result";' : 'print("mocked result")',
    success: true
  };
});

describe('Intent Coding — Mocked Core Tests', () => {
  const cacheDir = join(process.cwd(), '.intent-mock-cache');

  beforeAll(() => {
    if (existsSync(cacheDir)) rmSync(cacheDir, { recursive: true });
  });

  it('should run and cache a simple intent', async () => {
    const source = "target: javascript\n# Simple intent\nreturn 1";
    const result = await runHjx(source, { cache: true, cacheDir });
    
    expect(result.success).toBe(true);
    expect(result.cached).toBe(false);
    expect(result.output).toBe("mocked result");
    expect(existsSync(cacheDir)).toBe(true);
  });

  it('should hit cache on second run', async () => {
    const source = "target: javascript\n# Simple intent\nreturn 1";
    const result = await runHjx(source, { cache: true, cacheDir });
    expect(result.cached).toBe(true);
  });
});
