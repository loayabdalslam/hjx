export const RUNTIME_SOURCE = `// HJX runtime v0.1
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
  if (!el) return;
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
  if (!el) return;
  el.addEventListener("click", () => fn({ store }));
}

export function inputBinder(store, root, selector, stateKey) {
  const el = root.querySelector(selector);
  if (!el) return;
  const render = () => {
    const s = store.get();
    if (el.value !== String(s[stateKey] ?? "")) el.value = String(s[stateKey] ?? "");
  };
  render();
  store.subscribe(render);
  el.addEventListener("input", (e) => {
    const v = e.target.value;
    store.set({ [stateKey]: v });
  });
}

export function mount() {}
`;
