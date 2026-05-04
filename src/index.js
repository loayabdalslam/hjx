export { parse } from './parser/index.js';
export { createProvider } from './providers/index.js';
export { generate, explain, executeCode } from './generator/index.js';
export { addEntry, getHistory, clearHistory, getHistoryPath } from './history/index.js';

// Configuration helpers
import { loadConfig } from './cli/config.js';
export { loadConfig };

/**
 * High-level API to run HJX source string
 * @param {string} source - The .hjx source code
 * @param {object} options - Configuration overrides
 * @returns {Promise<{code: string, output: any, success: boolean}>}
 */
export async function runHjx(source, options = {}) {
  const config = loadConfig(options);
  const provider = createProvider(config);
  
  const parsed = parse(source);
  if (options.target) parsed.target = options.target;
  
  const { code } = await generate(parsed, provider, config);
  const result = executeCode(code, parsed.target, config);
  
  return {
    code,
    output: result.output,
    success: result.success
  };
}
