export function createStore(initial: Record<string, any>) {
  const state = { ...initial };
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set: (patch: Record<string, any>) => { Object.assign(state, patch); listeners.forEach(fn => fn()); },
    subscribe: (fn: () => void) => { listeners.add(fn); return () => listeners.delete(fn); }
  };
}

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
  el.addEventListener("click", () => fn({ store }));
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

export function mount() {}
