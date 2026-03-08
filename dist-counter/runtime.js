// HJX runtime v0.1 (Server Driven)

export function createRemoteStore(wsUrl, initial, rootEl) {
  const state = { ...initial };
  const listeners = new Set();
  let ws;

  function connect() {
    ws = new WebSocket(wsUrl);
    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.type === "state") {
          Object.assign(state, data.payload);
          notify();
        } else if (data.type === "patch") {
          if (data.payload._html) {
            rootEl.innerHTML = data.payload._html;
            if (window._hjx_rebind) window._hjx_rebind();
          }
          applyPatch(state, data.payload);
          notify();
        }
      } catch (e) {}
    };
    ws.onclose = () => {
      console.log("Disconnected. Reconnecting...");
      setTimeout(connect, 1000);
    };
  }

  connect();

  function notify() {
    listeners.forEach(fn => fn());
  }

  return {
    get: () => state,
    set: (patch) => {
      applyPatch(state, patch);
      notify();
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "state_update", payload: patch }));
      }
    },
    sendEvent: (handlerName, payload = {}) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "event", name: handlerName, payload }));
      }
    },
    subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); }
  };
}

function applyPatch(state, patch) {
  console.log("HJX Applying patch:", patch);
  for (const [key, value] of Object.entries(patch)) {
    if (key.includes(".")) {
      const parts = key.split(".");
      let target = state;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!target[parts[i]]) target[parts[i]] = {};
        target = target[parts[i]];
      }
      target[parts[parts.length - 1]] = value;
    } else {
      state[key] = value;
    }
  }
}

function getByPath(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

export function textBinder(store, root, selector, template) {
  const el = root.querySelector(selector);
  if (!el) return;
  const render = () => {
    const s = store.get();
    const out = template.replace(/\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}/g, (_, key) => String(getByPath(s, key) ?? ""));
    el.textContent = out;
  };
  render();
  store.subscribe(render);
}

export function attrBinder(store, root, selector, attr, template) {
  const el = root.querySelector(selector);
  if (!el) return;
  const render = () => {
    const s = store.get();
    const out = template.replace(/\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}/g, (_, key) => String(getByPath(s, key) ?? ""));

    if (out === "false" || out === "null" || out === "undefined") {
      el.removeAttribute(attr);
    } else {
      el.setAttribute(attr, out);
    }

    if (attr === "value" && "value" in el) {
        el.value = out;
    }
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
    const val = getByPath(s, stateKey);
    if (el.value !== String(val ?? "")) el.value = String(val ?? "");
  };
  render();
  store.subscribe(render);
  el.addEventListener("input", (e) => {
    const v = e.target.value;
    store.set({ [stateKey]: v });
  });
}

export function mount() {}
