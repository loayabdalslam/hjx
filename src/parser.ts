import { HJXAst, HJXNode, HJXHandler, HJXStateValue } from "./types.js";

/**
 * Minimal indentation-based parser for HJX v0.1.
 * Blocks: component, state, layout, style, handlers
 */
export function parseHJX(source: string, filename = "<input>"): HJXAst {
  const lines = source.replace(/\r\n/g, "\n").split("\n");

  function err(msg: string, lineNo: number): never {
    throw new Error(`${filename}:${lineNo + 1}: ${msg}`);
  }

  let componentName = "App";
  let i = 0;

  const ast: HJXAst = {
    kind: "HJXAst",
    version: "0.1",
    component: { name: componentName },
    imports: {},
    state: {},
    layout: null,
    style: "",
    handlers: {}
  };

  // helper: count leading spaces
  const indentOf = (s: string) => (s.match(/^\s*/)?.[0].length ?? 0);

  // Skip blank/comment
  const isSkippable = (s: string) => /^\s*$/.test(s) || /^\s*\/\//.test(s);

  // Parse top-level blocks
  while (i < lines.length) {
    const line = lines[i];
    if (isSkippable(line)) { i++; continue; }

    const trimmed = line.trim();

    if (trimmed.startsWith("component ")) {
      const name = trimmed.slice("component ".length).trim();
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) err("Invalid component name", i);
      componentName = name;
      ast.component.name = name;
      i++;
      continue;
    }

    if (trimmed === "state:") {
      i++;
      while (i < lines.length) {
        const l = lines[i];
        if (isSkippable(l)) { i++; continue; }
        if (indentOf(l) === 0) break;

        const t = l.trim();
        const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
        if (!m) err("Invalid state line. Expected: name = value", i);
        const key = m[1];
        const raw = m[2].trim();
        ast.state[key] = parseStateValue(raw, () => err(`Invalid state value: ${raw}`, i));
        i++;
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
        const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*from\s*(.+)$/);
        if (!m) err("Invalid import line. Expected: Alias from \"path\"", i);
        const key = m[1];
        const raw = m[2].trim();
        ast.imports[key] = parseMaybeString(raw, () => err(`Invalid import path: ${raw}`, i));
        i++;
      }
      continue;
    }

    if (trimmed === "layout:") {
      i++;
      ast.layout = parseLayout(lines, () => i, (v) => { i = v; }, filename);
      continue;
    }

    if (trimmed === "style:") {
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
      ast.style = cssLines.join("\n").trimEnd() + "\n";
      continue;
    }

    if (trimmed === "handlers:") {
      i++;
      while (i < lines.length) {
        const l = lines[i];
        if (isSkippable(l)) { i++; continue; }
        if (indentOf(l) === 0) break;

        // handler header: name:
        const t = l.trim();
        const hm = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*$/);
        if (!hm) err("Invalid handler header. Expected: name:", i);
        const name = hm[1];
        i++;

        const body: string[] = [];
        while (i < lines.length) {
          const bl = lines[i];
          if (isSkippable(bl)) { i++; continue; }
          const ind = indentOf(bl);
          if (ind <= 2) break; // back to handlers block level
          body.push(bl.trim());
          i++;
        }

        ast.handlers[name] = { name, body };
      }
      continue;
    }

    err(`Unknown top-level statement: ${trimmed}`, i);
  }

  return ast;
}

function parseStateValue(raw: string, onError: () => never): HJXStateValue {
  // string
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1);
  }
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/.test(raw)) return Number(raw);
  return onError();
}

function parseLayout(
  lines: string[],
  getIndex: () => number,
  setIndex: (v: number) => void,
  filename: string
): HJXNode {
  let i = getIndex();
  const nodes: HJXNode[] = [];
  const indentOf = (s: string) => (s.match(/^\s*/)?.[0].length ?? 0);
  const isSkippable = (s: string) => /^\s*$/.test(s) || /^\s*\/\//.test(s);
  const baseIndent = 2;

  function err(msg: string, lineNo: number): never {
    throw new Error(`${filename}:${lineNo + 1}: ${msg}`);
  }

  function parseNode(lineNo: number): { node: HJXNode; indent: number; hasChildren: boolean } {
    const line = lines[lineNo];
    const indent = indentOf(line);
    const t = line.trim();

    // container: view#id.class:
    const containerMatch = t.match(/^([a-zA-Z][a-zA-Z0-9_-]*)(#[A-Za-z_][A-Za-z0-9_-]*)?(\.[A-Za-z0-9_-]+)*\s*:\s*$/);
    if (containerMatch) {
      const tag = containerMatch[1];
      const id = containerMatch[2] ? containerMatch[2].slice(1) : undefined;
      const classes = extractClasses(t);
      return { node: { kind: "node", tag, id, classes, attrs: {}, text: null, events: {}, bind: null, children: [] }, indent, hasChildren: true };
    }

    // leaf with : "text"
    const leafMatch = t.match(/^([a-zA-Z][a-zA-Z0-9_-]*)(#[A-Za-z_][A-Za-z0-9_-]*)?(\.[A-Za-z0-9_-]+)*(\s*\([^\)]*\))?\s*:\s*(.+)$/);
    if (leafMatch) {
      const tag = leafMatch[1];
      const id = leafMatch[2] ? leafMatch[2].slice(1) : undefined;
      const classes = extractClasses(t);
      const paren = leafMatch[4]?.trim() ?? "";
      const rhs = leafMatch[5].trim();

      const node: HJXNode = { kind: "node", tag, id, classes, attrs: {}, text: parseMaybeString(rhs, () => err("Expected string after ':'", lineNo)), events: {}, bind: null, children: [] };

      // parse (on click -> handler) or (bind value <-> x)
      if (paren) {
        const inside = paren.slice(1, -1).trim();
        // on click -> name
        const onm = inside.match(/^on\s+click\s*->\s*([A-Za-z_][A-Za-z0-9_]*)$/);
        if (onm) node.events["click"] = onm[1];

        const bindm = inside.match(/^bind\s+value\s*<->\s*([A-Za-z_][A-Za-z0-9_]*)$/);
        if (bindm) node.bind = { prop: "value", state: bindm[1] };
      }

      return { node, indent, hasChildren: false };
    }

    err(`Invalid layout line: ${t}`, lineNo);
  }

  function extractClasses(t: string): string[] {
    // remove (...) and : "..."
    const before = t.split("(")[0].split(":")[0].trim();
    const parts = before.split(".");
    return parts.slice(1).map(s => s.trim()).filter(Boolean);
  }

  function parseMaybeString(rhs: string, onError: () => never): string {
    const r = rhs.trim();
    if ((r.startsWith('"') && r.endsWith('"')) || (r.startsWith("'") && r.endsWith("'"))) return r.slice(1, -1);
    return onError();
  }

  // Read until next top-level block (indent 0)
  while (i < lines.length) {
    const line = lines[i];
    if (isSkippable(line)) { i++; continue; }
    const ind = indentOf(line);
    if (ind === 0) break;
    if (ind < baseIndent) err("Invalid indentation in layout", i);

    // parse a node and its children based on indentation
    const { node, indent: nodeIndent, hasChildren } = parseNode(i);
    i++;

    if (hasChildren) {
      // gather children with greater indent
      const childIndent = nodeIndent + 2;
      while (i < lines.length) {
        const ln = lines[i];
        if (isSkippable(ln)) { i++; continue; }
        const ci = indentOf(ln);
        if (ci <= nodeIndent) break;
        if (ci !== childIndent && ci % 2 !== 0) err("Indentation must use 2 spaces", i);

        // parse child node
        const { node: child, indent: childInd, hasChildren: childHasChildren } = parseNode(i);
        i++;

        if (childHasChildren) {
          // parse grandchildren recursively by temporarily setting slice
          // We handle by backtracking: push child, then parse its children inline:
          const grandIndent = childInd + 2;
          while (i < lines.length) {
            const gl = lines[i];
            if (isSkippable(gl)) { i++; continue; }
            const gi = indentOf(gl);
            if (gi <= childInd) break;
            if (gi !== grandIndent && gi % 2 !== 0) err("Indentation must use 2 spaces", i);

            const { node: grand, hasChildren: gHas } = parseNode(i);
            if (gHas) err("Nested containers deeper than 2 levels are not supported yet (v0.1)", i);
            child.children.push(grand);
            i++;
          }
        }

        node.children.push(child);
      }
    }

    nodes.push(node);
  }

  setIndex(i);

  // wrap multiple roots in a root view
  if (nodes.length === 1) return nodes[0];
  return { kind: "node", tag: "view", id: "root", classes: [], attrs: {}, text: null, events: {}, bind: null, children: nodes };
}

function parseMaybeString(rhs: string, onError: () => never): string {
  const r = rhs.trim();
  if ((r.startsWith('"') && r.endsWith('"')) || (r.startsWith("'") && r.endsWith("'"))) return r.slice(1, -1);
  return onError();
}
