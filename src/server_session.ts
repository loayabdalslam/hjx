import { HJXAst } from "./types.js";
import { compileHandlersToJS } from "./compiler/vanilla_handlers.js";

export class ServerSession {
  private state: Record<string, any>;
  private handlers: Record<string, (ctx: any) => void>;

  constructor(ast: HJXAst) {
    this.state = { ...ast.state };

    // Compile handlers to JS string
    // The vanilla compiler generates an object literal string:
    // {
    //   inc: (ctx) => { ... },
    //   dec: (ctx) => { ... }
    // }
    const handlersJS = compileHandlersToJS(ast.handlers, Object.keys(ast.state));

    // Evaluate to get the handlers object
    try {
      // Use new Function to return the object
      const createHandlers = new Function(`return ${handlersJS};`);
      this.handlers = createHandlers();
    } catch (e) {
      console.error("Failed to compile handlers for server:", e);
      this.handlers = {};
    }
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
}
