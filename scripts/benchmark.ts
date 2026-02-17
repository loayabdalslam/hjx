
import { parseHJX } from "../src/parser";
import { buildVanilla } from "../src/compiler/vanilla";
import { scopeCss } from "../src/compiler/vanilla_scope_css";
import { buildServerDriven } from "../src/compiler/server_driven";
import { ServerSession } from "../src/server_session";
import { LoadedComponent } from "../src/loader";
import { JSDOM } from "jsdom";
import { performance } from "perf_hooks";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import * as esbuild from "esbuild";

// Helper to format numbers
const fmt = (n: number) => n.toFixed(4);

// Results storage
const results: string[] = [];
function log(msg: string) {
    console.log(msg);
    results.push(msg);
}

// Read runtime source
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const runtimePath = path.resolve(__dirname, "../src/runtime.ts");
let runtimeSource = fs.readFileSync(runtimePath, "utf-8");

// Prepare temp dir for server sessions
const sessionWorkDir = path.resolve(__dirname, "../temp_bench_sessions");
if (!fs.existsSync(sessionWorkDir)) {
    fs.mkdirSync(sessionWorkDir, { recursive: true });
}

// Mock Loader for Server Driven tests
function createLoadedComponent(source: string, name: string = "BenchComp"): LoadedComponent {
    const ast = parseHJX(source);
    ast.component.name = name;
    return {
        ast,
        path: `/mock/${name}.hjx`,
        imports: {}
    };
}

// Transpile TypeScript to JavaScript
const transformResult = esbuild.transformSync(runtimeSource, {
    loader: 'ts',
    target: 'es2020',
});
runtimeSource = transformResult.code;

// Sanitize runtime source for eval
// 1. Remove imports if any
// 2. Remove 'export' keywords
runtimeSource = runtimeSource.replace(/export function/g, "function");
// 3. We need to bundle these into a 'runtime' object as expected by the generated code
// Or better yet, just expose them globally or const destructure them.
// The generated code does: import { ... } from "./runtime.js";
// My previous mock did: const runtime = { ... }; const { ... } = runtime;
// The generated code in the benchmark uses standard imports which I replace.
// Let's make the runtime source just define the functions in the scope.

// 1. Generators
function generateLargeState(count: number): string {
    let s = `component LargeState\nstate:\n`;
    for (let i = 0; i < count; i++) {
        s += `  var${i} = ${i}\n`;
    }
    s += `layout:\n  view:\n`;
    return s;
}

function generateLargeLayout(count: number): string {
    let s = `component LargeLayout\nlayout:\n  view:\n`;
    for (let i = 0; i < count; i++) {
        s += `    text.item: "Item ${i}"\n`;
    }
    return s;
}

function generateLargeList(count: number): string {
    return `component LargeList
state:
  items = ${JSON.stringify(Array.from({ length: count }, (_, i) => ({ id: i, name: `Item ${i}` })))}
layout:
  view:
    for (item in items):
      text: "{{item.name}}"
`;
}

function generateConditional(count: number): string {
    let s = `component Conditional\nstate:\n  show = true\nlayout:\n  view:\n`;
    for (let i = 0; i < count; i++) {
        s += `    if (show):\n      text: "Visible ${i}"\n`;
    }
    return s;
}

function generateInputs(count: number): string {
    let s = `component Inputs\nstate:\n`;
    for (let i = 0; i < count; i++) {
        s += `  val${i} = "value ${i}"\n`;
    }
    s += `layout:\n  view:\n`;
    for (let i = 0; i < count; i++) {
        s += `    input(bind value <-> val${i}):\n`;
    }
    return s;
}

function generateInterpolation(count: number): string {
    let s = `component Interpolation\nstate:\n`;
    for (let i = 0; i < count; i++) {
        s += `  text${i} = "Initial ${i}"\n`;
    }
    s += `layout:\n  view:\n`;
    for (let i = 0; i < count; i++) {
        s += `    text: "{{text${i}}}"\n`;
    }
    return s;
}

function generateDeepNesting(depth: number): string {
    let s = `component DeepNesting\nlayout:\n`;
    let indent = 2;
    for (let i = 0; i < depth; i++) {
        s += `${" ".repeat(indent)}view.level${i}:\n`;
        indent += 2;
    }
    s += `${" ".repeat(indent)}text: "Deep!"\n`;
    return s;
}

function generateClickHandlers(count: number): string {
    let s = `component ClickHandlers\nstate:\n  counter = 0\nhandlers:\n  inc:\n    set counter = counter + 1\nlayout:\n  view:\n`;
    for (let i = 0; i < count; i++) {
        s += `    button.btn(on click -> inc): "Button ${i}"\n`;
    }
    return s;
}

function generateLargeCSS(rulesCount: number): string {
    let s = "";
    for (let i = 0; i < rulesCount; i++) {
        s += `.class-${i} { color: red; background: blue; }\n`;
    }
    return s;
}

// 2. Benchmark Runner
async function runBenchmarks() {
    log("# HJX Framework Benchmarks\n");
    log(`Date: ${new Date().toISOString()}`);
    log(`Platform: ${process.platform} ${process.arch}\n`);

    // --- Parser Benchmarks ---
    log("## Parser Performance\n");

    const stateSizes = [100, 1000, 5000];
    for (const size of stateSizes) {
        const code = generateLargeState(size);
        const start = performance.now();
        parseHJX(code);
        const end = performance.now();
        log(`- Parse ${size} state variables: ${fmt(end - start)} ms`);
    }

    const layoutSizes = [100, 1000, 5000];
    for (const size of layoutSizes) {
        const code = generateLargeLayout(size);
        const start = performance.now();
        parseHJX(code);
        const end = performance.now();
        log(`- Parse ${size} static nodes: ${fmt(end - start)} ms`);
    }
    log("");

    // --- Compiler Benchmarks ---
    log("## Compiler Performance\n");

    log("### AST to Vanilla JS (Layout & Bindings)\n");
    for (const size of layoutSizes) {
        const code = generateLargeLayout(size);
        const ast = parseHJX(code);
        const start = performance.now();
        buildVanilla(ast);
        const end = performance.now();
        log(`- Compile ${size} static nodes: ${fmt(end - start)} ms`);
    }
    log("");

    log("### CSS Scoping\n");
    const cssSizes = [100, 1000, 5000];
    for (const size of cssSizes) {
        const css = generateLargeCSS(size);
        const start = performance.now();
        scopeCss(css, "hjx-benchmark-scope");
        const end = performance.now();
        log(`- Scope ${size} CSS rules: ${fmt(end - start)} ms`);
    }
    log("");

    log("### Server-Driven Compilation\n");
    for (const size of layoutSizes) {
        const code = generateLargeLayout(size);
        const loaded = createLoadedComponent(code, `Layout${size}`);
        const start = performance.now();
        buildServerDriven(loaded);
        const end = performance.now();
        log(`- Compile ${size} static nodes (Server-Driven): ${fmt(end - start)} ms`);
    }
    log("");

    // --- Server Runtime Benchmarks ---
    log("## Server Runtime Performance (Node.js)\n");

    log("### Session Initialization\n");
    const sessionSizes = [100, 1000]; // 5000 might be too slow/heavy for file IO in loop
    for (const size of sessionSizes) {
        const code = generateClickHandlers(size); // has state and handlers
        const loaded = createLoadedComponent(code, `Session${size}`);
        const start = performance.now();
        const session = new ServerSession(loaded, sessionWorkDir);
        await session.ready();
        const end = performance.now();
        log(`- Init Session with ${size} handlers: ${fmt(end - start)} ms`);
        session.cleanup();
    }
    log("");

    log("### Server-Side Handler Execution\n");
    // Reuse a session for handler benchmarks
    const handlerCode = generateClickHandlers(1000);
    const handlerComp = createLoadedComponent(handlerCode, "HandlerBench");
    const session = new ServerSession(handlerComp, sessionWorkDir);
    await session.ready();

    const startHandler = performance.now();
    // execute 'inc' handler 1000 times
    for(let i=0; i<1000; i++) {
        session.runHandler("inc");
    }
    const endHandler = performance.now();
    log(`- Execute 1000 handler calls (state update): ${fmt(endHandler - startHandler)} ms`);
    log(`  Average per call: ${fmt((endHandler - startHandler)/1000)} ms`);
    session.cleanup();
    log("");

    // --- Runtime Benchmarks ---
    log("## Runtime Performance (JSDOM)\n");

    // Helper for running runtime tests
    function runRuntimeTest(name: string, sizes: number[], generator: (n: number) => string, updateFn?: (store: any, size: number, window: any) => void) {
        log(`### ${name}\n`);
        for (const size of sizes) {
             const code = generator(size);
            const ast = parseHJX(code);
            const { js, html } = buildVanilla(ast);

            const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
            const { window } = dom;
            global.document = window.document;
            global.HTMLElement = window.HTMLElement;
            global.HTMLTemplateElement = window.HTMLTemplateElement;
            global.HTMLInputElement = window.HTMLInputElement; // Added for inputs

            let scriptContent = js.replace(/import .* from "\.\/runtime\.js";/, "");
            scriptContent = scriptContent.replace(/export function/g, "function");
            scriptContent = scriptContent.replace(/mountApp\(\);[\s\S]*$/, "");
            scriptContent = scriptContent.replace("createApp(root);", "window.appResult = createApp(root);");

            const executableJS = `
            // Runtime
            ${runtimeSource}

            // App Code
            ${scriptContent}

            // Exec
            mountApp();

            // Expose store
            window.appStore = window.appResult.store;
            `;

            const start = performance.now();
            window.eval(executableJS);
            const end = performance.now();
            log(`- Initial Render ${size} items: ${fmt(end - start)} ms`);

            if (updateFn) {
                const store = window.appStore;
                const startUpdate = performance.now();
                updateFn(store, size, window);
                const endUpdate = performance.now();
                log(`- Update ${size} items: ${fmt(endUpdate - startUpdate)} ms`);
            }

            // Cleanup
            global.document = undefined as any;
            global.HTMLElement = undefined as any;
            global.HTMLTemplateElement = undefined as any;
            global.HTMLInputElement = undefined as any;
        }
        log("");
    }

    // 1. Static Render
    runRuntimeTest("Static Render", [100, 1000, 2000], generateLargeLayout);

    // 2. List Rendering
    runRuntimeTest("List Rendering (For Loop)", [100, 1000, 2000], generateLargeList, (store, size) => {
        const currentItems = store.get().items;
        store.set({ items: [...currentItems].reverse() });
    });

    // 3. Conditional Rendering (Toggle Visibility)
    runRuntimeTest("Conditional Rendering (If)", [100, 1000, 2000], generateConditional, (store, size) => {
        store.set({ show: false });
    });

    // 4. Input Binding (Update all inputs)
    runRuntimeTest("Input Binding (2-way)", [100, 500, 1000], generateInputs, (store, size) => {
        const patch: any = {};
        for(let i=0; i<size; i++) patch[`val${i}`] = `updated ${i}`;
        store.set(patch);
    });

    // 5. Text Interpolation
    runRuntimeTest("Text Interpolation", [100, 1000, 2000], generateInterpolation, (store, size) => {
        const patch: any = {};
        for(let i=0; i<size; i++) patch[`text${i}`] = `Updated ${i}`;
        store.set(patch);
    });

    // 6. Deep Nesting
    runRuntimeTest("Deep Nesting", [10, 50, 100], generateDeepNesting);

    // 7. Click Handlers
    runRuntimeTest("Click Handlers (Event Delegation)", [100, 1000, 2000], generateClickHandlers, (store, size, window) => {
        // Click every button
        const buttons = window.document.querySelectorAll("button");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].click();
        }
    });
}

runBenchmarks().then(() => {
    // Write to file
    fs.writeFileSync('Benchmark.md', results.join('\n'));
    console.log("Benchmarks saved to Benchmark.md");
}).catch(e => console.error(e));
