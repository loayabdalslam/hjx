import { HJXAst, HJXNode, HJXHandler } from "../../types.js";
import { parseHJX } from "../../parser.js";
import { tokenizeHJX, TokenType, Token, TokenError } from "../tokenizer/tokenizer.js";

export enum ErrorType {
  SYNTAX_ERROR = "SYNTAX_ERROR",
  INDENTATION_ERROR = "INDENTATION_ERROR",
  MISSING_TOKEN_ERROR = "MISSING_TOKEN_ERROR",
  UNCLOSED_BLOCK_ERROR = "UNCLOSED_BLOCK_ERROR",
  SEMANTIC_ERROR = "SEMANTIC_ERROR",
  REFERENCE_ERROR = "REFERENCE_ERROR",
}

export enum ErrorSeverity {
  ERROR = "ERROR",
  WARNING = "WARNING",
  INFO = "INFO",
  HINT = "HINT",
}

export interface ParseError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  line: number;
  column: number;
  suggestion: string;
  context: string;
  quickFix?: QuickFix;
}

export interface QuickFix {
  description: string;
  replacement: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
}

export interface RecoveryResult {
  ast: HJXAst;
  errors: ParseError[];
  suggestions: string[];
  partialNodes: HJXNode[];
}

export function parseWithRecovery(source: string, filename = "<input>"): RecoveryResult {
  const errors: ParseError[] = [];
  const suggestions: string[] = [];
  const partialNodes: HJXNode[] = [];

  // First try normal parse
  try {
    const ast = parseHJX(source, filename);
    return { ast, errors: [], suggestions: [], partialNodes: [] };
  } catch (e) {
    // Parse error, enter recovery mode
  }

  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const ast: HJXAst = {
    kind: "HJXAst",
    version: "0.2",
    component: { name: "App" },
    imports: {},
    script: "",
    state: {},
    api: [],
    layout: null,
    style: [],
    styleRaw: "",
    handlers: {},
    computed: {},
    breakpoints: [],
  };

  const indentOf = (s: string) => (s.match(/^\s*/)?.[0].length ?? 0);
  const isSkippable = (s: string) => /^\s*$/.test(s) || /^\s*\/\//.test(s);

  let i = 0;
  let componentName = "App";

  while (i < lines.length) {
    const line = lines[i];
    if (isSkippable(line)) { i++; continue; }

    const trimmed = line.trim();
    const blockStart = i;

    try {
      if (trimmed.startsWith("component ")) {
        const name = trimmed.slice("component ".length).trim();
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
          const suggestion = name.replace(/[^A-Za-z0-9_]/g, "_");
          errors.push({
            type: ErrorType.SYNTAX_ERROR,
            severity: ErrorSeverity.ERROR,
            message: `Invalid component name: '${name}'`,
            line: i + 1,
            column: 1,
            suggestion: `Use a valid identifier. Try: '${suggestion}'`,
            context: line,
            quickFix: {
              description: `Fix component name to '${suggestion}'`,
              replacement: `component ${suggestion}`,
              line: i + 1, column: 1, endLine: i + 1, endColumn: line.length + 1,
            },
          });
          ast.component.name = suggestion;
        } else {
          componentName = name;
          ast.component.name = name;
        }
        i++;
        continue;
      }

      if (trimmed === "state:" || trimmed === "state") {
        if (trimmed === "state") {
          errors.push({
            type: ErrorType.MISSING_TOKEN_ERROR,
            severity: ErrorSeverity.ERROR,
            message: "Missing colon after 'state'",
            line: i + 1,
            column: line.indexOf("state") + 1,
            suggestion: "Add ':' after 'state'",
            context: line,
            quickFix: {
              description: "Add missing colon",
              replacement: "state:",
              line: i + 1, column: line.indexOf("state") + 1,
              endLine: i + 1, endColumn: line.indexOf("state") + 6,
            },
          });
        }
        i++;
        while (i < lines.length) {
          const l = lines[i];
          if (isSkippable(l)) { i++; continue; }
          if (indentOf(l) === 0) break;
          const t = l.trim();
          const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
          if (!m) {
            errors.push(recoverStateLine(t, l, i));
            i++;
            continue;
          }
          try {
            ast.state[m[1]] = parseStateValueSafe(m[2].trim());
          } catch {
            errors.push({
              type: ErrorType.SYNTAX_ERROR,
              severity: ErrorSeverity.WARNING,
              message: `Invalid state value for '${m[1]}'`,
              line: i + 1,
              column: 1,
              suggestion: `Check value syntax: ${m[2].trim()}`,
              context: l,
            });
          }
          i++;
        }
        continue;
      }

      if (trimmed === "layout:" || trimmed === "layout") {
        if (trimmed === "layout") {
          errors.push({
            type: ErrorType.MISSING_TOKEN_ERROR,
            severity: ErrorSeverity.ERROR,
            message: "Missing colon after 'layout'",
            line: i + 1,
            column: 1,
            suggestion: "Add ':' after 'layout'",
            context: line,
          });
        }
        i++;
        try {
          const layoutNodes = parseLayoutSafe(lines, i, filename, errors);
          ast.layout = layoutNodes.node;
          i = layoutNodes.endIndex;
        } catch (e) {
          // Skip to next block boundary
          while (i < lines.length) {
            const l = lines[i];
            if (!isSkippable(l) && indentOf(l) === 0 && l.trim().match(/^(state:|style:|handlers:|imports:|script:|component )/)) {
              break;
            }
            i++;
          }
          errors.push({
            type: ErrorType.UNCLOSED_BLOCK_ERROR,
            severity: ErrorSeverity.ERROR,
            message: "Layout block could not be fully parsed",
            line: blockStart + 1,
            column: 1,
            suggestion: "Check indentation and syntax in layout block",
            context: "layout:",
          });
        }
        continue;
      }

      if (trimmed === "style:" || trimmed === "style") {
        if (trimmed === "style") {
          errors.push({
            type: ErrorType.MISSING_TOKEN_ERROR,
            severity: ErrorSeverity.ERROR,
            message: "Missing colon after 'style'",
            line: i + 1, column: 1,
            suggestion: "Add ':' after 'style'",
            context: line,
          });
        }
        i++;
        const cssLines: string[] = [];
        while (i < lines.length) {
          const l = lines[i];
          if (isSkippable(l)) { cssLines.push(""); i++; continue; }
          if (indentOf(l) === 0) break;
          cssLines.push(l.slice(2));
          i++;
        }
        ast.styleRaw = cssLines.join("\n").trimEnd() + "\n";
        continue;
      }

      if (trimmed === "handlers:" || trimmed === "handlers") {
        if (trimmed === "handlers") {
          errors.push({
            type: ErrorType.MISSING_TOKEN_ERROR,
            severity: ErrorSeverity.ERROR,
            message: "Missing colon after 'handlers'",
            line: i + 1, column: 1,
            suggestion: "Add ':' after 'handlers'",
            context: line,
          });
        }
        i++;
        while (i < lines.length) {
          const l = lines[i];
          if (isSkippable(l)) { i++; continue; }
          if (indentOf(l) === 0) break;
          const t = l.trim();
          const hm = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*$/);
          if (!hm) {
            const fixMatch = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*$/);
            if (fixMatch) {
              errors.push({
                type: ErrorType.MISSING_TOKEN_ERROR,
                severity: ErrorSeverity.ERROR,
                message: `Missing colon after handler name '${fixMatch[1]}'`,
                line: i + 1, column: 1,
                suggestion: `Add ':' after '${fixMatch[1]}'`,
                context: l,
                quickFix: {
                  description: "Add missing colon",
                  replacement: `${fixMatch[1]}:`,
                  line: i + 1, column: 1, endLine: i + 1, endColumn: l.length + 1,
                },
              });
              ast.handlers[fixMatch[1]] = { name: fixMatch[1], body: [] };
            }
            i++;
            continue;
          }
          const name = hm[1];
          i++;
          const body: string[] = [];
          while (i < lines.length) {
            const bl = lines[i];
            if (isSkippable(bl)) { i++; continue; }
            if (indentOf(bl) <= 2) break;
            body.push(bl.trim());
            i++;
          }
          ast.handlers[name] = { name, body };
        }
        continue;
      }

      if (trimmed === "imports:") {
        i++;
        while (i < lines.length) {
          const l = lines[i];
          if (isSkippable(l)) { i++; continue; }
          if (indentOf(l) === 0) break;
          const t = l.trim();
          const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s+from\s+(.+)$/);
          if (!m) {
            errors.push({
              type: ErrorType.SYNTAX_ERROR,
              severity: ErrorSeverity.ERROR,
              message: `Invalid import statement`,
              line: i + 1, column: 1,
              suggestion: "Expected: Alias from \"path\"",
              context: l,
            });
            i++;
            continue;
          }
          ast.imports[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
          i++;
        }
        continue;
      }

      // Unknown line - skip with error
      errors.push({
        type: ErrorType.SYNTAX_ERROR,
        severity: ErrorSeverity.WARNING,
        message: `Unrecognized statement: '${trimmed}'`,
        line: i + 1, column: 1,
        suggestion: "Check for typos or missing block headers",
        context: line,
      });
      i++;
    } catch (e) {
      // Recovery: skip to next block boundary
      errors.push({
        type: ErrorType.SYNTAX_ERROR,
        severity: ErrorSeverity.ERROR,
        message: `Parse error: ${(e as Error).message}`,
        line: i + 1, column: 1,
        suggestion: "Check syntax near this line",
        context: line,
      });
      while (i < lines.length) {
        i++;
        if (i < lines.length && indentOf(lines[i]) === 0 && lines[i].trim().match(/^(state:|layout:|style:|handlers:|imports:|script:|component )/)) {
          break;
        }
      }
    }
  }

  // Generate suggestions
  if (!ast.layout) {
    suggestions.push("Component is missing a layout block. Add 'layout:' with UI elements.");
  }
  if (Object.keys(ast.handlers).length === 0 && hasEventBindings(source)) {
    suggestions.push("Component has event bindings but no handlers defined.");
  }
  for (const err of errors) {
    if (err.type === ErrorType.MISSING_TOKEN_ERROR) {
      suggestions.push(err.suggestion);
    }
  }

  return { ast, errors: [...new Map(errors.map(e => [e.message, e])).values()], suggestions, partialNodes };
}

function recoverStateLine(trimmed: string, line: string, lineNo: number): ParseError {
  const fixMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)(?:\s+(.+))?$/);
  if (fixMatch) {
    const name = fixMatch[1];
    const value = fixMatch[2];
    if (!value) {
      return {
        type: ErrorType.SYNTAX_ERROR,
        severity: ErrorSeverity.ERROR,
        message: `State variable '${name}' has no value assignment`,
        line: lineNo + 1, column: 1,
        suggestion: `Add a value: ${name} = <value>`,
        context: line,
        quickFix: {
          description: "Add default value",
          replacement: `${name} = ""`,
          line: lineNo + 1, column: 1, endLine: lineNo + 1, endColumn: line.length + 1,
        },
      };
    }
  }
  return {
    type: ErrorType.SYNTAX_ERROR,
    severity: ErrorSeverity.ERROR,
    message: `Invalid state line: '${trimmed}'`,
    line: lineNo + 1, column: 1,
    suggestion: "Expected format: name = value",
    context: line,
  };
}

function parseStateValueSafe(raw: string): any {
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) return raw.slice(1, -1);
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/.test(raw)) return Number(raw);
  if (raw.startsWith("[") || raw.startsWith("{")) {
    try { return JSON.parse(raw.replace(/'/g, '"')); } catch { return raw; }
  }
  return raw;
}

function parseLayoutSafe(lines: string[], startIndex: number, filename: string, errors: ParseError[]): { node: HJXNode | null; endIndex: number } {
  const indentOf = (s: string) => (s.match(/^\s*/)?.[0].length ?? 0);
  const isSkippable = (s: string) => /^\s*$/.test(s) || /^\s*\/\//.test(s);

  let i = startIndex;
  const nodes: HJXNode[] = [];

  function parseNode(lineNo: number): { node: HJXNode; hasChildren: boolean } | null {
    const line = lines[lineNo];
    const t = line.trim();

    const ifMatch = t.match(/^if\s*\((.+)\)\s*:\s*$/);
    if (ifMatch) {
      return {
        node: { kind: "if", tag: "if", condition: ifMatch[1].trim(), classes: [], attrs: {}, text: null, events: {}, bind: null, children: [] },
        hasChildren: true,
      };
    }

    if (t === "else:") {
      return {
        node: { kind: "else", tag: "else", classes: [], attrs: {}, text: null, events: {}, bind: null, children: [] },
        hasChildren: true,
      };
    }

    const forMatch = t.match(/^for\s*\(([a-zA-Z0-9_]+)\s+in\s+([a-zA-Z0-9_.]+)\)\s*:\s*$/);
    if (forMatch) {
      return {
        node: { kind: "for", tag: "for", iterator: { item: forMatch[1], list: forMatch[2] }, classes: [], attrs: {}, text: null, events: {}, bind: null, children: [] },
        hasChildren: true,
      };
    }

    const containerMatch = t.match(/^([a-zA-Z][a-zA-Z0-9_-]*)(#[A-Za-z_][A-Za-z0-9_-]*)?(\.[A-Za-z0-9_/:-]+)*(\s*\([^\)]*\))?\s*:\s*$/);
    if (containerMatch) {
      const tag = containerMatch[1];
      const cssId = containerMatch[2] ? containerMatch[2].slice(1) : undefined;
      const before = t.split("(")[0].split(":")[0].trim();
      const classes = before.split(".").slice(1).map(s => s.trim()).filter(Boolean);
      return {
        node: { kind: "node", tag, id: cssId, classes, attrs: {}, text: null, events: {}, bind: null, children: [] },
        hasChildren: true,
      };
    }

    const leafMatch = t.match(/^([a-zA-Z][a-zA-Z0-9_-]*)(#[A-Za-z_][A-Za-z0-9_-]*)?(\.[A-Za-z0-9_/:-]+)*(\s*\([^\)]*\))?\s*:\s*(.+)$/);
    if (leafMatch) {
      const tag = leafMatch[1];
      const cssId = leafMatch[2] ? leafMatch[2].slice(1) : undefined;
      const before = t.split("(")[0].split(":")[0].trim();
      const classes = before.split(".").slice(1).map(s => s.trim()).filter(Boolean);
      const rhs = leafMatch[5].trim();
      const text = (rhs.startsWith('"') && rhs.endsWith('"')) || (rhs.startsWith("'") && rhs.endsWith("'")) ? rhs.slice(1, -1) : rhs;
      return {
        node: { kind: "node", tag, id: cssId, classes, attrs: {}, text, events: {}, bind: null, children: [] },
        hasChildren: false,
      };
    }

    const simpleMatch = t.match(/^([a-zA-Z][a-zA-Z0-9_-]*)(#[A-Za-z_][A-Za-z0-9_-]*)?(\.[A-Za-z0-9_/:-]+)*(\s*\([^\)]*\))?$/);
    if (simpleMatch) {
      const tag = simpleMatch[1];
      const cssId = simpleMatch[2] ? simpleMatch[2].slice(1) : undefined;
      const before = t.split("(")[0].trim();
      const classes = before.split(".").slice(1).map(s => s.trim()).filter(Boolean);
      return {
        node: { kind: "node", tag, id: cssId, classes, attrs: {}, text: null, events: {}, bind: null, children: [] },
        hasChildren: false,
      };
    }

    errors.push({
      type: ErrorType.SYNTAX_ERROR,
      severity: ErrorSeverity.ERROR,
      message: `Invalid layout line: '${t}'`,
      line: lineNo + 1, column: 1,
      suggestion: "Check HJX layout syntax",
      context: line,
    });
    return null;
  }

  const baseIndent = 2;
  while (i < lines.length) {
    const line = lines[i];
    if (isSkippable(line)) { i++; continue; }
    if (indentOf(line) < baseIndent) break;

    try {
      const result = parseNode(i);
      if (!result) { i++; continue; }
      i++;
      if (result.hasChildren) {
        let j = i;
        while (j < lines.length) {
          if (isSkippable(lines[j])) { j++; continue; }
          if (indentOf(lines[j]) > baseIndent) {
            const children = parseChildren(lines, j, baseIndent + 2, errors);
            result.node.children = children.nodes;
            i = children.endIndex;
          }
          break;
        }
      }
      nodes.push(result.node);
    } catch {
      i++;
    }
  }

  const root = nodes.length === 1 ? nodes[0] : {
    kind: "node" as const, tag: "view", id: "root", classes: [], attrs: {},
    text: null, events: {}, bind: null, children: nodes,
  };
  return { node: root, endIndex: i };
}

function parseChildren(lines: string[], startIdx: number, minIndent: number, errors: ParseError[]): { nodes: HJXNode[]; endIndex: number } {
  const indentOf = (s: string) => (s.match(/^\s*/)?.[0].length ?? 0);
  const isSkippable = (s: string) => /^\s*$/.test(s) || /^\s*\/\//.test(s);
  const nodes: HJXNode[] = [];
  let i = startIdx;

  while (i < lines.length) {
    const line = lines[i];
    if (isSkippable(line)) { i++; continue; }
    if (indentOf(line) < minIndent) break;
    if (indentOf(line) !== minIndent) { i++; continue; }

    const t = line.trim();
    let node: HJXNode | null = null;
    let hasChildren = false;

    const ifMatch = t.match(/^if\s*\((.+)\)\s*:\s*$/);
    if (ifMatch) {
      node = { kind: "if", tag: "if", condition: ifMatch[1].trim(), classes: [], attrs: {}, text: null, events: {}, bind: null, children: [] };
      hasChildren = true;
    } else if (t === "else:") {
      node = { kind: "else", tag: "else", classes: [], attrs: {}, text: null, events: {}, bind: null, children: [] };
      hasChildren = true;
    } else {
      const forMatch = t.match(/^for\s*\(([a-zA-Z0-9_]+)\s+in\s+([a-zA-Z0-9_.]+)\)\s*:\s*$/);
      if (forMatch) {
        node = { kind: "for", tag: "for", iterator: { item: forMatch[1], list: forMatch[2] }, classes: [], attrs: {}, text: null, events: {}, bind: null, children: [] };
        hasChildren = true;
      } else {
        const containerMatch = t.match(/^([a-zA-Z][a-zA-Z0-9_-]*)(#[A-Za-z_][A-Za-z0-9_-]*)?(\.[A-Za-z0-9_/:-]+)*(\s*\([^\)]*\))?\s*:\s*$/);
        if (containerMatch) {
          const tag = containerMatch[1];
          const cssId = containerMatch[2] ? containerMatch[2].slice(1) : undefined;
          const before = t.split("(")[0].split(":")[0].trim();
          const classes = before.split(".").slice(1).map(s => s.trim()).filter(Boolean);
          node = { kind: "node", tag, id: cssId, classes, attrs: {}, text: null, events: {}, bind: null, children: [] };
          hasChildren = true;
        } else {
          const leafMatch = t.match(/^([a-zA-Z][a-zA-Z0-9_-]*)(#[A-Za-z_][A-Za-z0-9_-]*)?(\.[A-Za-z0-9_/:-]+)*(\s*\([^\)]*\))?\s*:\s*(.+)$/);
          if (leafMatch) {
            const tag = leafMatch[1];
            const cssId = leafMatch[2] ? leafMatch[2].slice(1) : undefined;
            const before = t.split("(")[0].split(":")[0].trim();
            const classes = before.split(".").slice(1).map(s => s.trim()).filter(Boolean);
            const rhs = leafMatch[5].trim();
            const text = (rhs.startsWith('"') && rhs.endsWith('"')) || (rhs.startsWith("'") && rhs.endsWith("'")) ? rhs.slice(1, -1) : rhs;
            node = { kind: "node", tag, id: cssId, classes, attrs: {}, text, events: {}, bind: null, children: [] };
          } else {
            const simpleMatch = t.match(/^([a-zA-Z][a-zA-Z0-9_-]*)(#[A-Za-z_][A-Za-z0-9_-]*)?(\.[A-Za-z0-9_/:-]+)*(\s*\([^\)]*\))?$/);
            if (simpleMatch) {
              const tag = simpleMatch[1];
              const cssId = simpleMatch[2] ? simpleMatch[2].slice(1) : undefined;
              const before = t.split("(")[0].trim();
              const classes = before.split(".").slice(1).map(s => s.trim()).filter(Boolean);
              node = { kind: "node", tag, id: cssId, classes, attrs: {}, text: null, events: {}, bind: null, children: [] };
            }
          }
        }
      }
    }

    if (!node) { i++; continue; }
    i++;

    if (hasChildren) {
      let j = i;
      while (j < lines.length) {
        if (isSkippable(lines[j])) { j++; continue; }
        if (indentOf(lines[j]) > minIndent) {
          const children = parseChildren(lines, j, minIndent + 2, errors);
          node.children = children.nodes;
          i = children.endIndex;
        }
        break;
      }
    }
    nodes.push(node);
  }

  return { nodes, endIndex: i };
}

function hasEventBindings(source: string): boolean {
  return /on\s+\w+\s*->/.test(source);
}
