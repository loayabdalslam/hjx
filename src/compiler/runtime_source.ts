export const RUNTIME_SOURCE = `// HJX runtime v0.2 - Signal-based Reactivity

// Effect tracking
let currentEffect = null;
const effectStack = [];

// Batch management
let isBatching = false;
const batchQueue = new Set();
let batchDepth = 0;

// Microtask scheduling
let pendingMicrotask = null;
const pendingEffects = new Set();

// Performance tracking
let renderCount = 0;
const renderTimes = [];

// Signals registry for global access
const signals = {};

/**
 * Start a batch operation
 */
export function startBatch() {
  isBatching = true;
  batchDepth++;
}

/**
 * End a batch operation
 */
export function endBatch() {
  batchDepth--;
  if (batchDepth === 0) {
    isBatching = false;
    batchQueue.forEach(fn => fn());
    batchQueue.clear();
  }
}

/**
 * Execute a function in a batch
 */
export function batch(fn) {
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
      if (Object.is(value, newValue)) return;
      value = newValue;
      renderCount++;

      if (isBatching) {
        subscribers.forEach(fn => batchQueue.add(fn));
      } else {
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
    } finally {
      effectStack.pop();
      currentEffect = effectStack[effectStack.length - 1] || null;
    }
  };

  effect();

  return () => {
    // Cleanup function
  };
}

/**
 * Create a memoized computed value
 */
export function createMemo(fn) {
  const signal = createSignal(fn());
  createEffect(() => {
    signal.set(fn());
  });
  return signal;
}

/**
 * Get signal value by key (for template interpolation)
 */
export function getSignalValue(key) {
  if (key in signals) {
    return signals[key].get();
  }
  // Support nested properties
  const parts = key.split('.');
  let obj = signals;
  for (const part of parts) {
    if (obj && typeof obj === 'object' && part in obj) {
      if (obj[part] && typeof obj[part].get === 'function') {
        return obj[part].get();
      }
      obj = obj[part];
    } else {
      return undefined;
    }
  }
  return obj;
}

/**
 * Get all signals
 */
export function getSignals() {
  const result = {};
  for (const [key, signal] of Object.entries(signals)) {
    result[key] = signal.get();
  }
  return result;
}

/**
 * Evaluate condition expression
 */
export function evalCondition(condition) {
  const trimmed = condition.trim();
  
  if (trimmed.startsWith("!")) {
    return !evalCondition(trimmed.slice(1));
  }

  if (trimmed.includes("===")) {
    const [left, right] = trimmed.split("===").map(s => s.trim());
    return getSignalValue(left) === parseValue(right);
  }

  if (trimmed.includes("==")) {
    const [left, right] = trimmed.split("==").map(s => s.trim());
    return getSignalValue(left) == parseValue(right);
  }

  if (trimmed.includes("!=")) {
    const [left, right] = trimmed.split("!=").map(s => s.trim());
    return getSignalValue(left) != parseValue(right);
  }

  return !!getSignalValue(trimmed);
}

/**
 * Parse literal value
 */
function parseValue(v) {
  const trimmed = v.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^".*"$/.test(trimmed) || /^'.*'$/.test(trimmed)) return trimmed.slice(1, -1);
  if (/^-?\\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  return trimmed;
}

/**
 * Setup DOM bindings (click delegation)
 */
export function setupBindings(rootEl, handlers) {
  // Delegated click handler
  rootEl.addEventListener("click", (e) => {
    const target = e.target;
    if (!target || !target.closest) return;
    const matched = target.closest('[data-hjx-click]');
    if (matched) {
      const handlerName = matched.getAttribute('data-hjx-click');
      if (handlers[handlerName]) {
        batch(() => {
          handlers[handlerName]({ 
            store: { 
              get: getSignals, 
              set: (patch) => {
                for (const [k, v] of Object.entries(patch)) {
                  if (signals[k]) signals[k].set(v);
                }
              }
            },
            event: e, 
            el: matched 
          });
        });
      }
    }
  });
}

/**
 * Cleanup function for HMR
 */
export function cleanup() {
  if (window.__hjx_cleanups) {
    window.__hjx_cleanups.forEach(fn => fn());
    window.__hjx_cleanups = [];
  }
}

/**
 * Mount function (kept for compatibility)
 */
export function mount() {}

// DevTools setup
if (typeof window !== 'undefined') {
  window.__HJX_DEV__ = window.__HJX_DEV__ || false;
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
  
  console.log('%c HJX v0.2 Signal-based Runtime Ready', 'color: #3b82f6; font-weight: bold;');
}
`;
