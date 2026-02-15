import { writeFileSync, unlinkSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { HJXAst, HJXNode } from "./types.js";
import { LoadedComponent } from "./loader.js";
import { compileHandlersToJS } from "./compiler/vanilla_handlers.js";
import { v4 as uuidv4 } from "uuid";

// Simple UUID polyfill if not available
function genId() {
  return Math.random().toString(36).substring(2, 15);
}

export class ServerSession {
  private state: Record<string, any>;
  private handlers: Record<string, (ctx: any) => void> = {};
  private children: Record<string, ServerSession> = {};
  private readyPromise: Promise<void>;
  private tempFile: string | null = null;

  constructor(component: LoadedComponent, workDir: string, initialProps: Record<string, any> = {}) {
    this.state = { ...component.ast.state, ...initialProps };
    this.readyPromise = this.init(component, workDir);
  }

  private async init(component: LoadedComponent, workDir: string) {
    const ast = component.ast;

    // 1. Initialize children by traversing layout
    const childPromises: Promise<void>[] = [];
    if (ast.layout) {
      this.traverseLayout(ast.layout, component.imports, workDir, childPromises, { autoId: 0 });
    }

    // 2. Prepare source code
    const scriptContent = ast.script ?? "";
    const handlersJS = compileHandlersToJS(ast.handlers, Object.keys(ast.state));

    const moduleSource = `
${scriptContent}

export const handlers = ${handlersJS};
`;

    // 3. Write to temp file
    const sessionDir = join(workDir, ".sessions");
    if (!existsSync(sessionDir)) mkdirSync(sessionDir, { recursive: true });

    const filename = `session-${genId()}.mjs`;
    this.tempFile = join(sessionDir, filename);

    writeFileSync(this.tempFile, moduleSource, "utf-8");

    try {
      // 4. Import it
      const fileUrl = pathToFileURL(this.tempFile).href;
      const mod = await import(fileUrl);
      this.handlers = mod.handlers;
    } catch (e) {
      console.error("Failed to load server script:", e);
      this.handlers = {};
    }

    // Wait for children
    await Promise.all(childPromises);
  }

  private traverseLayout(
    node: HJXNode,
    imports: Record<string, LoadedComponent>,
    workDir: string,
    promises: Promise<void>[],
    ctx: { autoId: number }
  ) {
    // Check if node tag is an imported component
    if (imports[node.tag]) {
      const instanceId = ctx.autoId++;
      const alias = node.tag;
      const childKey = `${alias}_${instanceId}`;
      const childComp = imports[alias];

      // Extract static props from node.attrs
      const initialProps: Record<string, any> = {};
      for (const [k, v] of Object.entries(node.attrs)) {
        if (!v.includes("{{")) {
          // Try to parse number/bool
          if (v === "true") initialProps[k] = true;
          else if (v === "false") initialProps[k] = false;
          else {
            const n = Number(v);
            initialProps[k] = !isNaN(n) ? n : v;
          }
        }
      }

      const childSession = new ServerSession(childComp, workDir, initialProps);
      this.children[childKey] = childSession;
      promises.push(childSession.ready());
      return;
    }

    // Normal node: consumes an ID
    ctx.autoId++;

    if (node.children) {
      for (const child of node.children) {
        this.traverseLayout(child, imports, workDir, promises, ctx);
      }
    }
  }

  public async ready() {
    return this.readyPromise;
  }

  public getState(): Record<string, any> {
    const s = { ...this.state };
    for (const [alias, child] of Object.entries(this.children)) {
      s[alias] = child.getState();
    }
    return s;
  }

  public updateState(patch: Record<string, any>) {
    // This is called when client sends back state (e.g. inputs)
    // We need to route partial patches to children if keys match alias?
    // Or does the client send flattened keys "Counter.count"?
    // Let's assume dot notation for children: "Counter.count"

    const localPatch: Record<string, any> = {};
    const childrenPatches: Record<string, Record<string, any>> = {};

    for (const [key, val] of Object.entries(patch)) {
      if (key.includes(".")) {
        const [alias, ...rest] = key.split(".");
        if (this.children[alias]) {
          if (!childrenPatches[alias]) childrenPatches[alias] = {};
          childrenPatches[alias][rest.join(".")] = val;
        }
      } else {
        localPatch[key] = val;
      }
    }

    Object.assign(this.state, localPatch);

    for (const [alias, childPatch] of Object.entries(childrenPatches)) {
      this.children[alias].updateState(childPatch);
    }

    // Return aggregated patch? Or just what changed?
    // For simplicity, we just apply side effects here.
    return patch;
  }

  public runHandler(handlerName: string): Record<string, any> | null {
    // Check for child handler: "Counter.inc"
    if (handlerName.includes(".")) {
      const [alias, ...rest] = handlerName.split(".");
      const childName = rest.join(".");
      if (this.children[alias]) {
        const childPatch = this.children[alias].runHandler(childName);
        if (childPatch) {
          // Prefix keys in patch with alias
          const prefixedPatch: Record<string, any> = {};
          for (const [k, v] of Object.entries(childPatch)) {
            prefixedPatch[`${alias}.${k}`] = v;
          }
          return prefixedPatch;
        }
        return null;
      }
    }

    const handler = this.handlers[handlerName];
    if (!handler) {
      console.warn(`Unknown handler: ${handlerName}`);
      return null;
    }

    let patch: Record<string, any> = {};

    const ctx = {
      store: {
        get: () => this.state,
        set: (p: any) => {
          Object.assign(this.state, p);
          Object.assign(patch, p);
        }
      }
    };

    try {
      handler(ctx);
    } catch (e) {
      console.error(`Error in handler ${handlerName}:`, e);
      throw e;
    }

    return Object.keys(patch).length > 0 ? patch : null;
  }

  public cleanup() {
    if (this.tempFile && existsSync(this.tempFile)) {
      try {
        unlinkSync(this.tempFile);
      } catch (e) {
        // ignore
      }
    }
    for (const child of Object.values(this.children)) {
      child.cleanup();
    }
  }
}
