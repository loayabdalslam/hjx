import { HJXAst, HJXNode, HJXHandler, HJXStateValue } from "../../types.js";
import { parseHJX } from "../../parser.js";

export interface FormatOptions {
  indent: string;
  quoteStyle: "double" | "single";
  sortImports: boolean;
  normalizeSpacing: boolean;
  removeEmptyLines: boolean;
  compactCSS: boolean;
}

const DEFAULT_OPTIONS: FormatOptions = {
  indent: "  ",
  quoteStyle: "double",
  sortImports: true,
  normalizeSpacing: true,
  removeEmptyLines: false,
  compactCSS: false,
};

export interface DiffLine {
  type: "added" | "removed" | "unchanged";
  line: string;
  lineNo: number;
}

export class CanonicalFormatter {
  private options: FormatOptions;

  constructor(options: Partial<FormatOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  format(source: string): string {
    const ast = parseHJX(source);
    return this.formatAST(ast);
  }

  formatAST(ast: HJXAst): string {
    const lines: string[] = [];
    const q = this.options.quoteStyle === "double" ? '"' : "'";

    // Component declaration
    lines.push(`component ${ast.component.name}`);
    lines.push("");

    // Imports (sorted)
    if (Object.keys(ast.imports).length > 0) {
      lines.push("imports:");
      let entries = Object.entries(ast.imports);
      if (this.options.sortImports) {
        entries = entries.sort(([a], [b]) => a.localeCompare(b));
      }
      for (const [alias, path] of entries) {
        lines.push(`${this.options.indent}${alias} from ${q}${path}${q}`);
      }
      lines.push("");
    }

    // Script
    if (ast.script.trim()) {
      lines.push("script:");
      for (const line of ast.script.split("\n")) {
        if (line.trim()) {
          lines.push(`${this.options.indent}${line}`);
        }
      }
      lines.push("");
    }

    // State
    if (Object.keys(ast.state).length > 0) {
      lines.push("state:");
      for (const [key, value] of Object.entries(ast.state)) {
        lines.push(`${this.options.indent}${key} = ${this.formatValue(value, q)}`);
      }
      lines.push("");
    }

    // Computed
    if (Object.keys(ast.computed).length > 0) {
      lines.push("computed:");
      for (const [key, expr] of Object.entries(ast.computed)) {
        lines.push(`${this.options.indent}${key} = ${expr}`);
      }
      lines.push("");
    }

    // Layout
    if (ast.layout) {
      lines.push("layout:");
      this.formatNode(ast.layout, lines, 1, q);
      lines.push("");
    }

    // Style
    if (ast.style.length > 0 || ast.styleRaw.trim()) {
      lines.push("style:");
      const cssLines = ast.styleRaw.split("\n").filter((l: string) => l.trim());
      for (const line of cssLines) {
        lines.push(`${this.options.indent}${line}`);
      }
      lines.push("");
    }

    // Handlers
    if (Object.keys(ast.handlers).length > 0) {
      lines.push("handlers:");
      for (const [name, handler] of Object.entries(ast.handlers)) {
        lines.push(`${this.options.indent}${name}:`);
        for (const stmt of handler.body) {
          lines.push(`${this.options.indent}${this.options.indent}${stmt}`);
        }
      }
    }

    let result = lines.join("\n");

    // Clean up trailing whitespace
    result = result.replace(/\s+$/gm, "");

    // Remove excessive blank lines (more than 2)
    result = result.replace(/\n{3,}/g, "\n\n");

    // Ensure file ends with single newline
    result = result.trimEnd() + "\n";

    return result;
  }

  private formatNode(node: HJXNode, lines: string[], depth: number, q: string): void {
    const indent = this.options.indent.repeat(depth);
    let line = indent;

    // Tag
    line += node.tag;

    // ID
    if (node.id) {
      line += `#${node.id}`;
    }

    // Classes
    for (const cls of node.classes) {
      line += `.${cls}`;
    }

    // Paren content (events, bindings, attrs)
    const parenParts: string[] = [];
    for (const [event, handler] of Object.entries(node.events)) {
      parenParts.push(`on ${event} -> ${handler}`);
    }
    if (node.bind) {
      parenParts.push(`bind value <-> ${node.bind.state}`);
    }
    for (const [key, val] of Object.entries(node.attrs)) {
      if (val === "true") {
        parenParts.push(key);
      } else {
        parenParts.push(`${key}=${q}${val}${q}`);
      }
    }

    if (parenParts.length > 0) {
      line += ` (${parenParts.join(" ")})`;
    }

    // Text or colon
    if (node.text !== null) {
      line += `: ${q}${node.text}${q}`;
      lines.push(line);
    } else {
      line += ":";
      lines.push(line);
    }

    // Children
    for (const child of node.children) {
      this.formatNode(child, lines, depth + 1, q);
    }
  }

  private formatValue(value: HJXStateValue, q: string): string {
    if (typeof value === "string") return `${q}${value}${q}`;
    if (typeof value === "boolean") return String(value);
    if (typeof value === "number") return String(value);
    return JSON.stringify(value);
  }

  diff(original: string, formatted: string): DiffLine[] {
    const origLines = original.split("\n");
    const fmtLines = formatted.split("\n");
    const result: DiffLine[] = [];

    const maxLen = Math.max(origLines.length, fmtLines.length);
    for (let i = 0; i < maxLen; i++) {
      const orig = origLines[i] ?? "";
      const fmt = fmtLines[i] ?? "";
      if (orig === fmt) {
        result.push({ type: "unchanged", line: orig, lineNo: i + 1 });
      } else {
        if (orig) result.push({ type: "removed", line: orig, lineNo: i + 1 });
        if (fmt) result.push({ type: "added", line: fmt, lineNo: i + 1 });
      }
    }

    return result;
  }
}

export function formatHJX(source: string, options?: Partial<FormatOptions>): string {
  return new CanonicalFormatter(options).format(source);
}
