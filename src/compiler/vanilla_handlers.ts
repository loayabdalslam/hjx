import { HJXHandler } from "../types.js";

/**
 * Compile handler body (tiny DSL) to JS functions.
 * Supported statements:
 * - set x = expr
 * - log "text"
 * 
 * Expressions support:
 * - State variables: myVar
 * - Array methods: arr.push(val), arr.filter(...)
 * - Context access: ctx.el.dataset.hjxIdx, ctx.store
 */
export function compileHandlersToJS(handlers: Record<string, HJXHandler>, stateKeys: string[]): string {
  const fns: string[] = [];
  const allowed = new Set(stateKeys);

  for (const [name, h] of Object.entries(handlers)) {
    const bodyJS: string[] = [];
    bodyJS.push(`(ctx) => {`);
    bodyJS.push(`  const s = ctx.store.get();`);
    bodyJS.push(`  let patch = {};`);

    for (const line of h.body) {
      const trimmed = line.trim();
      
      // skip empty lines and comments
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const setm = trimmed.match(/^set\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
      if (setm) {
        const key = setm[1];
        const expr = setm[2];
        if (!allowed.has(key)) {
          bodyJS.push(`  throw new Error("Unknown state key: ${key}");`);
          continue;
        }
        const jsExpr = exprToJS(expr, allowed);
        bodyJS.push(`  patch["${key}"] = (${jsExpr});`);
        continue;
      }

      const logm = trimmed.match(/^log\s+(".*"|'[^']*')\s*$/);
      if (logm) {
        bodyJS.push(`  console.log(${logm[1]});`);
        continue;
      }

      // unknown line
      bodyJS.push(`  throw new Error("Unsupported handler statement: ${escapeForJS(trimmed)}");`);
    }

    bodyJS.push(`  ctx.store.set(patch);`);
    bodyJS.push(`}`);

    fns.push(`${JSON.stringify(name)}: ${bodyJS.join("\n")}`);
  }

  return `{\n  ${fns.join(",\n  ")}\n}`;
}

function escapeForJS(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function exprToJS(expr: string, stateKeys: Set<string>): string {
  const cleaned = expr.trim();

  // Handle array.push(value) -> [...array, value]
  const pushMatch = cleaned.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*\.push\s*\(\s*([^)]+)\s*\)/);
  if (pushMatch) {
    const arrayName = pushMatch[1];
    const value = pushMatch[2];
    const arrayExpr = stateKeys.has(arrayName) ? `s["${arrayName}"]` : arrayName;
    const valueExpr = exprToJS(value, stateKeys);
    return `[...${arrayExpr}, ${valueExpr}]`;
  }

  // Handle array.filter(...) -> keep as-is but replace identifiers
  // Simple case: items.filter((_, i) => i !== idx)
  // This will have identifiers replaced below
  
  // Replace identifiers that match state keys with s["key"]
  // Leave everything else alone (numbers, operators, other vars)
  return cleaned.replace(/\b([A-Za-z_][A-Za-z0-9_]*)\b/g, (m) => {
    if (stateKeys.has(m)) return `s["${m}"]`;
    return m;
  });
}
