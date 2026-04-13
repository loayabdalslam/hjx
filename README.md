<h1 align="center">HJX</h1>

<p align="center">
  <strong>The Unified UI Language with Flow-State Engine</strong><br/>
  One file. HTML + CSS + JS. Zero config. Write in English or code — your choice.
</p>

<p align="center">
  <a href="https://github.com/loayabdalslam/hjx"><img src="https://img.shields.io/badge/version-0.2.0-blue" alt="Version" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License" /></a>
  <a href="https://github.com/loayabdalslam/hjx"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome" /></a>
  <a href="https://loayabdalslam.github.io/hjx/"><img src="https://img.shields.io/badge/docs-live-brightgreen" alt="Docs" /></a>
</p>

---

## What is HJX?

HJX is a compiled UI language that unifies **structure**, **style**, and **logic** into a single `.hjx` file. It compiles to clean, dependency-free **HTML + CSS + JavaScript** or **React components** — no virtual DOM, no runtime overhead, no framework lock-in.

### ✨ NEW in v0.2: Flow-State Engine

**Write UI in plain English.** The Flow-State Engine translates natural language descriptions directly into HJX code. You can also mix English with code for a seamless development experience.

```bash
$ hjx flow "create a counter component"
✅ Generates complete HJX with state, layout, styles, and handlers

$ hjx flow "make a todo app"
✅ Full todo app with add/remove functionality

$ hjx flow --grammar custom.yml "build a dashboard"
✅ Use your own grammar rules for custom generation
```

**Write styles in natural language:**

```hjx
style:
  .card:
    card
    text align center
    display flex
    flex direction column
    gap 24px

  .button:
    button primary

  .button:hover:
    box shadow medium
    transition all 0.2s ease
```

**Compile to React with one command:**

```bash
$ hjx build todo-app.hjx --target react --backend
✅ Generates TodoApp.tsx + CSS modules + Express.js API routes
```

---

## Quick Start

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

# 4. Flow-State: Generate HJX from natural language
node dist/cli.js flow "create a counter component"

# 5. Build an example
node dist/cli.js build examples/counter.hjx --out dist-app

# 6. Start the dev server (with hot reload)
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173
```

Open **http://localhost:5173** and you're live.

---

## Flow-State Engine

### Natural Language to Code

Describe what you want in English, get working HJX:

```bash
# Create components
hjx flow "create a counter component"
hjx flow "make a form with name and email fields"
hjx flow "build a todo list with add and delete"

# Add features
hjx flow "add state called count"
hjx flow "add button called Submit"
hjx flow "make the card centered with a shadow"

# Compile directly to HTML/CSS/JS
hjx flow --compile "create a counter with reset"
```

### Mixed Code + Language

Seamlessly blend natural English with HJX code:

```
create a dashboard component
state:
  users = 0
  revenue = 0

make the container centered with a card style
add a title that says "Analytics Dashboard"
add buttons for "View Reports" and "Export Data"
```

### Custom Grammar

Take full control of the language with `grammar.yml`:

```yaml
custom_rules:
  rules:
    - name: "my-component"
      patterns:
        - "make a {{1}} component"
        - "build {{1}} widget"
      template: |
        component {{1|capitalize}}

        state:
          value = 0

        layout:
          view.card:
            text: "{{1}}"

        style:
          .card:
            card

        handlers:
```

```bash
hjx flow --grammar my-grammar.yml "make a weather widget"
```

### Built-in Patterns

| Command | Output |
|---------|--------|
| `create a counter` | Counter with increment/decrement |
| `make a form` | Form with inputs, bindings, submit |
| `create a todo list` | Todo app with add/remove |
| `add state called X` | `state: X = 0` |
| `add button called X` | `button.primary: "X"` |
| `make X centered` | Flexbox centering styles |
| `fetch from /api/X` | API endpoint definition |

---

## Natural Language CSS

Write styles using human-readable descriptions. The compiler translates your intent to proper CSS automatically.

### Shortcuts & Presets

```hjx
style:
  .container:
    container          # max-width: 1200px, margin: auto, padding

  .card:
    card               # padding, background, border-radius, shadow

  .primary-btn:
    button primary     # padding, background, color, border, cursor

  .input-field:
    input field        # padding, border, font-size, width
```

### Property Descriptions

| Natural Language | Generated CSS |
|---|---|
| `padding 16px` | `padding: 16px;` |
| `font size 24px` | `font-size: 24px;` |
| `display flex` | `display: flex;` |
| `justify content center` | `justify-content: center;` |
| `box shadow light` | `box-shadow: 0 2px 8px rgba(0,0,0,0.1);` |
| `border radius 12px` | `border-radius: 12px;` |
| `transition all 0.3s ease` | `transition: all 0.3s ease;` |

### Pseudo-Selectors & Media Queries

```hjx
breakpoints:
  mobile = 480px
  tablet = 768px

style:
  .button:
    button primary

  .button:hover:
    background #0056b3
    box shadow medium

  .container @mobile:
    padding 12px
    flex direction column
```

---

## React Compilation

Compile HJX directly to React components:

```bash
hjx build counter.hjx --target react
```

### Generated Output

**Counter.tsx:**
```tsx
import React, { useState } from 'react';
import styles from './Counter.module.css';

export function Counter() {
  const [count, setCount] = useState(0);

  function inc() { setCount(count + 1); }
  function dec() { setCount(count - 1); }

  return (
    <view className={styles.card} id="root">
      <text className={styles.title}>Count: {count}</text>
      <button className={styles.primary} onClick={() => inc()}>Increase</button>
      <button className={styles.secondary} onClick={() => dec()}>Decrease</button>
    </view>
  );
}
```

**Counter.module.css:**
```css
[data-hjx-scope="hjx-counter"] .card {
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  /* ... */
}
```

### React + Backend

```bash
hjx build todo-app.hjx --target react --backend
```

Generates:
- `TodoApp.tsx` — React component with API calls
- `TodoApp.module.css` — Scoped CSS modules
- `api/routes.ts` — Express.js routes
- `api/handlers.ts` — API handler functions with TypeScript

---

## REST API Integration

Define API endpoints directly in HJX:

```hjx
api:
  GET /api/todos -> fetchTodos:
    query:
      page = 1
      limit = 10

  POST /api/todos -> createTodo:
    body:
      text = string
      done = boolean

  DELETE /api/todos/:id -> deleteTodo:
    params:
      id = number
```

Use in handlers:

```hjx
handlers:
  loadData:
    fetch fetchTodos -> todos
    set items = todos

  addItem:
    fetch createTodo with { text: newItem } -> result
    set items = [...items, result]
    set newItem = ""
```

---

## Language Syntax

### File Structure

Every `.hjx` file follows this block structure:

```
component <Name>       ← Component declaration
imports:               ← Optional: import other .hjx components
state:                 ← Reactive variables
api:                   ← Optional: REST API endpoints
layout:                ← UI tree (indentation-based)
style:                 ← Natural language CSS or raw CSS
breakpoints:           ← Optional: custom media breakpoints
handlers:              ← Event logic
script:                ← Optional: server-side code
```

### Counter Example

```hjx
component Counter

state:
  count = 0

layout:
  view#root.card:
    text.title: "Count: {{count}}"
    button.primary (on click -> inc): "Increase"
    button.secondary (on click -> dec): "Decrease"

style:
  .card:
    padding 16px
    border 1px solid #ddd
    border radius 12px
    text align center

  .primary:
    button primary

  .secondary:
    button secondary

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
```

**That's it.** One file → a fully working interactive counter. No imports, no boilerplate, no configuration.

### State Types

```hjx
state:
  count = 0                # Number
  name = "John"            # String
  active = true            # Boolean
  items = ["a", "b"]       # Array
  user = { name: "John" }  # Object
```

### Layout Nodes

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

  for (item in items):
    view.row:
      text: "{{item}}"
```

### Handlers

```hjx
handlers:
  increment:
    set count = count + 1
  reset:
    set count = 0
    log "Counter reset"
```

---

## CLI Reference

| Command | Description |
|---|---|
| `hjx parse <file.hjx>` | Print the AST (JSON) for a file |
| `hjx build <file.hjx> --out <dir>` | Compile to vanilla HTML/CSS/JS |
| `hjx build <file.hjx> --out <dir> --target react` | Compile to React component |
| `hjx build <file.hjx> --out <dir> --target react --backend` | Compile to React + Express backend |
| `hjx dev <file.hjx> --out <dir> --port <n>` | Build, serve, and watch with hot reload |
| `hjx flow "description"` | Generate HJX from natural language |
| `hjx flow --file input.txt` | Read input from file |
| `hjx flow --grammar custom.yml "desc"` | Use custom grammar rules |
| `hjx flow --compile "desc"` | Compile directly to HTML/CSS/JS |

---

## Performance Benchmarks

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

### Flow-State Engine

| Input | Intent Match | Generation Time |
|---|---|---|
| "create a counter" | counter (98%) | < 5ms |
| "make a form" | form (95%) | < 5ms |
| "create a todo list" | todo-list (95%) | < 5ms |
| Mixed code + English | mixed (80%) | < 10ms |

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

> **Key insight:** Updates are extremely fast (sub-3ms for 100 items) thanks to targeted DOM patching.

---

## Project Structure

```
hjx/
├── src/
│   ├── cli.ts                    # CLI entry point
│   ├── parser.ts                 # HJX → AST
│   ├── compiler/
│   │   ├── vanilla.ts            # Vanilla JS target
│   │   ├── react.ts              # React target (NEW)
│   │   ├── nl_css.ts             # Natural language CSS (NEW)
│   │   └── server_driven.ts      # Server-driven target
│   ├── nlp/
│   │   ├── flow/                 # Flow-State Engine (NEW)
│   │   │   ├── flow_engine.ts
│   │   │   ├── grammar_loader.ts
│   │   │   └── cli.ts
│   │   ├── tokenizer/            # HJX tokenizer
│   │   ├── parser/               # Enhanced parser
│   │   ├── intent/               # Intent classifier
│   │   ├── entities/             # Entity extraction
│   │   ├── features/             # Feature extraction
│   │   ├── completion/           # Code completion
│   │   ├── generation/           # Code generation
│   │   └── errors/               # Error detection
│   └── lovable/                  # AI integration
├── examples/
│   ├── counter.hjx
│   ├── counter_v2.hjx            # Natural language CSS
│   ├── todo-app.hjx              # With API integration
│   ├── dashboard_v2.hjx          # Grid layouts
│   └── components/
├── grammar.yml                   # User-editable grammar (NEW)
├── docs/                         # VitePress documentation
├── extensions/vscode/            # VS Code extension
├── packages/vite-plugin-hjx/     # Vite plugin
└── package.json
```

---

## Ecosystem

### Vite Plugin

```bash
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

### VS Code Extension

Syntax highlighting, snippets, and (coming soon) Flow-State integration.

```bash
# Install from extensions/vscode/
code --install-extensions extensions/vscode/hjx-vscode-0.1.0.vsix
```

---

## Contributing

PRs are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

### Adding Custom Grammar

1. Edit `grammar.yml` in the project root
2. Add your patterns under `custom_rules:`
3. Test with: `hjx flow --grammar grammar.yml "your description"`

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=loaiabdalslam/hjx&type=date&legend=top-left)](https://www.star-history.com/#loaiabdalslam/hjx&type=date&legend=top-left)

## 📄 License

MIT © [Loay Abdalslam](https://github.com/loayabdalslam)
