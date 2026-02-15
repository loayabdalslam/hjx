/**
 * Scope CSS by prefixing each selector with the root scope attribute.
 * Very small implementation: handles simple selectors split by commas.
 */
export function scopeCss(css: string, scope: string): string {
  const prefix = `[data-hjx-scope="${scope}"]`;

  // naive parser: split into rules by }
  const out: string[] = [];
  const parts = css.split("}");
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf("{");
    if (idx === -1) continue;
    const sel = trimmed.slice(0, idx).trim();
    const body = trimmed.slice(idx + 1).trim();

    const scopedSel = sel
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        // If selector already references :root or html/body, just prefix anyway for MVP.
        return `${prefix} ${s}`;
      })
      .join(", ");

    out.push(`${scopedSel} { ${body} }`);
  }
  return out.join("\n") + (out.length ? "\n" : "");
}
