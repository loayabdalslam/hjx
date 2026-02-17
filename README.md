

<h1 align="center">HJX</h1>

<p align="center">
  <strong>The Unified UI Language</strong><br/>
  One file. HTML + CSS + JS. Zero config.
</p>

<p align="center">
  <a href="https://github.com/loayabdalslam/hjx"><img src="https://img.shields.io/badge/version-0.1.0-blue" alt="Version" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License" /></a>
  <a href="https://github.com/loayabdalslam/hjx"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome" /></a>
</p>

---

## What is HJX?

HJX is a compiled UI language that unifies **structure**, **style**, and **logic** into a single `.hjx` file. It compiles to clean, dependency-free **HTML + CSS + JavaScript** — no virtual DOM, no runtime overhead, no framework lock-in.

```hjx
component Counter

state:
  count = 0

layout:
  view#root.card:
    text.title: "Count: {{count}}"
    button.primary (on click -> inc): "Increase"

style:
  .card { padding: 16px; border: 1px solid #ddd; border-radius: 12px; }
  .primary { padding: 10px 14px; border-radius: 10px; cursor: pointer; }

handlers:
  inc:
    set count = count + 1
```

**That's it.** One file → a fully working interactive counter. No imports, no boilerplate, no configuration.

---

## ✨ Showcase

### 🔢 Counter — Reactive State in 15 Lines

```hjx
component Counter

state:
  count = 0

layout:
  view#root.card:
    text.title: "Count: {{count}}"
    button.primary (on click -> inc): "Increase"
    button.ghost (on click -> dec): "Decrease"

style:
  .card { padding: 16px; border: 1px solid #ddd; border-radius: 12px; display: inline-flex; flex-direction: column; gap: 12px; }
  .primary { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 0; }
  .ghost { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 1px solid #ddd; background: transparent; }

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
```

### 📝 Two-Way Form Binding

```hjx
component SimpleForm

state:
  email = ""
  msg = "Type your email"

layout:
  view.card:
    text.title: "Newsletter"
    input.field (bind value <-> email)
    text.hint: "You typed: {{email}}"
    button.primary (on click -> submit): "Submit"
    text.note: "{{msg}}"

handlers:
  submit:
    set msg = "Submitted ✅"
```

### 📋 Todo List — Loops, Conditionals, Dynamic Arrays

```hjx
component TodoList

state:
  items = ["Learn HJX", "Build a UI", "Deploy to production"]
  newItem = ""
  showCompleted = false

layout:
  view.container:
    view.header:
      text.title: "My Todo List"
      text.count: "Items: {{items.length}} tasks"

    view.input-section:
      input.todo-input (bind value <-> newItem):
      button.add-btn (on click -> addItem): "Add"

    view.list:
      for (todo in items):
        view.todo-item:
          text: "• {{todo}}"

    view.footer:
      button.toggle-btn (on click -> toggleCompleted): "Show Completed"
      if (showCompleted):
        text.completed-note: "👍 All tasks completed!"

handlers:
  addItem:
    set items = [...items, newItem]
    set newItem = ""
  toggleCompleted:
    set showCompleted = !showCompleted
```

### 🖥️ Real-Time Dashboard — Server-Driven Rendering

```hjx
component Dashboard

imports:
  Card from "./components/Card.hjx"
  Button from "./components/Button.hjx"

state:
  uptime = 0
  serverTime = ""
  cpuUsage = 45
  status = "Operational"
  alerts = ["High CPU Usage", "New login from unknown device"]

script:
  export function init(store) {
    setInterval(() => {
      store.set({
        uptime: store.get("uptime") + 1,
        serverTime: new Date().toLocaleTimeString(),
        cpuUsage: Math.floor(Math.random() * 20) + 30
      });
    }, 1000);
  }

layout:
  view.min-h-screen.bg-slate-50.p-8:
    view.max-w-6xl.mx-auto.space-y-8:
      view.text-3xl.font-bold: "System Dashboard"
      view.grid.grid-cols-1.md:grid-cols-2.lg:grid-cols-4.gap-4:
        Card (title="Uptime"):
          view.text-2xl.font-bold: "{{uptime}}s"
        Card (title="CPU"):
          view.text-2xl.font-bold: "{{cpuUsage}}%"
      for (alert in alerts):
        view.bg-white.border.p-3.rounded.shadow-sm: "{{alert}}"
```

### 🧩 Component Composition with Slots

```hjx
component CompositionDemo

imports:
  Button from "./components/Button.hjx"
  Input from "./components/Input.hjx"
  Card from "./components/Card.hjx"

state:
  name = ""
  count = 0

layout:
  view.min-h-screen.bg-background.flex.items-center.justify-center.p-4:
    Card (class="w-[400px]" title="Login" description="Enter your details below"):
      view.flex.flex-col.gap-4:
        Input (placeholder="johndoe" bind value <-> name)
        view.flex.gap-2:
          Button (variant="outline" on click -> dec): "-"
          Button (on click -> inc): "+"
        Button (class="w-full" on click -> submit): "Submit"

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
  submit:
    set message = "Hello " + name + "!"
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+
- **npm** v9+

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/loayabdalslam/hjx.git
cd hjx

# 2. Install dependencies
npm install

# 3. Build the compiler
npm run build

# 4. Build an example
node dist/cli.js build examples/counter.hjx --out dist-app

# 5. Start the dev server (with hot reload)
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173
```

Open **http://localhost:5173** and you're live.

### With Server-Driven Mode (WebSocket)

```bash
node dist/cli.js dev examples/dashboard.hjx --out dist-app --port 5173
```

This enables **real-time server-side state management** via WebSocket — state lives on the server, UI updates are pushed to the client automatically.

---

## 📖 Documentation

### File Structure

Every `.hjx` file follows this block structure:

```
component <Name>       ← Component declaration
imports:               ← Optional: import other .hjx components
state:                 ← Reactive variables
script:                ← Optional: server-side initialization
layout:                ← UI tree (indentation-based)
style:                 ← Scoped CSS
handlers:              ← Event logic
```

### `component`

Declares the component name. One component per file.

```hjx
component MyApp
```

### `state:`

Defines reactive, component-local variables. Supports numbers, strings, booleans, arrays, and objects.

```hjx
state:
  count = 0
  title = "Hello"
  enabled = true
  items = ["todo1", "todo2"]
  user = { name: "John", age: 30 }
```

### `layout:`

Defines the UI tree using **indentation**. Think of it as a cleaner, whitespace-sensitive HTML.

| Syntax | Description |
|---|---|
| `view` | Generic container (`<div>`) |
| `text` | Inline text (`<span>`) |
| `button` | Button element |
| `input` | Input element |
| `view#id.class1.class2:` | ID + classes |
| `text: "Hello {{name}}"` | Text interpolation |
| `button (on click -> handler): "Label"` | Event binding |
| `input (bind value <-> stateVar)` | Two-way binding |

### Control Flow

```hjx
layout:
  if (isLoggedIn):
    text: "Welcome back!"

  if (!isLoggedIn):
    text: "Please log in."

  if (status === "active"):
    text: "Account is active"

  for (item in items):
    view.row:
      text: "{{item}}"
```

**Supported operators:** `!` (negation), `===` (equality), `!=` (inequality)

### `style:`

Raw CSS, automatically **scoped** to the component via `[data-hjx-scope]` attribute selectors.

```hjx
style:
  .card { padding: 16px; border-radius: 12px; }
  .primary { background: #007bff; color: white; }
```

Supports Tailwind-style class names with `:` and `/` characters.

### `handlers:`

Defines event handler logic using a simple statement language.

```hjx
handlers:
  increment:
    set count = count + 1
  reset:
    set count = 0
    log "Counter reset"
```

**Statements:** `set <var> = <expr>`, `log "<message>"`  
**Expressions:** numbers, identifiers, `+ - * /`, parentheses, state variables

### `imports:`

Import and compose other `.hjx` components:

```hjx
imports:
  Button from "./components/Button.hjx"
  Card from "./components/Card.hjx"
```

Use them in layout with **props** and **slots**:

```hjx
layout:
  Card (title="My Card"):
    text: "This is slot content"
    Button (variant="primary" on click -> save): "Save"
```

### `script:` (Server-Side)

Run initialization logic server-side. The `init(store)` function is called with a reactive store:

```hjx
script:
  export function init(store) {
    setInterval(() => {
      store.set({ timestamp: Date.now() });
    }, 1000);
  }
```

---

## 🛠️ CLI Reference

| Command | Description |
|---|---|
| `hjx parse <file.hjx>` | Print the AST (JSON) for a file |
| `hjx build <file.hjx> --out <dir>` | Compile to `index.html` + `app.css` + `app.js` |
| `hjx dev <file.hjx> --out <dir> --port <n>` | Build, serve, and watch with hot reload |

### Compilation Output

**Vanilla target** emits:
- `index.html` — Minimal page with scoped styles
- `app.css` — Scoped component styles
- `app.js` — Runtime + compiled component logic

**Server-driven target** adds:
- WebSocket synchronization
- Server-managed state evaluation
- Real-time push updates

---

## 🔌 Vite Integration

HJX ships with a first-party **Vite plugin** for seamless integration into modern build pipelines:

```bash
# In your Vite project:
npm install vite-plugin-hjx --save-dev
```

```js
// vite.config.js
import { defineConfig } from 'vite';
import hjxPlugin from 'vite-plugin-hjx';

export default defineConfig({
  plugins: [hjxPlugin()]
});
```

Then import `.hjx` files directly:

```js
import App from './App.hjx';
App.mount(document.getElementById('app'));
```

Features: **HMR support**, **CSS injection**, **automatic scoping**.

---

## 📊 Benchmark Overview

> Benchmarked on **Windows x64** • Node.js • JSDOM environment  
> Date: **2026-02-17**

### Parser Performance

| Workload | Time |
|---|---|
| Parse 100 state variables | **2.15 ms** |
| Parse 1,000 state variables | **1.90 ms** |
| Parse 5,000 state variables | **11.25 ms** |
| Parse 100 static nodes | **0.95 ms** |
| Parse 1,000 static nodes | **2.55 ms** |
| Parse 5,000 static nodes | **17.12 ms** |

### Compiler Performance

| Workload | Time |
|---|---|
| Compile 100 nodes → Vanilla JS | **1.73 ms** |
| Compile 1,000 nodes → Vanilla JS | **2.87 ms** |
| Compile 5,000 nodes → Vanilla JS | **13.19 ms** |
| Scope 100 CSS rules | **0.33 ms** |
| Scope 1,000 CSS rules | **1.86 ms** |

### Runtime Performance (JSDOM)

| Workload | Render | Update |
|---|---|---|
| Static 100 items | 33 ms | — |
| Static 1,000 items | 135 ms | — |
| List 100 items | 59 ms | 27 ms |
| List 1,000 items | 286 ms | 217 ms |
| Conditional 100 items | 142 ms | **2 ms** |
| Conditional 1,000 items | 8,057 ms | **14 ms** |
| Text interpolation 100 items | 46 ms | **2 ms** |
| Input binding 100 items | 63 ms | **1 ms** |

> **Key insight:** Updates are extremely fast (sub-3ms for 100 items) thanks to targeted DOM patching. Initial render scales linearly.

### Server Runtime

| Workload | Time |
|---|---|
| Init session (100 handlers) | **8.59 ms** |
| Init session (1,000 handlers) | **9.82 ms** |
| Execute 1,000 handler calls | **3,548 ms** (3.5 ms/call) |

---

## 📁 Project Structure

```
hjx/
├── src/                    # Compiler source (TypeScript)
│   ├── parser.ts           # HJX → AST
│   ├── compiler/           # AST → HTML/CSS/JS
│   │   └── vanilla.ts      # Vanilla JS target
│   ├── runtime.ts          # Client-side reactivity
│   ├── server_session.ts   # Server-driven state manager
│   ├── devserver.ts        # Dev server with HMR
│   └── cli.ts              # CLI entry point
├── examples/               # Example .hjx files
│   ├── counter.hjx
│   ├── form.hjx
│   ├── list.hjx
│   ├── conditional.hjx
│   ├── dashboard.hjx
│   ├── composition_demo.hjx
│   └── components/         # Reusable components
│       ├── Button.hjx
│       ├── Card.hjx
│       └── Input.hjx
├── packages/
│   └── vite-plugin-hjx/    # First-party Vite plugin
├── extensions/
│   └── vscode/             # VS Code extension
├── dist/                   # Compiled output
└── package.json
```

---

## 🤝 Contributing

PRs are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---
## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=loaiabdalslam/hjx&type=date&legend=top-left)](https://www.star-history.com/#loaiabdalslam/hjx&type=date&legend=top-left)
## 📄 License

MIT © [Loay Abdalslam](https://github.com/loayabdalslam)
