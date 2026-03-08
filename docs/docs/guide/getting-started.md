# Getting Started

Welcome to HJX! This guide will help you get up and running with your first component.

## What is HJX?

HJX is a compiled UI language that unifies structure, style, and logic into a single `.hjx` file. It compiles to clean, dependency-free HTML + CSS + JavaScript.

## Installation

```bash
npm install
npm run build
```

## Your First Component

Create a file named `counter.hjx`:

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
  .title { font-size: 18px; font-weight: 600; }
  .primary { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 0; }
  .ghost { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 1px solid #ddd; background: transparent; }

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
```

## Running Your Component

### Development Mode

```bash
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5172
```

This starts a development server with hot reload. Open the port you specified in your browser.

### Building for Production

```bash
node dist/cli.js build examples/counter.hjx --out dist-app
```

This compiles your `.hjx` file to `index.html`, `app.css`, and `app.js` in the `dist-app` directory.

## Parsing for Debugging

To see the AST (Abstract Syntax Tree) generated from your HJX file:

```bash
node dist/cli.js parse examples/counter.hjx
```

This outputs the internal representation of your component, useful for debugging and understanding how HJX processes your code.

## Next Steps

- Learn about the [Syntax](/guide/syntax) in detail
- Explore [Components](/guide/components) and how to compose them
- Understand [State Management](/guide/state)
- Check out [Server-Driven Mode](/guide/server-driven) for advanced use cases
