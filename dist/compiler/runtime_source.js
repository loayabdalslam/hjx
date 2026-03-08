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
    const out = template.replace(/\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}/g, (_, key) => String((key.split('.').reduce((a,b)=>a&&a[b], s)) ?? ""));
    el.textContent = out;
  };
  render();
  store.subscribe(render);
}

export function clickBinder(store, root, selector, fn) {
  // delegated click handler so dynamically inserted elements work
  root.addEventListener("click", (e) => {
    const target = e.target;
    if (!target || !target.closest) return;
    const matched = target.closest(selector);
    if (matched) fn({ store, event: e, el: matched });
  });
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

// Control flow bindings
export function ifBinder(store, root, selector, condition) {
  const el = root.querySelector(selector);
  if (!el) return;
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
  if (!container) return;
  
  const render = () => {
    const s = store.get();
    const list = getPath(s, listName) || [];
    const tpl = container.querySelector('template');
    const templateHtml = tpl ? tpl.innerHTML : container.innerHTML;

    container.innerHTML = "";

    if (!Array.isArray(list)) return;
    list.forEach((item, idx) => {
      const itemState = { ...s, [itemName]: item };
      const itemHtml = templateHtml.replace(/\{\{\s*([A-Za-z_.][A-Za-z0-9_.]*)\s*\}\}/g, (_, key) => {
        return String(getPath(itemState, key) ?? "");
      });
      const div = document.createElement("div");
      div.innerHTML = itemHtml;
      // attach item data so handlers can identify and manipulate it
      const itemStr = typeof item === 'string' ? item : JSON.stringify(item);
      div.querySelectorAll('[data-hjx-click]').forEach(el => {
        el.setAttribute('data-hjx-idx', String(idx));
        el.setAttribute('data-hjx-item', itemStr);
      });
      while (div.firstChild) container.appendChild(div.firstChild);
    });
  };
  
  render();
  store.subscribe(render);
}

function evalCondition(condition, state) {
  const trimmed = condition.trim();
  if (trimmed.startsWith("!")) return !evalCondition(trimmed.slice(1), state);
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
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function parseValue(v) {
  const t = v.trim();
  if (t === "true") return true;
  if (t === "false") return false;
  if (/^".*"$/.test(t) || /^'.*'$/.test(t)) return t.slice(1, -1);
  if (/^-?\d+$/.test(t)) return parseInt(t, 10);
  return t;
}

export function mount() {}
`;
