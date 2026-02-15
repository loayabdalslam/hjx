# HJX v0.1 (MVP Skeleton)

HJX is a unified UI language that compiles into **HTML + CSS + JavaScript** from a single `.hjx` file.

This repo is an **initial working version**:
- A small **HJX grammar** (block-based)
- A **parser** that produces an AST JSON
- A **compiler** that generates vanilla `dist/` output (HTML/CSS/JS)
- A simple **runtime** for state + events + bindings
- CLI: `hjx parse`, `hjx build`, `hjx dev`

> This is intentionally minimal and scoped to a safe subset. You can extend the grammar & codegen progressively.

## Quick start

```bash
npm install
npm run build
node dist/cli.js build examples/counter.hjx --out dist-app
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173
```

Then open: http://localhost:5173

## CLI

- `hjx parse <file.hjx>` prints AST JSON
- `hjx build <file.hjx> --out <dir>` generates `index.html`, `app.css`, `app.js`
- `hjx dev <file.hjx> --out <dir> --port <n>` builds + serves and watches the source file

## Language overview (subset)

HJX file is composed of blocks:

```hjx
component Counter
state:
  count = 0

layout:
  view#root.card:
    text: "Count: {{count}}"
    button.primary (on click -> inc): "Increase"

style:
  .card { padding: 16px; border: 1px solid #ddd; border-radius: 12px; }
  .primary { padding: 10px 14px; border-radius: 10px; cursor: pointer; }

handlers:
  inc:
    set count = count + 1
```

### Supported right now
- `component <Name>`
- `state:` with simple `name = number|string|bool`
- `layout:` with indentation-based tree
  - nodes: `view`, `text`, `button`, `input`
  - ids/classes: `view#id.class1.class2`
  - inline text: `text: "..."` or `button.class (on click -> handler): "..."` 
  - bindings: `{{stateName}}` inside text
  - input two-way: `input (bind value <-> name)`
- `style:` raw CSS (scoped via `[data-hjx-scope="..."]`)
- `handlers:` with:
  - `set x = expression`
  - expressions: numbers, + - * /, parentheses, state vars
  - `log "message"` (debug)

## Roadmap
- conditionals: `if ...`
- lists: `for item in items`
- more DOM nodes + attributes + aria
- effects: `effect when <expr> -> ...`
- targets: React/Vue/WebComponents
