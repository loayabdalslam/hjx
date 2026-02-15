import { writeFileSync, unlinkSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { HJXAst } from "./types.js";
import { compileHandlersToJS } from "./compiler/vanilla_handlers.js";
import { v4 as uuidv4 } from "uuid"; // We might need uuid, or just use Math.random

// Simple UUID polyfill if not available
function genId() {
  return Math.random().toString(36).substring(2, 15);
}

export class ServerSession {
  private state: Record<string, any>;
  private handlers: Record<string, (ctx: any) => void> = {};
  private readyPromise: Promise<void>;
  private tempFile: string | null = null;

  constructor(ast: HJXAst, workDir: string) {
    this.state = { ...ast.state };
    this.readyPromise = this.init(ast, workDir);
  }

  private async init(ast: HJXAst, workDir: string) {
    // 1. Prepare source code
    const scriptContent = ast.script ?? "";
    const handlersJS = compileHandlersToJS(ast.handlers, Object.keys(ast.state));

    const moduleSource = `
${scriptContent}

export const handlers = ${handlersJS};
`;

    // 2. Write to temp file
    // We put it in workDir so relative imports in script might work (if workDir is properly set)
    // Actually, imports in 'script' are relative to the hjx file usually.
    // If we write to 'dist/session.mjs', imports like './foo' will look in 'dist/foo'.
    // Use the workDir (which is outDir in devserver) or better, the input directory?
    // If we write to input directory, we pollute it.
    // If we write to dist, we need to copy imported files or adjust imports.
    // For MVP, let's assume imports are absolute or package imports.
    // OR we write the temp file next to the input file (and hide it?).

    // Let's use the directory of the input file if possible, but we only get workDir here.
    // We should pass input dir.

    // For now, let's assume the workDir passed is a safe place (like dist-app/.sessions).
    const sessionDir = join(workDir, ".sessions");
    if (!existsSync(sessionDir)) mkdirSync(sessionDir, { recursive: true });

    const filename = `session-${genId()}.mjs`;
    this.tempFile = join(sessionDir, filename);

    writeFileSync(this.tempFile, moduleSource, "utf-8");

    try {
      // 3. Import it
      // We need a file URL for dynamic import on Windows
      const fileUrl = pathToFileURL(this.tempFile).href;
      const mod = await import(fileUrl);
      this.handlers = mod.handlers;
    } catch (e) {
      console.error("Failed to load server script:", e);
      this.handlers = {};
    }
  }

  public async ready() {
    return this.readyPromise;
  }

  public getState() {
    return this.state;
  }

  public updateState(patch: Record<string, any>) {
    Object.assign(this.state, patch);
    return patch;
  }

  public runHandler(handlerName: string): Record<string, any> | null {
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
  }
}
