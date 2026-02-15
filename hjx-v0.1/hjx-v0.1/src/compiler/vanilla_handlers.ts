import { HJXHandler } from "../types.js";

/**
 * Compile handler body (tiny DSL) to JS functions.
 * Supported statements:
 * - set x = expr
 * - log "text"
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
      const setm = line.match(/^set\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
      if (setm) {
        const key = setm[1];
        const expr = setm[2];
        if (!allowed.has(key)) {
          bodyJS.push(`  throw new Error("Unknown state key: ${key}");`);
          continue;
        }
        const jsExpr = exprToJS(expr);
        bodyJS.push(`  patch["${key}"] = (${jsExpr});`);
        continue;
      }

      const logm = line.match(/^log\s+(".*"|'[^']*')\s*$/);
      if (logm) {
        bodyJS.push(`  console.log(${logm[1]});`);
        continue;
      }

      // unknown line
      bodyJS.push(`  throw new Error("Unsupported handler statement: ${escapeForJS(line)}");`);
    }

    bodyJS.push(`  ctx.store.set(patch);`);
    bodyJS.push(`}`);

    fns.push(`${JSON.stringify(name)}: ${bodyJS.join("\n")}`);
  }

  return `{\n  ${fns.join(",\n  ")}\n}`;
}

function escapeForJS(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, "\\"");
}

function exprToJS(expr: string): string {
  // Minimal "safe-ish" expression: allow numbers, identifiers, + - * / ( ) and spaces
  // Identifiers map to s.<id>
  const cleaned = expr.trim();
  if (!/^[A-Za-z0-9_\s\+\-\*\/\(\)\.]+$/.test(cleaned)) {
    return `(() => { throw new Error("Invalid expression"); })()`;
  }
  // Replace identifiers with s["id"]
  // Keep numeric literals intact
  return cleaned.replace(/\b([A-Za-z_][A-Za-z0-9_]*)\b/g, (m) => {
    if (m === "true" || m === "false") return m;
    if (/^\d/.test(m)) return m;
    return `s["${m}"]`;
  });
}
