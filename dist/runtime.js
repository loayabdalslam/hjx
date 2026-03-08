export function createStore(initial) {
    const state = { ...initial };
    const listeners = new Set();
    return {
        get: () => state,
        set: (patch) => { Object.assign(state, patch); listeners.forEach(fn => fn()); },
        subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); }
    };
}
export function textBinder(store, root, selector, template) {
    const el = root.querySelector(selector);
    if (!el)
        return;
    const render = () => {
        const s = store.get();
        const out = template.replace(/\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g, (_, key) => String(s[key] ?? ""));
        el.textContent = out;
    };
    render();
    store.subscribe(render);
}
export function clickBinder(store, root, selector, fn) {
    const el = root.querySelector(selector);
    if (!el)
        return;
    // Use event delegation or direct attachment? vanilla.ts uses direct attachment in some places but code in vanilla.ts suggests delegated for dynamic items.
    // The vanilla.ts runtime source uses:
    // root.addEventListener("click", (e) => { ... })
    // But here we are passed a specific selector and sometimes the root IS the container.
    // Let's stick to what was here or align with vanilla.ts.
    // vanilla.ts runtimeSource uses delegation on root.
    // The previous implementation here attached to 'el'.
    // If 'el' is replaced by for loop re-render, we lose listeners.
    // However, for static clicks it's fine.
    // Let's implement delegation on root to be safe and match vanilla.ts runtime logic if possible.
    // But wait, the arguments are (store, root, selector, fn).
    // vanilla.ts runtimeSource:
    /*
    export function clickBinder(store, root, selector, fn) {
      // delegated click handler so dynamically inserted elements work
      root.addEventListener("click", (e) => {
        const target = e.target;
        if (!target || !target.closest) return;
        const matched = target.closest(selector);
        if (matched) fn({ store, event: e, el: matched });
      });
    }
    */
    // I will use that implementation.
    root.addEventListener("click", (e) => {
        const target = e.target;
        if (!target || !target.closest)
            return;
        const matched = target.closest(selector);
        if (matched)
            fn({ store, event: e, el: matched });
    });
}
export function inputBinder(store, root, selector, stateKey) {
    const el = root.querySelector(selector);
    if (!el)
        return;
    const render = () => {
        const s = store.get();
        if (el.value !== String(s[stateKey] ?? ""))
            el.value = String(s[stateKey] ?? "");
    };
    render();
    store.subscribe(render);
    el.addEventListener("input", (e) => {
        const v = e.target.value;
        store.set({ [stateKey]: v });
    });
}
export function ifBinder(store, root, selector, condition) {
    const el = root.querySelector(selector);
    if (!el)
        return;
    const render = () => {
        const s = store.get();
        const result = evalCondition(condition, s);
        el.style.display = result ? "" : "none";
    };
    render();
    store.subscribe(render);
}
export function forBinder(store, root, selector, itemName, listName) {
    const container = root.querySelector(selector);
    if (!container)
        return;
    // Improved implementation for runtime.ts
    const tpl = container.querySelector('template');
    let templateHtml = tpl ? tpl.innerHTML : container.innerHTML;
    const render = () => {
        const s = store.get();
        const list = getPath(s, listName) || [];
        container.innerHTML = ""; // This wipes the <template> if it was there
        if (!Array.isArray(list))
            return;
        list.forEach((item, idx) => {
            const itemState = { ...s, [itemName]: item };
            // Basic regex replacement for {{ key }}
            // Note: this simple regex doesn't handle nested objects in item well if just {{item}}
            // but handles {{item.prop}} via getPath
            const itemHtml = templateHtml.replace(/\{\{\s*([A-Za-z_.][A-Za-z0-9_.]*)\s*\}\}/g, (_, key) => {
                return String(getPath(itemState, key) ?? "");
            });
            const div = document.createElement("div");
            div.innerHTML = itemHtml;
            // attach item data
            const itemStr = typeof item === 'string' ? item : JSON.stringify(item);
            div.querySelectorAll('[data-hjx-click]').forEach(el => {
                el.setAttribute('data-hjx-idx', String(idx));
                el.setAttribute('data-hjx-item', itemStr);
            });
            // Append children (unwrap div)
            while (div.firstChild)
                container.appendChild(div.firstChild);
        });
    };
    render();
    store.subscribe(render);
}
function evalCondition(condition, state) {
    const trimmed = condition.trim();
    if (trimmed.startsWith("!")) {
        return !evalCondition(trimmed.slice(1), state);
    }
    if (trimmed.includes("===")) {
        const [left, right] = trimmed.split("===").map(s => s.trim());
        return getPath(state, left) === parseValue(right);
    }
    if (trimmed.includes("==")) {
        const [left, right] = trimmed.split("==").map(s => s.trim());
        return getPath(state, left) == parseValue(right);
    }
    if (trimmed.includes("!=")) {
        const [left, right] = trimmed.split("!=").map(s => s.trim());
        return getPath(state, left) != parseValue(right);
    }
    return !!getPath(state, trimmed);
}
function getPath(obj, path) {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}
function parseValue(v) {
    const trimmed = v.trim();
    if (trimmed === "true")
        return true;
    if (trimmed === "false")
        return false;
    if (/^".*"$/.test(trimmed))
        return trimmed.slice(1, -1);
    if (/^'.*'$/.test(trimmed))
        return trimmed.slice(1, -1);
    if (/^\d+$/.test(trimmed))
        return parseInt(trimmed);
    return trimmed;
}
export function mount() { }
// Effect stack for dependency tracking
let currentEffect = null;
const effectStack = [];
// Batch management
let batching = false;
let batchDepth = 0;
const batchedEffects = new Set();
// Microtask scheduling
let pendingMicrotask = null;
const pendingEffects = new Set();
// Performance tracking (dev only)
let renderCount = 0;
const renderTimes = [];
/**
 * Start a batch operation
 */
export function startBatch() {
    batching = true;
    batchDepth++;
}
/**
 * End a batch operation
 */
export function endBatch() {
    batchDepth--;
    if (batchDepth === 0) {
        batching = false;
        // Execute batched effects
        batchedEffects.forEach(fn => fn());
        batchedEffects.clear();
    }
}
/**
 * Execute a function in a batch
 */
export function batch(fn) {
    startBatch();
    try {
        return fn();
    }
    finally {
        endBatch();
    }
}
/**
 * Create a signal
 */
export function createSignal(initial) {
    let value = initial;
    const subscribers = new Set();
    const signal = {
        get: () => {
            if (currentEffect) {
                subscribers.add(currentEffect);
            }
            return value;
        },
        set: (newValue) => {
            const next = typeof newValue === 'function'
                ? newValue(value)
                : newValue;
            if (Object.is(value, next))
                return;
            value = next;
            renderCount++;
            if (batching) {
                // Add to batched effects
                subscribers.forEach(fn => batchedEffects.add(fn));
            }
            else {
                // Schedule in microtask to avoid duplicate updates
                if (!pendingMicrotask) {
                    pendingMicrotask = Promise.resolve().then(() => {
                        pendingMicrotask = null;
                        const start = performance.now();
                        pendingEffects.forEach(fn => fn());
                        pendingEffects.clear();
                        renderTimes.push(performance.now() - start);
                    });
                }
                subscribers.forEach(fn => pendingEffects.add(fn));
            }
        },
        peek: () => value,
        subscribe: (fn) => {
            subscribers.add(fn);
            return () => subscribers.delete(fn);
        }
    };
    return signal;
}
/**
 * Create an effect
 */
export function createEffect(fn) {
    const effect = () => {
        try {
            effectStack.push(effect);
            currentEffect = effect;
            fn();
        }
        finally {
            effectStack.pop();
            currentEffect = effectStack[effectStack.length - 1] || null;
        }
    };
    effect();
    return () => {
        // Cleanup would be implemented here
    };
}
/**
 * Create a memoized computed value
 */
export function createMemo(fn) {
    // Create signal with initial computed value
    const signal = createSignal(fn());
    // Re-run computation when dependencies change
    createEffect(() => {
        signal.set(fn());
    });
    return signal;
}
// If you need both the signal and a way to mark it as dirty
export function createDirtyMemo(fn) {
    const signal = createSignal(fn());
    let dirty = true;
    const update = () => {
        if (dirty) {
            signal.set(fn());
            dirty = false;
        }
    };
    createEffect(update);
    return {
        value: signal,
        dirty: () => {
            dirty = true;
            update();
        }
    };
}
// Environment detection
function isDevelopment() {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
        return process.env.NODE_ENV === 'development';
    }
    if (typeof window !== 'undefined' && window.location) {
        return window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';
    }
    return false;
}
// Safe setTimeout patching for development
function setupDevTools() {
    if (typeof window === 'undefined')
        return;
    const isDev = isDevelopment();
    if (isDev) {
        window.__HJX_DEV__ = true;
        window.__HJX_RENDERS__ = [];
        // Store original setTimeout
        const originalSetTimeout = window.setTimeout;
        // Type-safe wrapper
        window.setTimeout = function (callback, delay, ...args) {
            if (delay === 0 && callback.name?.includes('updateDOM')) {
                window.__HJX_RENDERS__.push({
                    time: Date.now(),
                    fn: callback.name || 'anonymous'
                });
            }
            return originalSetTimeout(callback, delay, ...args);
        };
        // Add performance metrics
        window.__HJX_PERFORMANCE__ = {
            get renderCount() { return renderCount; },
            get averageRenderTime() {
                return renderTimes.length > 0
                    ? renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length
                    : 0;
            },
            get totalRenderTime() {
                return renderTimes.reduce((a, b) => a + b, 0);
            }
        };
        window.__HJX_VISUALIZE__ = function () {
            const graph = window.__HJX__?.graph;
            if (!graph) {
                console.warn("HJX: No graph data found. Ensure your generator has populated window.__HJX__.graph");
                return;
            }
            console.group("📊 HJX Dependency Graph");
            console.log("State to Elements:", Object.fromEntries(graph.stateToElements));
            console.log("Computed Dependencies:", Object.fromEntries(graph.computedDeps));
            console.log("Metrics:", graph.metrics);
            console.groupEnd();
            alert("Check the browser console (F12) to see the dependency graph details!");
        };
        console.log('%c🔧 HJX Runtime Ready (Development Mode)', 'color: #3b82f6; font-weight: bold;');
    }
}
// Initialize dev tools
setupDevTools();
/**
 * Enable development tools manually
 */
export function enableDevTools() {
    if (typeof window === 'undefined')
        return;
    window.__HJX_DEV__ = true;
    // Implementation of the visualize function
    window.__HJX_VISUALIZE__ = () => {
        console.log("%c📊 HJX Dependency Graph", "color: #3b82f6; font-weight: bold; font-size: 12px;");
        console.log("HJX Graph:", window.__HJX__?.graph || "No graph data available.");
    };
    console.log('%c✨ HJX DevTools Enabled', 'background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px;');
    console.log('Use: window.__HJX_VISUALIZE__()');
    if (!window.__HJX_RENDERS__) {
        window.__HJX_RENDERS__ = [];
    }
    console.log('%c✨ HJX DevTools Enabled', 'background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px;');
    console.log('Run window.__HJX_VISUALIZE__() to see dependency graph');
}
/**
 * Get performance metrics
 */
export function getPerformanceMetrics() {
    return {
        renderCount,
        averageRenderTime: renderTimes.length > 0
            ? renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length
            : 0,
        totalRenderTime: renderTimes.reduce((a, b) => a + b, 0)
    };
}
// Export for use in compiled code
export default {
    createSignal,
    createEffect,
    createMemo,
    batch,
    enableDevTools,
    getPerformanceMetrics
};
