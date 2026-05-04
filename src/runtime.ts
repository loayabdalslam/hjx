export function textBinder(store: any, root: Element, selector: string, template: string) {
  const el = root.querySelector(selector) as HTMLElement | null;
  if (!el) return;
  const render = () => {
    const s = store.get();
    const out = template.replace(/\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g, (_: any, key: string) => String(s[key] ?? ""));
    el.textContent = out;
  };
  render();
  store.subscribe(render);
}

export function clickBinder(store: any, root: Element, selector: string, fn: (ctx: any) => void) {
  const el = root.querySelector(selector) as HTMLElement | null;
  if (!el) return;
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
  root.addEventListener("click", (e: any) => {
    const target = e.target as Element;
    if (!target || !target.closest) return;
    const matched = target.closest(selector);
    if (matched) fn({ store, event: e, el: matched });
  });
}

export function inputBinder(store: any, root: Element, selector: string, stateKey: string) {
  const el = root.querySelector(selector) as HTMLInputElement | null;
  if (!el) return;
  const render = () => {
    const s = store.get();
    if (el.value !== String(s[stateKey] ?? "")) el.value = String(s[stateKey] ?? "");
  };
  render();
  store.subscribe(render);
  el.addEventListener("input", (e: any) => {
    const v = e.target.value;
    store.set({ [stateKey]: v });
  });
}

export function ifBinder(store: any, root: Element, selector: string, condition: string) {
  const el = root.querySelector(selector) as HTMLElement | null;
  if (!el) return;
  const render = () => {
    const s = store.get();
    const result = evalCondition(condition, s);
    el.style.display = result ? "" : "none";
  };
  render();
  store.subscribe(render);
}

export function forBinder(store: any, root: Element, selector: string, itemName: string, listName: string) {
  const container = root.querySelector(selector) as HTMLElement | null;
  if (!container) return;

  // Improved implementation for runtime.ts
  const tpl = container.querySelector('template');
  let templateHtml = tpl ? tpl.innerHTML : container.innerHTML;

  const render = () => {
    const s = store.get();
    const list = getPath(s, listName) || [];

    container.innerHTML = ""; // This wipes the <template> if it was there

    if (!Array.isArray(list)) return;

    list.forEach((item: any, idx: number) => {
      const itemState = { ...s, [itemName]: item };
      // Basic regex replacement for {{ key }}
      // Note: this simple regex doesn't handle nested objects in item well if just {{item}}
      // but handles {{item.prop}} via getPath
      const itemHtml = templateHtml.replace(/\{\{\s*([A-Za-z_.][A-Za-z0-9_.]*)\s*\}\}/g, (_: any, key: string) => {
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
      while (div.firstChild) container.appendChild(div.firstChild);
    });
  };

  render();
  store.subscribe(render);
}

function evalCondition(condition: string, state: any): boolean {
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

function getPath(obj: any, path: string) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

function parseValue(v: string) {
  const trimmed = v.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^".*"$/.test(trimmed)) return trimmed.slice(1, -1);
  if (/^'.*'$/.test(trimmed)) return trimmed.slice(1, -1);
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed);
  return trimmed;
}

// ==============================================
// Minimal runtime for signal tracking
// This is the only code that runs in the browser
// ==============================================
// Signal Types
export interface Signal<T> {
  get(): T;
  set(value: T | ((prev: T) => T)): void;
  peek(): T;
  subscribe(fn: () => void): () => void;
}

// Effect stack for dependency tracking
let currentEffect: (() => void) | null = null;
const effectStack: Array<() => void> = [];

// Batch management
let batching = false;
let batchDepth = 0;
const batchedEffects = new Set<() => void>();

// Microtask scheduling
let pendingMicrotask: Promise<void> | null = null;
const pendingEffects = new Set<() => void>();

// Performance tracking (dev only)
let renderCount = 0;
const renderTimes: number[] = [];

/**
 * Start a batch operation
 */
export function startBatch(): void {
  batching = true;
  batchDepth++;
}

/**
 * End a batch operation
 */
export function endBatch(): void {
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
export function batch<T>(fn: () => T): T {
  startBatch();
  try {
    return fn();
  } finally {
    endBatch();
  }
}

/**
 * Create a signal
 */
export function createSignal<T>(initial: T): Signal<T> {
  let value = initial;
  const subscribers = new Set<() => void>();
  
  const signal: Signal<T> = {
    get: () => {
      if (currentEffect) {
        subscribers.add(currentEffect);
      }
      return value;
    },
    
    set: (newValue: T | ((prev: T) => T)) => {
      const next = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(value)
        : newValue;
      
      if (Object.is(value, next)) return;
      
      value = next;
      renderCount++;
      
      if (batching) {
        // Add to batched effects
        subscribers.forEach(fn => batchedEffects.add(fn));
      } else {
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
    
    subscribe: (fn: () => void) => {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    }
  };
  
  return signal;
}

/**
 * Create an effect
 */
export function createEffect(fn: () => void): () => void {
  const effect = () => {
    try {
      effectStack.push(effect);
      currentEffect = effect;
      fn();
    } finally {
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
export function createMemo<T>(fn: () => T): Signal<T> {
  // Create signal with initial computed value
  const signal = createSignal<T>(fn());
  
  // Re-run computation when dependencies change
  createEffect(() => {
    signal.set(fn());
  });
  
  return signal;
}

// If you need both the signal and a way to mark it as dirty
export function createDirtyMemo<T>(fn: () => T): { value: Signal<T>; dirty: () => void } {
  const signal = createSignal<T>(fn());
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

// Development tools interface
export interface HJXDevTools {
  graph: {
    stateToElements: Array<[string, string[]]>;
    computedDeps: Array<[string, string[]]>;
    metrics: {
      totalElements: number;
      totalExpressions: number;
      hotStates: string[];
    };
    elementExpressions: Array<[string, Array<{ type: string; deps: string[] }>]>;
  };
  signals: Record<string, any>;
}

declare global {
  interface Window {
    __HJX_DEV__?: boolean;
    __HJX__?: HJXDevTools;
     __HJX_VISUALIZE__: Function;
    __HJX_MONITOR__?: (interval?: number) => () => void;
    __HJX_RENDERS__?: Array<{ time: number; fn: string }>;
    __HJX_PERFORMANCE__?: {
      renderCount: number;
      averageRenderTime: number;
      totalRenderTime: number;
    };
  }
  
  // For Node.js environment
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string;
    }
  }
}

// Environment detection
function isDevelopment(): boolean {
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
function setupDevTools(): void {
  if (typeof window === 'undefined') return;
  
  const isDev = isDevelopment();
  
  if (isDev) {
    window.__HJX_DEV__ = true;
    window.__HJX_RENDERS__ = [];
    
    // Store original setTimeout
    const originalSetTimeout = window.setTimeout;
    
    // Type-safe wrapper
    window.setTimeout = function<TArgs extends any[]>(
      callback: (...args: TArgs) => void,
      delay?: number,
      ...args: TArgs
    ): number {
      if (delay === 0 && callback.name?.includes('updateDOM')) {
        window.__HJX_RENDERS__!.push({
          time: Date.now(),
          fn: callback.name || 'anonymous'
        });
      }
      return originalSetTimeout(callback, delay, ...args);
    } as typeof window.setTimeout;
    
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

    window.__HJX_VISUALIZE__ = function() {
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
export function enableDevTools(): void {
  if (typeof window === 'undefined') return;
  
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
export function getPerformanceMetrics(): {
  renderCount: number;
  averageRenderTime: number;
  totalRenderTime: number;
} {
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