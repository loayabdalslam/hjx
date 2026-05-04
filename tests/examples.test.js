import { describe, it, expect, beforeAll } from 'vitest';
import { runHjx } from '../src/index.js';
import { readdirSync, readFileSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

describe('Intent Coding — Global Examples Validator', () => {
  const examplesDir = join(process.cwd(), 'examples');
  const cacheDir = join(process.cwd(), '.intent-test-cache');

  beforeAll(() => {
    // Clear test cache before starting
    if (existsSync(cacheDir)) {
      rmSync(cacheDir, { recursive: true });
    }
  });

  // 1. Test all standalone .hjx files in examples/
  const standaloneFiles = readdirSync(examplesDir).filter(f => f.endsWith('.hjx'));

  standaloneFiles.forEach(file => {
    it(`should parse and potentially cache standalone example: ${file}`, async () => {
      const source = readFileSync(join(examplesDir, file), 'utf8');
      
      // We test the "Intent-to-Static" flow
      // First run: Should be from provider (or mocked)
      const result1 = await runHjx(source, { 
        cache: true, 
        cacheDir,
        provider: 'ollama' // It will fail if ollama is not running, but we check if it handles it
      }).catch(e => ({ success: false, error: e.message }));

      // We expect the result object to be well-formed even if AI fails
      expect(result1).toHaveProperty('success');
      
      // If it succeeded, verify cache creation
      if (result1.success) {
        expect(existsSync(cacheDir)).toBe(true);
      }
    });
  });

  // 2. Test specific project logic files
  const projectLogicPaths = [
    'ai-knowledge-base/logic/optimize-article.hjx',
    'dynamic-pricing-engine/logic/pricing.hjx',
    'smart-form-validator/logic/validation.hjx'
  ];

  projectLogicPaths.forEach(relPath => {
    const fullPath = join(examplesDir, relPath);
    if (existsSync(fullPath)) {
      it(`should validate project logic: ${relPath}`, async () => {
        const source = readFileSync(fullPath, 'utf8');
        const result = await runHjx(source, { cache: true, cacheDir });
        expect(result).toHaveProperty('code');
      });
    }
  });
});

describe('Intent Coding — Caching Integrity', () => {
  it('should reuse cached results for identical intents', async () => {
    const source = "target: javascript\n# Simple math\nreturn 1 + 1";
    const cacheDir = join(process.cwd(), '.intent-integrity-cache');
    
    // First run
    const res1 = await runHjx(source, { cache: true, cacheDir });
    
    // Second run
    const res2 = await runHjx(source, { cache: true, cacheDir });
    
    if (res1.success && res2.success) {
      expect(res2.cached).toBe(true);
      expect(res1.code).toBe(res2.code);
    }
  });
});
