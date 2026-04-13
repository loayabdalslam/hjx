import { HJXAst, HJXNode, HJXHandler, HJXStateValue } from "../../types.js";
import { tokenizeHJX, Token, TokenType } from "../tokenizer/tokenizer.js";

export interface Position {
  line: number;
  column: number;
  offset: number;
}

export interface SourceRange {
  start: Position;
  end: Position;
  snippet: string;
}

export interface EnhancedNode extends HJXNode {
  range: SourceRange;
  path: string;
  depth: number;
  parentId: string | null;
  uid: string;
  semanticType?: string;
  dataType?: string;
}

export interface SymbolInfo {
  name: string;
  type: "state" | "handler" | "import" | "computed" | "component" | "iterator" | "param";
  scope: string;
  line: number;
  column: number;
  dataType?: string;
  usages: Position[];
}

export interface EnhancedHandler extends HJXHandler {
  range: SourceRange;
  symbols: string[];
  complexity: number;
}

export interface EnhancedAST extends HJXAst {
  enhanced: true;
  ranges: Record<string, SourceRange>;
  nodes: EnhancedNode[];
  symbolTable: SymbolInfo[];
  componentRange: SourceRange;
  stateRange: SourceRange;
  layoutRange: SourceRange;
  styleRange: SourceRange;
  handlersRange: SourceRange;
  importsRange: SourceRange;
}

let nodeIdCounter = 0;

function makeId(): string {
  return `n${++nodeIdCounter}`;
}

function positionAt(source: string, offset: number): Position {
  const before = source.substring(0, offset);
  const lines = before.split("\n");
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
    offset,
  };
}

function findSnippet(source: string, startLine: number, endLine: number): string {
  const lines = source.split("\n");
  return lines.slice(startLine - 1, endLine).join("\n");
}

export function parseEnhanced(source: string, filename = "<input>"): EnhancedAST {
  nodeIdCounter = 0;
  const tokens = tokenizeHJX(source);
  const lines = source.replace(/\r\n/g, "\n").split("\n");

  const enhancedNodes: EnhancedNode[] = [];
  const symbolTable: SymbolInfo[] = [];
  const ranges: Record<string, SourceRange> = {};

  const indentOf = (s: string) => (s.match(/^\s*/)?.[0].length ?? 0);
  const isSkippable = (s: string) => /^\s*$/.test(s) || /^\s*\/\//.test(s);

  let componentName = "App";
  let i = 0;

  const ast: EnhancedAST = {
    kind: "HJXAst",
    version: "0.2",
    component: { name: componentName },
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
    enhanced: true,
    ranges,
    nodes: [],
    symbolTable: [],
    componentRange: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 1, offset: 0 }, snippet: "" },
    stateRange: { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: 0, offset: 0 }, snippet: "" },
    layoutRange: { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: 0, offset: 0 }, snippet: "" },
    styleRange: { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: 0, offset: 0 }, snippet: "" },
    handlersRange: { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: 0, offset: 0 }, snippet: "" },
    importsRange: { start: { line: 0, column: 0, offset: 0 }, end: { line: 0, column: 0, offset: 0 }, snippet: "" },
  };

  function err(msg: string, lineNo: number): never {
    throw new Error(`${filename}:${lineNo + 1}: ${msg}`);
  }

  function makeRange(startLine: number, endLine: number): SourceRange {
    const snippet = findSnippet(source, startLine + 1, endLine + 1);
    return {
      start: positionAt(source, source.split("\n").slice(0, startLine).join("\n").length + (startLine > 0 ? 1 : 0)),
      end: positionAt(source, source.split("\n").slice(0, endLine + 1).join("\n").length),
      snippet,
    };
  }

  function addSymbol(name: string, type: SymbolInfo["type"], scope: string, line: number, column: number, dataType?: string): void {
    const existing = symbolTable.find(s => s.name === name && s.scope === scope);
    if (!existing) {
      symbolTable.push({ name, type, scope, line, column, dataType, usages: [{ line, column, offset: 0 }] });
    }
  }

  function addEnhancedNode(node: EnhancedNode): void {
    enhancedNodes.push(node);
  }

  while (i < lines.length) {
    const line = lines[i];
    if (isSkippable(line)) { i++; continue; }

    const trimmed = line.trim();
    const startLine = i;

    if (trimmed.startsWith("component ")) {
      const name = trimmed.slice("component ".length).trim();
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) err("Invalid component name", i);
      componentName = name;
      ast.component.name = name;
      ranges["component"] = makeRange(startLine, startLine);
      ast.componentRange = ranges["component"];
      addSymbol(name, "component", "global", i + 1, line.indexOf("component") + 1);
      i++;
      continue;
    }

    if (trimmed === "state:") {
      const stateStart = i;
      i++;
      while (i < lines.length) {
        const l = lines[i];
        if (isSkippable(l)) { i++; continue; }
        if (indentOf(l) === 0) break;
        const t = l.trim();
        const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
        if (!m) err("Invalid state line", i);
        const key = m[1];
        const raw = m[2].trim();
        ast.state[key] = parseStateValue(raw, () => err(`Invalid state value: ${raw}`, i));
        addSymbol(key, "state", "state", i + 1, l.indexOf(key) + 1, inferType(raw));
        i++;
      }
      ranges["state"] = makeRange(stateStart, i - 1);
      ast.stateRange = ranges["state"];
      continue;
    }

    if (trimmed === "computed:") {
      const compStart = i;
      i++;
      while (i < lines.length) {
        const l = lines[i];
        if (isSkippable(l)) { i++; continue; }
        if (indentOf(l) === 0) break;
        const t = l.trim();
        const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
        if (!m) err("Invalid computed line", i);
        const key = m[1];
        const raw = m[2].trim();
        ast.computed[key] = (raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))
          ? raw.slice(1, -1) : raw;
        addSymbol(key, "computed", "computed", i + 1, l.indexOf(key) + 1);
        i++;
      }
      ranges["computed"] = makeRange(compStart, i - 1);
      continue;
    }

    if (trimmed === "imports:") {
      const impStart = i;
      i++;
      while (i < lines.length) {
        const l = lines[i];
        if (isSkippable(l)) { i++; continue; }
        if (indentOf(l) === 0) break;
        const t = l.trim();
        const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s+from\s+(.+)$/);
        if (!m) err("Invalid import line", i);
        const key = m[1];
        const raw = m[2].trim();
        ast.imports[key] = raw.replace(/^["']|["']$/g, "");
        addSymbol(key, "import", "imports", i + 1, l.indexOf(key) + 1);
        i++;
      }
      ranges["imports"] = makeRange(impStart, i - 1);
      ast.importsRange = ranges["imports"];
      continue;
    }

    if (trimmed === "layout:") {
      const layoutStart = i;
      i++;
      const baseIndent = 2;

      function parseNode(lineNo: number): { node: EnhancedNode; hasChildren: boolean } {
        const l = lines[lineNo];
        const t = l.trim();
        const depth = indentOf(l) / 2;

        const ifMatch = t.match(/^if\s*\((.+)\)\s*:\s*$/);
        if (ifMatch) {
          const id = makeId();
          const condition = ifMatch[1].trim();
          addSymbol(condition.replace(/[!()]/g, ""), "param", "layout", lineNo + 1, l.indexOf(condition) + 1);
          const node: EnhancedNode = {
            kind: "if", tag: "if", condition, classes: [], attrs: {}, text: null, events: {}, bind: null, children: [],
            range: makeRange(lineNo, lineNo), path: `layout.${id}`, depth, parentId: null, uid: id,
            semanticType: "control_flow",
          };
          return { node, hasChildren: true };
        }

        if (t === "else:") {
          const id = makeId();
          const node: EnhancedNode = {
            kind: "else", tag: "else", classes: [], attrs: {}, text: null, events: {}, bind: null, children: [],
            range: makeRange(lineNo, lineNo), path: `layout.${id}`, depth, parentId: null, uid: id,
            semanticType: "control_flow",
          };
          return { node, hasChildren: true };
        }

        const forMatch = t.match(/^for\s*\(([a-zA-Z0-9_]+)\s+in\s+([a-zA-Z0-9_.]+)\)\s*:\s*$/);
        if (forMatch) {
          const id = makeId();
          addSymbol(forMatch[1], "iterator", "layout", lineNo + 1, l.indexOf(forMatch[1]) + 1);
          const node: EnhancedNode = {
            kind: "for", tag: "for", iterator: { item: forMatch[1], list: forMatch[2] },
            classes: [], attrs: {}, text: null, events: {}, bind: null, children: [],
            range: makeRange(lineNo, lineNo), path: `layout.${id}`, depth, parentId: null, uid: id,
            semanticType: "control_flow",
          };
          return { node, hasChildren: true };
        }

        const containerMatch = t.match(/^([a-zA-Z][a-zA-Z0-9_-]*)(#[A-Za-z_][A-Za-z0-9_-]*)?(\.[A-Za-z0-9_/:-]+)*(\s*\([^\)]*\))?\s*:\s*$/);
        if (containerMatch) {
          const tag = containerMatch[1];
          const cssId = containerMatch[2] ? containerMatch[2].slice(1) : undefined;
          const classes = extractClasses(t);
          const paren = containerMatch[4]?.trim() ?? "";
          const id = makeId();
          const node: EnhancedNode = {
            kind: "node", tag, id: cssId, classes, attrs: {}, text: null, events: {}, bind: null, children: [],
            range: makeRange(lineNo, lineNo), path: `layout.${id}`, depth, parentId: null, uid: id,
            semanticType: classifyElement(tag),
          };
          if (paren) parseParenContent(node, paren.slice(1, -1), lineNo);
          return { node, hasChildren: true };
        }

        const leafMatch = t.match(/^([a-zA-Z][a-zA-Z0-9_-]*)(#[A-Za-z_][A-Za-z0-9_-]*)?(\.[A-Za-z0-9_/:-]+)*(\s*\([^\)]*\))?\s*:\s*(.+)$/);
        if (leafMatch) {
          const tag = leafMatch[1];
          const cssId = leafMatch[2] ? leafMatch[2].slice(1) : undefined;
          const classes = extractClasses(t);
          const paren = leafMatch[4]?.trim() ?? "";
          const rhs = leafMatch[5].trim();
          const nid = makeId();
          const node: EnhancedNode = {
            kind: "node", tag, id: cssId, classes, attrs: {},
            text: parseMaybeString(rhs, () => err("Expected string after ':'", lineNo)),
            events: {}, bind: null, children: [],
            range: makeRange(lineNo, lineNo), path: `layout.${nid}`, depth, parentId: null, uid: nid,
            semanticType: classifyElement(tag),
          };
          if (paren) parseParenContent(node, paren.slice(1, -1), lineNo);
          return { node, hasChildren: false };
        }

        const simpleMatch = t.match(/^([a-zA-Z][a-zA-Z0-9_-]*)(#[A-Za-z_][A-Za-z0-9_-]*)?(\.[A-Za-z0-9_/:-]+)*(\s*\([^\)]*\))?$/);
        if (simpleMatch) {
          const tag = simpleMatch[1];
          const cssId = simpleMatch[2] ? simpleMatch[2].slice(1) : undefined;
          const classes = extractClasses(t);
          const paren = simpleMatch[4]?.trim() ?? "";
          const nid = makeId();
          const node: EnhancedNode = {
            kind: "node", tag, id: cssId, classes, attrs: {}, text: null, events: {}, bind: null, children: [],
            range: makeRange(lineNo, lineNo), path: `layout.${nid}`, depth, parentId: null, uid: nid,
            semanticType: classifyElement(tag),
          };
          if (paren) parseParenContent(node, paren.slice(1, -1), lineNo);
          return { node, hasChildren: false };
        }

        err(`Invalid layout line: ${t}`, lineNo);
      }

      function parseParenContent(node: EnhancedNode, content: string, lineNo: number): void {
        let remaining = content.trim();
        while (remaining.length > 0) {
          const onMatch = remaining.match(/^on\s+([a-zA-Z0-9_-]+)\s*->\s*([a-zA-Z0-9_.]+)/);
          if (onMatch) {
            node.events[onMatch[1]] = onMatch[2];
            addSymbol(onMatch[2], "handler", "layout", lineNo + 1, 0);
            remaining = remaining.slice(onMatch[0].length).trim();
            continue;
          }
          const bindMatch = remaining.match(/^bind\s+value\s*<->\s*([a-zA-Z0-9_.]+)/);
          if (bindMatch) {
            node.bind = { prop: "value", state: bindMatch[1] };
            addSymbol(bindMatch[1], "state", "layout", lineNo + 1, 0);
            remaining = remaining.slice(bindMatch[0].length).trim();
            continue;
          }
          const attrMatch = remaining.match(/^([a-zA-Z0-9_-]+)\s*=\s*("([^"]*)"|'([^']*)')/);
          if (attrMatch) {
            node.attrs[attrMatch[1]] = attrMatch[3] ?? attrMatch[4] ?? "";
            remaining = remaining.slice(attrMatch[0].length).trim();
            continue;
          }
          const classMatch = remaining.match(/^class\s*=\s*("([^"]*)"|'([^']*)')/);
          if (classMatch) {
            remaining = remaining.slice(classMatch[0].length).trim();
            continue;
          }
          const boolMatch = remaining.match(/^([a-zA-Z0-9_-]+)(?=\s|$)/);
          if (boolMatch) {
            node.attrs[boolMatch[1]] = "true";
            remaining = remaining.slice(boolMatch[0].length).trim();
            continue;
          }
          break;
        }
      }

      function extractClasses(t: string): string[] {
        const before = t.split("(")[0].split(":")[0].trim();
        const parts = before.split(".");
        return parts.slice(1).map(s => s.trim()).filter(Boolean);
      }

      function parseBlock(minIndent: number, parent: EnhancedNode | null): EnhancedNode[] {
        const nodes: EnhancedNode[] = [];
        while (i < lines.length) {
          const l = lines[i];
          if (isSkippable(l)) { i++; continue; }
          const ind = indentOf(l);
          if (ind < minIndent) break;
          if (ind !== minIndent) err(`Unexpected indentation. Expected ${minIndent}, got ${ind}`, i);

          const { node, hasChildren } = parseNode(i);
          node.parentId = parent?.id ?? null;
          i++;

          if (hasChildren) {
            let j = i;
            let hasContent = false;
            while (j < lines.length) {
              if (isSkippable(lines[j])) { j++; continue; }
              if (indentOf(lines[j]) > minIndent) hasContent = true;
              break;
            }
            if (hasContent) {
              node.children = parseBlock(minIndent + 2, node);
            }
          }
          nodes.push(node);
          addEnhancedNode(node);
        }
        return nodes;
      }

      const layoutNodes = parseBlock(baseIndent, null);
      const root = layoutNodes.length === 1 ? layoutNodes[0] : {
        kind: "node" as const, tag: "view", id: "root", classes: [], attrs: {},
        text: null, events: {}, bind: null, children: layoutNodes,
        range: makeRange(layoutStart, i - 1), path: "layout.root", depth: 0,
        parentId: null, uid: makeId(), semanticType: "container",
      } as EnhancedNode;
      ast.layout = root;
      ranges["layout"] = makeRange(layoutStart, i - 1);
      ast.layoutRange = ranges["layout"];
      continue;
    }

    if (trimmed === "style:") {
      const styleStart = i;
      i++;
      const startIndent = 2;
      const cssLines: string[] = [];
      while (i < lines.length) {
        const l = lines[i];
        if (isSkippable(l)) { cssLines.push(""); i++; continue; }
        if (indentOf(l) === 0) break;
        cssLines.push(l.slice(startIndent));
        i++;
      }
      ast.styleRaw = cssLines.join("\n").trimEnd() + "\n";
      ranges["style"] = makeRange(styleStart, i - 1);
      ast.styleRange = ranges["style"];
      continue;
    }

    if (trimmed === "script:") {
      const scriptStart = i;
      i++;
      const startIndent = 2;
      const scriptLines: string[] = [];
      while (i < lines.length) {
        const l = lines[i];
        if (isSkippable(l)) { scriptLines.push(""); i++; continue; }
        if (indentOf(l) === 0) break;
        scriptLines.push(l.slice(startIndent));
        i++;
      }
      ast.script = scriptLines.join("\n").trimEnd() + "\n";
      ranges["script"] = makeRange(scriptStart, i - 1);
      continue;
    }

    if (trimmed === "handlers:") {
      const handlersStart = i;
      i++;
      while (i < lines.length) {
        const l = lines[i];
        if (isSkippable(l)) { i++; continue; }
        if (indentOf(l) === 0) break;
        const t = l.trim();
        const hm = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*$/);
        if (!hm) err("Invalid handler header", i);
        const name = hm[1];
        addSymbol(name, "handler", "handlers", i + 1, l.indexOf(name) + 1);
        const handlerStartLine = i;
        i++;
        const body: string[] = [];
        while (i < lines.length) {
          const bl = lines[i];
          if (isSkippable(bl)) { i++; continue; }
          const ind = indentOf(bl);
          if (ind <= 2) break;
          const stmt = bl.trim();
          body.push(stmt);
          // Extract variable references from handler body
          const setMatch = stmt.match(/^set\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
          if (setMatch) {
            addSymbol(setMatch[1], "state", `handlers.${name}`, i + 1, bl.indexOf(setMatch[1]) + 1);
          }
          const varRefs = stmt.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
          for (const ref of varRefs) {
            if (ref !== "set" && ref !== "log" && ref !== "true" && ref !== "false") {
              const sym = symbolTable.find(s => s.name === ref);
              if (sym) {
                sym.usages.push({ line: i + 1, column: bl.indexOf(ref) + 1, offset: 0 });
              }
            }
          }
          i++;
        }
        const handler: EnhancedHandler = {
          name, body,
          range: makeRange(handlerStartLine, i - 1),
          symbols: [...new Set(body.flatMap(b => b.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || []))],
          complexity: calculateComplexity(body),
        };
        ast.handlers[name] = handler;
      }
      ranges["handlers"] = makeRange(handlersStart, i - 1);
      ast.handlersRange = ranges["handlers"];
      continue;
    }

    err(`Unknown top-level statement: ${trimmed}`, i);
  }

  ast.nodes = enhancedNodes;
  ast.symbolTable = symbolTable;
  return ast;
}

function parseStateValue(raw: string, onError: () => never): HJXStateValue {
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1);
  }
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/.test(raw)) return Number(raw);
  if (raw.startsWith("[") || raw.startsWith("{")) {
    try { return JSON.parse(raw.replace(/'/g, '"')); } catch { return onError(); }
  }
  return onError();
}

function parseMaybeString(rhs: string, onError: () => never): string {
  const r = rhs.trim();
  if ((r.startsWith('"') && r.endsWith('"')) || (r.startsWith("'") && r.endsWith("'"))) return r.slice(1, -1);
  return onError();
}

function inferType(raw: string): string {
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) return "string";
  if (raw === "true" || raw === "false") return "boolean";
  if (/^-?\d+(?:\.\d+)?$/.test(raw)) return "number";
  if (raw.startsWith("[")) return "array";
  if (raw.startsWith("{")) return "object";
  return "unknown";
}

function classifyElement(tag: string): string {
  const containers = ["view", "div", "section", "article", "header", "footer", "nav", "main", "aside", "form", "ul", "ol", "table", "tbody", "thead"];
  if (containers.includes(tag)) return "container";
  if (["text", "p", "span", "h1", "h2", "h3", "h4", "h5", "h6", "label", "li", "td", "th", "tr"].includes(tag)) return "text";
  if (["button"].includes(tag)) return "interactive";
  if (["input", "select", "textarea", "option"].includes(tag)) return "input";
  if (tag.match(/^[A-Z]/)) return "component";
  return "element";
}

function calculateComplexity(body: string[]): number {
  let complexity = 1;
  for (const line of body) {
    if (line.includes("?")) complexity++;
    if (line.includes("&&")) complexity++;
    if (line.includes("||")) complexity++;
    if (line.includes(".filter")) complexity++;
    if (line.includes(".map")) complexity++;
    if (line.includes(".reduce")) complexity++;
  }
  return complexity;
}

export function normalizeAST(ast: EnhancedAST): Record<string, unknown> {
  return {
    component: ast.component.name,
    state: Object.entries(ast.state).map(([k, v]) => ({ name: k, value: v, type: typeof v })),
    imports: Object.entries(ast.imports).map(([k, v]) => ({ alias: k, path: v })),
    layout: ast.layout ? flattenNode(ast.layout) : [],
    handlers: Object.entries(ast.handlers).map(([k, v]) => ({ name: k, body: v.body })),
    computed: Object.entries(ast.computed).map(([k, v]) => ({ name: k, expression: v })),
    symbols: ast.symbolTable,
  };
}

function flattenNode(node: HJXNode, path = "", depth = 0): Record<string, unknown>[] {
  const currentPath = path ? `${path}.${node.tag}` : node.tag;
  const result: Record<string, unknown>[] = [{
    tag: node.tag,
    kind: node.kind,
    path: currentPath,
    depth,
    id: node.id,
    classes: node.classes,
    text: node.text,
    events: node.events,
    bind: node.bind,
    condition: node.condition,
    iterator: node.iterator,
  }];
  for (const child of node.children) {
    result.push(...flattenNode(child, currentPath, depth + 1));
  }
  return result;
}

export function flattenAST(ast: EnhancedAST): EnhancedNode[] {
  return ast.nodes;
}

export function extractSymbolTable(ast: EnhancedAST): SymbolInfo[] {
  return ast.symbolTable;
}

export function getNodePath(node: EnhancedNode): string {
  return node.path;
}

export function findReferences(ast: EnhancedAST, identifier: string): SymbolInfo | undefined {
  return ast.symbolTable.find(s => s.name === identifier);
}

export function getScope(node: EnhancedNode): string {
  return node.path.split(".").slice(0, -1).join(".");
}
