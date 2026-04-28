/**
 * React compilation target.
 * Transforms HJX AST to React functional components with hooks and CSS modules.
 */

import { HJXAst, HJXNode, HJXApiEndpoint, HJXStyleRule, HJXBreakpoint } from "../types.js";
import { nlCssToCss } from "./nl_css.js";

export interface ReactBundle {
  component: string;    // Component.tsx
  styles: string;       // Component.module.css
  apiRoutes?: string;   // api/routes.ts (when --backend)
  apiHandlers?: string; // api/handlers.ts (when --backend)
}

export function buildReact(ast: HJXAst, options: { backend?: boolean } = {}): ReactBundle {
  const scope = `hjx-${ast.component.name.toLowerCase()}`;

  // Generate CSS from natural language style rules
  const css = nlCssToCss(ast.style, ast.styleRaw, scope, ast.breakpoints, ast.designSystem);

  // Generate React component
  const component = generateComponent(ast, scope);

  const result: ReactBundle = { component, styles: css };

  // Generate backend if requested
  if (options.backend && ast.api.length > 0) {
    result.apiRoutes = generateApiRoutes(ast.api);
    result.apiHandlers = generateApiHandlers(ast.api);
  }

  return result;
}

function generateComponent(ast: HJXAst, scope: string): string {
  const componentName = ast.component.name;
  const stateKeys = Object.keys(ast.state);
  const hasApi = ast.api.length > 0;
  const hasEffects = ast.script || hasApi;

  let code = `import React${hasEffects ? ", { useState, useEffect }" : ", { useState }"} from 'react';
import styles from './${componentName}.module.css';

`;

  // Generate fetch utility if API endpoints exist
  if (hasApi) {
    code += `// API fetch utility
async function apiFetch(endpoint: string, options?: RequestInit) {
  const res = await fetch(endpoint, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

`;
  }

  // Component declaration
  code += `export function ${componentName}() {\n`;

  // State declarations
  if (stateKeys.length > 0) {
    code += `  // Reactive state\n`;
    for (const key of stateKeys) {
      const value = ast.state[key];
      const reactValue = formatStateValue(value);
      code += `  const [${key}, set${capitalize(key)}] = useState(${reactValue});\n`;
    }
    code += `\n`;
  }

  // Effect for initial data loading (if API endpoints exist)
  if (hasApi) {
    const getEndpoints = ast.api.filter(e => e.method === "GET");
    if (getEndpoints.length > 0) {
      code += `  // Fetch data on mount\n`;
      code += `  useEffect(() => {\n`;
      for (const ep of getEndpoints) {
        code += `    ${ep.handlerName}();\n`;
      }
      code += `  }, []);\n\n`;
    }
  }

  // API handler functions
  for (const ep of ast.api) {
    code += generateApiHandler(ep);
  }

  // User-defined handlers
  for (const [name, handler] of Object.entries(ast.handlers)) {
    const isApiHandler = ast.api.some(ep => ep.handlerName === name);
    if (isApiHandler) continue; // Already generated

    code += generateHandler(name, handler, ast);
  }

  // Layout/render section
  code += `  // Render\n`;
  code += `  return (\n`;
  code += `    ${renderNodeToJSX(ast.layout ?? emptyRoot(), ast, 2)}\n`;
  code += `  );\n`;
  code += `}\n`;

  return code;
}

function generateApiHandler(ep: HJXApiEndpoint): string {
  const { method, path, handlerName } = ep;

  // Convert path params to function params
  const pathParams = path.match(/:([A-Za-z_]+)/g)?.map(p => p.slice(1)) || [];

  let code = `  // ${method} ${path}\n`;
  code += `  async function ${handlerName}(${pathParams.map(p => `${p}: any`).join(", ")}`;

  // Add body parameter for POST/PUT/PATCH
  if (["POST", "PUT", "PATCH"].includes(method) && ep.body) {
    code += `, body: Record<string, any>`;
  }
  code += `) {\n`;

  // Build URL with params
  if (pathParams.length > 0) {
    code += `    const url = \`${path.replace(/:([A-Za-z_]+)/g, "${$1}")}\`;\n`;
  } else {
    code += `    const url = "${path}";\n`;
  }

  // Add query params
  if (ep.query) {
    const queryParams = Object.entries(ep.query)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    code += `    const url = \`\${url}?${queryParams}\`;\n`;
  }

  // Build fetch options
  const fetchOptions: string[] = [];
  if (method !== "GET") {
    fetchOptions.push(`method: "${method}"`);
    if (ep.body) {
      fetchOptions.push("body: JSON.stringify(body)");
    }
  }

  if (fetchOptions.length > 0) {
    code += `    const data = await apiFetch(url, { ${fetchOptions.join(", ")} });\n`;
  } else {
    code += `    const data = await apiFetch(url);\n`;
  }

  code += `    return data;\n`;
  code += `  }\n\n`;

  return code;
}

function generateHandler(name: string, handler: { name: string; body: string[] }, ast: HJXAst): string {
  if (handler.body.length === 0) return "";

  let code = `  function ${name}() {\n`;

  for (const line of handler.body) {
    // Parse: set x = expr
    const setMatch = line.match(/^set\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
    if (setMatch) {
      const varName = setMatch[1];
      const expr = convertExprToJS(setMatch[2], ast);
      code += `    set${capitalize(varName)}(${expr});\n`;
      continue;
    }

    // Parse: fetch handlerName -> result
    const fetchMatch = line.match(/^fetch\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:with\s+(.+?))?\s*->\s*([A-Za-z_][A-Za-z0-9_]*)\s*$/);
    if (fetchMatch) {
      const apiName = fetchMatch[1];
      const withClause = fetchMatch[2];
      const targetVar = fetchMatch[3];
      const bodyArg = withClause ? `, ${withClause}` : "";
      code += `    const ${targetVar} = await ${apiName}(${bodyArg.slice(2)});\n`;
      code += `    set${capitalize(targetVar)}(${targetVar});\n`;
      continue;
    }

    // Parse: log "message"
    const logMatch = line.match(/^log\s+(.+)$/);
    if (logMatch) {
      code += `    console.log(${logMatch[1]});\n`;
      continue;
    }
  }

  code += `  }\n\n`;
  return code;
}

function renderNodeToJSX(node: HJXNode, ast: HJXAst, indent: number): string {
  const pad = "  ".repeat(indent);

  if (node.kind === "if") {
    return renderIfToJSX(node, ast, indent);
  }

  if (node.kind === "for") {
    return renderForToJSX(node, ast, indent);
  }

  if (node.kind === "else") {
    return `${pad}} else {\n${renderChildrenToJSX(node.children, ast, indent + 1)}${pad}}\n`;
  }

  // Regular node
  const tag = node.tag;
  const classes = node.classes.length > 0 ? `className={styles.${node.classes.join(".")}}` : "";
  const id = node.id ? `id="${node.id}"` : "";

  // Build props
  const props: string[] = [];
  if (classes) props.push(classes);
  if (id) props.push(id);

  // Event handlers
  for (const [event, handlerName] of Object.entries(node.events)) {
    props.push(`on${capitalize(event)}={() => ${handlerName}()}`);
  }

  // Input binding
  if (node.bind) {
    props.push(`value={${node.bind.state}}`);
    props.push(`onChange={(e) => set${capitalize(node.bind.state)}(e.target.value)}`);
  }

  // Text interpolation
  if (node.text) {
    const textContent = interpolateText(node.text, ast);
    const propsStr = props.length > 0 ? " " + props.join(" ") : "";
    if (node.children.length > 0) {
      return `${pad}<${tag}${propsStr}>\n${renderChildrenToJSX(node.children, ast, indent + 1)}${pad}</${tag}>\n`;
    }
    return `${pad}<${tag}${propsStr}>${textContent}</${tag}>\n`;
  }

  const propsStr = props.length > 0 ? " " + props.join(" ") : "";
  if (node.children.length > 0) {
    return `${pad}<${tag}${propsStr}>\n${renderChildrenToJSX(node.children, ast, indent + 1)}${pad}</${tag}>\n`;
  }
  return `${pad}<${tag}${propsStr} />\n`;
}

function renderIfToJSX(node: HJXNode, ast: HJXAst, indent: number): string {
  const pad = "  ".repeat(indent);
  const condition = convertConditionToJS(node.condition || "", ast);

  let code = `${pad}{${condition} && (\n`;
  code += renderChildrenToJSX(node.children, ast, indent + 1);
  code += `${pad})}\n`;

  // Check for else sibling (handled at parent level)
  return code;
}

function renderForToJSX(node: HJXNode, ast: HJXAst, indent: number): string {
  const pad = "  ".repeat(indent);
  const { item, list } = node.iterator!;

  let code = `${pad}{${list}.map((${item}, idx) => (\n`;
  code += renderChildrenToJSX(node.children, ast, indent + 1);
  code += `${pad}))}\n`;

  return code;
}

function renderChildrenToJSX(children: HJXNode[], ast: HJXAst, indent: number): string {
  return children.map(child => renderNodeToJSX(child, ast, indent)).join("");
}

function interpolateText(text: string, ast: HJXAst): string {
  return text.replace(/\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}/g, (_, key) => `{${key}}`);
}

function convertConditionToJS(condition: string, ast: HJXAst): string {
  // Convert HJX conditions to JS expressions
  let expr = condition;

  // Replace === with === (same)
  // Replace != with !==
  expr = expr.replace(/!=/g, "!==");

  return expr;
}

function convertExprToJS(expr: string, ast: HJXAst): string {
  // Convert HJX expressions to JS (mostly identical for v0.2)
  return expr;
}

function formatStateValue(value: any): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return "undefined";
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function emptyRoot(): HJXNode {
  return {
    kind: "node",
    tag: "view",
    id: "root",
    classes: [],
    attrs: {},
    text: null,
    events: {},
    bind: null,
    children: [],
  };
}

// Backend route generation
function generateApiRoutes(endpoints: HJXApiEndpoint[]): string {
  let code = `import { Router } from 'express';
import * as handlers from './handlers.js';

const router = Router();

`;

  for (const ep of endpoints) {
    const method = ep.method.toLowerCase();
    code += `router.${method}('${ep.path}', handlers.${ep.handlerName});\n`;
  }

  code += `\nexport default router;\n`;

  return code;
}

function generateApiHandlers(endpoints: HJXApiEndpoint[]): string {
  let code = `import { Request, Response } from 'express';

`;

  for (const ep of endpoints) {
    code += `// ${ep.method} ${ep.path}\n`;
    code += `export async function ${ep.handlerName}(req: Request, res: Response) {\n`;
    code += `  try {\n`;
    code += `    // TODO: Implement handler logic\n`;

    if (["POST", "PUT", "PATCH"].includes(ep.method)) {
      code += `    const body = req.body;\n`;
    }
    if (ep.path.includes(":")) {
      code += `    const params = req.params;\n`;
    }

    code += `    res.json({ success: true });\n`;
    code += `  } catch (error) {\n`;
    code += `    res.status(500).json({ error: (error as Error).message });\n`;
    code += `  }\n`;
    code += `}\n\n`;
  }

  return code;
}
