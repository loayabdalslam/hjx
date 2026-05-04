export { parse } from './parser/index.js';
export { createProvider } from './providers/index.js';
export { generate, explain, executeCode } from './generator/index.js';
export { addEntry, getHistory, clearHistory, getHistoryPath } from './history/index.js';

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

// Configuration helpers
import { loadConfig } from './cli/config.js';
export { loadConfig };

/**
 * High-level API to run HJX source string with optional caching
 * @param {string} source - The .hjx source code
 * @param {object} options - Configuration overrides
 * @returns {Promise<{code: string, output: any, success: boolean, cached: boolean}>}
 */
export async function runHjx(source, options = {}) {
  const config = loadConfig(options);
  const cacheDir = options.cacheDir || join(process.cwd(), '.intent-cache');
  const useCache = options.cache !== false;
  
  // Generate cache key based on source and options
  const hash = createHash('md5').update(source + JSON.stringify(options)).digest('hex');
  const cacheFile = join(cacheDir, `${hash}.json`);

  // 1. Try to load from cache
  if (useCache && existsSync(cacheFile)) {
    try {
      const cachedData = JSON.parse(readFileSync(cacheFile, 'utf8'));
      // Execute the cached code (it might need new inputs)
      const result = executeCode(cachedData.code, cachedData.target, config);
      return {
        code: cachedData.code,
        output: result.output,
        success: result.success,
        cached: true
      };
    } catch (e) {
      console.warn("Failed to load cache, falling back to provider.");
    }
  }

  // 2. Run from provider
  const provider = createProvider(config);
  const parsed = parse(source);
  if (options.target) parsed.target = options.target;
  
  const { code } = await generate(parsed, provider, config);
  const result = executeCode(code, parsed.target, config);
  
  // 3. Save to cache if successful
  if (useCache && result.success) {
    if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
    writeFileSync(cacheFile, JSON.stringify({
      code,
      target: parsed.target,
      timestamp: new Date().toISOString()
    }));
  }
  
  return {
    code,
    output: result.output,
    success: result.success,
    cached: false
  };
}
