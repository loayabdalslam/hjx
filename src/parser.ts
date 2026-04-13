import { HJXAst, HJXNode, HJXHandler, HJXStateValue, HJXApiEndpoint, HJXStyleRule, HJXBreakpoint } from "./types.js";

/**
 * Indentation-based parser for HJX v0.2.
 * Blocks: component, imports, state, api, layout, style, breakpoints, handlers, script
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
    breakpoints: []
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

    if (trimmed === "computed:") {
      i++;
      while (i < lines.length) {
        const l = lines[i];
        if (isSkippable(l)) { i++; continue; }
        if (indentOf(l) === 0) break;

        const t = l.trim();
        const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
        if (!m) err("Invalid computed line. Expected: name = expression", i);
        const key = m[1];
        const raw = m[2].trim();
        // Computed values store the expression as a string (may be quoted or bare expression)
        ast.computed[key] = (raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'")) 
          ? raw.slice(1, -1) 
          : raw;
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

    if (trimmed === "api:") {
      i++;
      while (i < lines.length) {
        const l = lines[i];
        if (isSkippable(l)) { i++; continue; }
        if (indentOf(l) === 0) break;

        const t = l.trim();
        // Parse: GET /api/todos -> fetchTodos or GET /api/todos -> fetchTodos:
        const apiMatch = t.match(/^(GET|POST|PUT|DELETE|PATCH)\s+([^\s]+)\s*->\s*([A-Za-z_][A-Za-z0-9_]*)\s*:?\s*$/);
        if (!apiMatch) err("Invalid API line. Expected: METHOD /path -> handlerName", i);

        const endpoint: HJXApiEndpoint = {
          method: apiMatch[1],
          path: apiMatch[2],
          handlerName: apiMatch[3]
        };

        i++;
        // Check for sub-blocks: query:, params:, body:, response:
        while (i < lines.length) {
          const sl = lines[i];
          if (isSkippable(sl)) { i++; continue; }
          if (indentOf(sl) <= 2) break;

          const st = sl.trim();

          if ((st === "query:") || (st === "params:") || (st === "body:")) {
            const sectionType = st.slice(0, -1); // query, params, or body
            const target: Record<string, any> = {};
            i++;
            while (i < lines.length) {
              const vl = lines[i];
              if (isSkippable(vl)) { i++; continue; }
              if (indentOf(vl) <= 4) break;

              const vt = vl.trim();
              const vm = vt.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
              if (!vm) err(`Invalid ${sectionType} field`, i);
              const rawValue = vm[2].trim();
              // For schema definitions, allow bare type keywords like 'number', 'string', 'boolean'
              const typeKeywords = ['number', 'string', 'boolean', 'array', 'object', 'any'];
              if (typeKeywords.includes(rawValue.toLowerCase())) {
                target[vm[1]] = rawValue.toLowerCase();
              } else {
                target[vm[1]] = parseStateValue(rawValue, () => err(`Invalid ${sectionType} value: ${vm[2]}`, i));
              }
              i++;
            }
            if (sectionType === "query") endpoint.query = target;
            else if (sectionType === "params") endpoint.params = target;
            else endpoint.body = target;
          } else if (st === "response:") {
            const response: { type: string; item?: any; schema?: any } = { type: "" };
            i++;
            while (i < lines.length) {
              const rl = lines[i];
              if (isSkippable(rl)) { i++; continue; }
              if (indentOf(rl) <= 4) break;

              const rt = rl.trim();
              const rm = rt.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
              if (!rm) err("Invalid response field", i);
              const rawVal = rm[2].trim();
              if (rm[1] === "type") {
                // Handle bare keywords like 'array', 'object', 'string'
                response.type = rawVal.replace(/^["']|["']$/g, "");
              }
              else if (rm[1] === "item") response.item = rawVal;
              else if (rm[1] === "schema") response.schema = rawVal;
              i++;
            }
            endpoint.response = response;
          } else {
            i++;
          }
        }
        ast.api.push(endpoint);
      }
      continue;
    }

    if (trimmed === "breakpoints:") {
      i++;
      while (i < lines.length) {
        const l = lines[i];
        if (isSkippable(l)) { i++; continue; }
        if (indentOf(l) === 0) break;

        const t = l.trim();
        const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
        if (!m) err("Invalid breakpoint line. Expected: name = value", i);
        ast.breakpoints.push({ name: m[1], value: m[2].trim() });
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
      const rules: HJXStyleRule[] = [];
      let currentRule: HJXStyleRule | null = null;
      let inRawCss = false;
      const rawCssLines: string[] = [];

      while (i < lines.length) {
        const l = lines[i];
        if (isSkippable(l)) {
          if (currentRule) {
            currentRule.properties.push("");
          } else if (inRawCss) {
            rawCssLines.push("");
          }
          i++;
          continue;
        }
        if (indentOf(l) === 0) break;

        const t = l.trim();

        // Detect raw CSS block: .selector { ... }
        if (t.includes("{") && !t.endsWith(":")) {
          inRawCss = true;
          rawCssLines.push(l.slice(2));
          // Collect until closing }
          i++;
          while (i < lines.length) {
            const rl = lines[i];
            rawCssLines.push(rl.length > 2 ? rl.slice(2) : rl);
            if (rl.includes("}")) {
              i++;
              break;
            }
            i++;
          }
          continue;
        }

        // Natural language rule: .selector:
        const ruleMatch = t.match(/^(\.[A-Za-z0-9_/:-]+)(:hover|:active|:focus|:visited|:disabled)?(\s*@[A-Za-z_]+)?\s*:\s*$/);
        if (ruleMatch) {
          currentRule = {
            selector: ruleMatch[1],
            properties: [],
            pseudo: ruleMatch[2] || undefined,
            media: ruleMatch[3]?.trim() || undefined
          };
          rules.push(currentRule);
          inRawCss = false;
          i++;
          continue;
        }

        // Property line under a rule
        if (currentRule && !inRawCss) {
          currentRule.properties.push(t);
          i++;
          continue;
        }

        // If we get here and no current rule, treat as raw CSS line
        rawCssLines.push(l.slice(2));
        inRawCss = true;
        i++;
      }

      ast.style = rules;
      ast.styleRaw = rawCssLines.join("\n").trim();
      continue;
    }

    if (trimmed === "script:") {
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

  // Arrays/Objects (JSON-like)
  if (raw.startsWith('[') || raw.startsWith('{')) {
    try {
      // Basic support for JSON format in state
      return JSON.parse(raw.replace(/'/g, '"'));
    } catch (e) {
      return onError();
    }
  }

  return onError();
}

function parseLayout(
  lines: string[],
  getIndex: () => number,
  setIndex: (v: number) => void,
  filename: string
): HJXNode {
  let i = getIndex();
  // const nodes: HJXNode[] = []; // Removed: now declared by call to parseBlock below
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

    // if (condition):
    const ifMatch = t.match(/^if\s*\((.+)\)\s*:\s*$/);
    if (ifMatch) {
      return {
        node: { kind: "if", tag: "if", condition: ifMatch[1].trim(), classes: [], attrs: {}, text: null, events: {}, bind: null, children: [] },
        indent,
        hasChildren: true
      };
    }

    // else:
    if (t === "else:") {
      return {
        node: { kind: "else", tag: "else", classes: [], attrs: {}, text: null, events: {}, bind: null, children: [] },
        indent,
        hasChildren: true
      };
    }

    // for (item in list):
    const forMatch = t.match(/^for\s*\(([a-zA-Z0-9_]+)\s+in\s+([a-zA-Z0-9_.]+)\)\s*:\s*$/);
    if (forMatch) {
      return {
        node: {
          kind: "for",
          tag: "for",
          iterator: { item: forMatch[1], list: forMatch[2] },
          classes: [], attrs: {}, text: null, events: {}, bind: null, children: []
        },
        indent,
        hasChildren: true
      };
    }

    // container: view#id.class (attrs):
    const containerMatch = t.match(/^([a-zA-Z][a-zA-Z0-9_-]*)(#[A-Za-z_][A-Za-z0-9_-]*)?(\.[A-Za-z0-9_/:-]+)*(\s*\([^\)]*\))?\s*:\s*$/);
    if (containerMatch) {
      const tag = containerMatch[1];
      const id = containerMatch[2] ? containerMatch[2].slice(1) : undefined;
      const classes = extractClasses(t);
      const paren = containerMatch[4]?.trim() ?? "";

      const node: HJXNode = { kind: "node", tag, id, classes, attrs: {}, text: null, events: {}, bind: null, children: [] };
      if (paren) parseParenContent(node, paren.slice(1, -1));

      return { node, indent, hasChildren: true };
    }

    // leaf with : "text"
    const leafMatch = t.match(/^([a-zA-Z][a-zA-Z0-9_-]*)(#[A-Za-z_][A-Za-z0-9_-]*)?(\.[A-Za-z0-9_/:-]+)*(\s*\([^\)]*\))?\s*:\s*(.+)$/);
    if (leafMatch) {
      const tag = leafMatch[1];
      const id = leafMatch[2] ? leafMatch[2].slice(1) : undefined;
      const classes = extractClasses(t);
      const paren = leafMatch[4]?.trim() ?? "";
      const rhs = leafMatch[5].trim();

      const node: HJXNode = { kind: "node", tag, id, classes, attrs: {}, text: parseMaybeString(rhs, () => err("Expected string after ':'", lineNo)), events: {}, bind: null, children: [] };

      if (paren) parseParenContent(node, paren.slice(1, -1));

      return { node, indent, hasChildren: false };
    }

    // simple node (void/empty): view#id.class (attrs)
    const simpleMatch = t.match(/^([a-zA-Z][a-zA-Z0-9_-]*)(#[A-Za-z_][A-Za-z0-9_-]*)?(\.[A-Za-z0-9_/:-]+)*(\s*\([^\)]*\))?$/);
    if (simpleMatch) {
      const tag = simpleMatch[1];
      const id = simpleMatch[2] ? simpleMatch[2].slice(1) : undefined;
      const classes = extractClasses(t);
      const paren = simpleMatch[4]?.trim() ?? "";

      const node: HJXNode = { kind: "node", tag, id, classes, attrs: {}, text: null, events: {}, bind: null, children: [] };
      if (paren) parseParenContent(node, paren.slice(1, -1));

      return { node, indent, hasChildren: false };
    }

    err(`Invalid layout line: ${t}`, lineNo);
  }

  function parseParenContent(node: HJXNode, content: string) {
    let remaining = content.trim();
    while (remaining.length > 0) {
      // 1. on click -> handler
      const onMatch = remaining.match(/^on\s+([a-zA-Z0-9_-]+)\s*->\s*([a-zA-Z0-9_.]+)/);
      if (onMatch) {
        node.events[onMatch[1]] = onMatch[2];
        remaining = remaining.slice(onMatch[0].length).trim();
        continue;
      }

      // 2. bind value <-> state
      const bindMatch = remaining.match(/^bind\s+value\s*<->\s*([a-zA-Z0-9_.]+)/);
      if (bindMatch) {
        node.bind = { prop: "value", state: bindMatch[1] };
        remaining = remaining.slice(bindMatch[0].length).trim();
        continue;
      }

      // 3. attribute="value" or attribute='value'
      const attrMatch = remaining.match(/^([a-zA-Z0-9_-]+)\s*=\s*("([^"]*)"|'([^']*)')/);
      if (attrMatch) {
        const key = attrMatch[1];
        const val = attrMatch[3] ?? attrMatch[4] ?? "";
        node.attrs[key] = val;
        remaining = remaining.slice(attrMatch[0].length).trim();
        continue;
      }

      // 4. boolean attribute
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

  function parseBlock(minIndent: number): HJXNode[] {
    const nodes: HJXNode[] = [];

    while (i < lines.length) {
      const line = lines[i];
      if (isSkippable(line)) { i++; continue; }
      const ind = indentOf(line);

      // If indentation is less than minIndent, we stepped out of this block
      if (ind < minIndent) break;

      // If we are at top level (parsing layout content), stop if we hit another top-level block (indent 0)
      // But minIndent for layout content is 2. So ind < 2 covers ind == 0.

      if (ind !== minIndent) {
        // If we are deeper than expected, it's an error (e.g. 4 spaces when we expected 2)
        // unless it's a child of previous, which should have been consumed.
        err(`Unexpected indentation. Expected ${minIndent}, got ${ind}`, i);
      }

      const { node, hasChildren } = parseNode(i);
      i++;

      if (hasChildren) {
        // Recursively parse children
        // We check if next line starts a block
        // Look ahead for children
        let j = i;
        let hasContent = false;
        while (j < lines.length) {
          if (isSkippable(lines[j])) { j++; continue; }
          if (indentOf(lines[j]) > minIndent) {
            hasContent = true;
          }
          break;
        }

        if (hasContent) {
          // We are at 'i'. The children should be at minIndent + 2
          node.children = parseBlock(minIndent + 2);
        }
      }
      nodes.push(node);
    }
    return nodes;
  }

  // Initial call: layout content starts at indent 2
  const nodes = parseBlock(baseIndent);

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
