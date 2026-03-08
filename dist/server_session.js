import { writeFileSync, unlinkSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { compileHandlersToJS } from "./compiler/vanilla_handlers.js";
import { renderNode } from "./compiler/server_driven.js";
// Simple UUID polyfill if not available
function genId() {
    return Math.random().toString(36).substring(2, 15);
}
export class ServerSession {
    state;
    handlers = {};
    children = {};
    readyPromise;
    tempFile = null;
    onPatchCallback = null;
    dynamicBlocks = [];
    component;
    constructor(component, workDir, initialProps = {}) {
        this.state = { ...component.ast.state, ...initialProps };
        this.readyPromise = this.init(component, workDir);
    }
    onPatch(cb) {
        this.onPatchCallback = cb;
    }
    async init(component, workDir) {
        this.component = component;
        const ast = component.ast;
        // 1. Initialize children and dynamic blocks
        const childPromises = [];
        if (ast.layout) {
            const scope = `hjx-${ast.component.name.toLowerCase()}`;
            this.traverseLayout(ast.layout, component, scope, "", workDir, childPromises, { autoId: 0 });
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
        if (!existsSync(sessionDir))
            mkdirSync(sessionDir, { recursive: true });
        const filename = `session-${genId()}.mjs`;
        this.tempFile = join(sessionDir, filename);
        writeFileSync(this.tempFile, moduleSource, "utf-8");
        // init store: background tasks only send individual patches (no full re-render)
        const store = this.createStore(false);
        try {
            // 4. Import it
            const fileUrl = pathToFileURL(this.tempFile).href;
            const mod = await import(fileUrl);
            this.handlers = mod.handlers;
            console.log(`Loaded server script: ${this.tempFile}`);
            // 5. Call exported init if exists
            if (typeof mod.init === "function") {
                mod.init(store);
            }
        }
        catch (e) {
            console.error("Failed to load server script:", e);
            this.handlers = {};
        }
        await Promise.all(childPromises);
    }
    traverseLayout(node, comp, scope, statePrefix, workDir, promises, ctx) {
        const imports = comp.imports;
        if (node.tag === "slot") {
            // Slots are virtual, don't consume IDs
            if (node.children) {
                for (const child of node.children) {
                    this.traverseLayout(child, comp, scope, statePrefix, workDir, promises, ctx);
                }
            }
            return;
        }
        if (node.kind === "if" || node.kind === "for" || node.kind === "else") {
            // Virtual nodes don't consume IDs, but we must traverse children
            if (node.children) {
                for (const child of node.children) {
                    // Isolate loop ID sequence to keep main sequence stable
                    const loopCtx = node.kind === "for" ? { autoId: 0 } : ctx;
                    this.traverseLayout(child, comp, scope, statePrefix, workDir, promises, loopCtx);
                }
            }
            return;
        }
        if (imports[node.tag]) {
            const instanceId = ctx.autoId++;
            const childKey = `${node.tag}_${instanceId}`;
            const childComp = imports[node.tag];
            const childProps = {};
            for (const [k, v] of Object.entries(node.attrs)) {
                if (!v.includes("{{")) {
                    if (v === "true")
                        childProps[k] = true;
                    else if (v === "false")
                        childProps[k] = false;
                    else {
                        const n = Number(v);
                        childProps[k] = !isNaN(n) ? n : v;
                    }
                }
            }
            const childSession = new ServerSession(childComp, workDir, childProps);
            this.children[childKey] = childSession;
            childSession.onPatch((p) => {
                const pref = {};
                for (const [k, v] of Object.entries(p))
                    pref[`${childKey}.${k}`] = v;
                if (this.onPatchCallback)
                    this.onPatchCallback(pref);
            });
            promises.push(childSession.ready());
        }
        else {
            ctx.autoId++;
        }
        if (node.children) {
            for (const child of node.children) {
                this.traverseLayout(child, comp, scope, statePrefix, workDir, promises, ctx);
            }
        }
    }
    reRenderBlocks(comp) {
        const scope = `hjx-${comp.ast.component.name.toLowerCase()}`;
        // Full component re-render for MVP
        // getState() provides the full nested state tree, which renderNode now supports via getValueByPath
        const { htmlBody } = renderNode(comp.ast.layout, scope, comp.imports, "", {}, {}, {}, { autoId: 0 }, this.getState());
        if (this.onPatchCallback) {
            this.onPatchCallback({ _html: htmlBody });
        }
    }
    evaluateExpression(expr) {
        // Basic property getter for MVP
        if (this.state[expr] !== undefined)
            return this.state[expr];
        try {
            // Dangerous but okay for internal dev POC
            const fn = new Function("state", `with(state) { return ${expr}; }`);
            return fn(this.state);
        }
        catch (e) {
            return false;
        }
    }
    async ready() {
        return this.readyPromise;
    }
    getState() {
        const s = { ...this.state };
        for (const [alias, child] of Object.entries(this.children)) {
            s[alias] = child.getState();
        }
        return s;
    }
    updateState(patch) {
        const localPatch = {};
        const childrenPatches = {};
        for (const [key, val] of Object.entries(patch)) {
            if (key.includes(".")) {
                const [alias, ...rest] = key.split(".");
                if (this.children[alias]) {
                    if (!childrenPatches[alias])
                        childrenPatches[alias] = {};
                    childrenPatches[alias][rest.join(".")] = val;
                }
            }
            else {
                localPatch[key] = val;
            }
        }
        Object.assign(this.state, localPatch);
        for (const [alias, childPatch] of Object.entries(childrenPatches)) {
            this.children[alias].updateState(childPatch);
        }
        return patch;
    }
    createStore(structural, outPatch) {
        return {
            get: (key) => (key ? this.state[key] : this.state),
            set: (p) => {
                Object.assign(this.state, p);
                if (outPatch)
                    Object.assign(outPatch, p);
                // ALWAYS synchronize state with client first
                if (this.onPatchCallback) {
                    this.onPatchCallback(p);
                }
                // Conditionally trigger full re-render for structural changes
                if (structural) {
                    this.reRenderBlocks(this.component);
                }
            }
        };
    }
    runHandler(handlerName, mockEl) {
        if (handlerName.includes(".")) {
            const [alias, ...rest] = handlerName.split(".");
            const childName = rest.join(".");
            if (this.children[alias]) {
                const childPatch = this.children[alias].runHandler(childName, mockEl);
                if (childPatch) {
                    const prefixedPatch = {};
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
        let patch = {};
        const ctx = {
            store: this.createStore(true, patch),
            el: mockEl // pass mock element with dataset from event payload
        };
        try {
            handler(ctx);
        }
        catch (e) {
            console.error(`Error in handler ${handlerName}:`, e);
            throw e;
        }
        return Object.keys(patch).length > 0 ? patch : null;
    }
    cleanup() {
        if (this.tempFile && existsSync(this.tempFile)) {
            try {
                unlinkSync(this.tempFile);
            }
            catch (e) { }
        }
        for (const child of Object.values(this.children)) {
            child.cleanup();
        }
    }
}
