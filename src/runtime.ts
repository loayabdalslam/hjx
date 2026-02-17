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

export function mount() {}
