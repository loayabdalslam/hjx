# Ecosystem

HJX ships with first-party integrations for modern development tools.

## Vite Plugin

Integrate `.hjx` files into any Vite project with full HMR (Hot Module Replacement) support.

### Setup

```js
// vite.config.js
import { defineConfig } from 'vite';
import hjxPlugin from 'vite-plugin-hjx';

export default defineConfig({
  plugins: [hjxPlugin()]
});
```

### Usage

Import `.hjx` files directly in JavaScript:

```js
import App from './App.hjx';
App.mount(document.getElementById('app'));
```

### Features

- **HMR support** — changes to `.hjx` files update the browser instantly
- **CSS injection** — component styles are automatically injected into `<head>`
- **Automatic scoping** — CSS is scoped per component

### How It Works

The plugin hooks into Vite's `transform` pipeline. When a `.hjx` file is imported:

1. The HJX parser converts it to an AST
2. The vanilla compiler generates HTML/CSS/JS
3. CSS is injected into the document head
4. The component exports a `mount(el)` function
5. HMR accepts updates and re-mounts the component

## VS Code Extension

Syntax highlighting and snippets for `.hjx` files.

### Installation

The extension is packaged as a `.vsix` file in `extensions/vscode/`:

```bash
code --install-extension extensions/vscode/hjx-vscode-0.1.0.vsix
```

### Features

- **Syntax highlighting** — HJX blocks (`component`, `state`, `layout`, `style`, `handlers`) are color-coded
- **Snippets** — Quickly scaffold new components
- **Language configuration** — Bracket matching, comment toggling, auto-closing pairs

### Available Snippets

After installing, type the snippet prefix and press Tab:

| Prefix | Description |
|--------|-------------|
| `hjx` | Full component scaffold |
| `state` | State block |
| `layout` | Layout block |
| `handler` | Handler block |

## CLI

The HJX CLI is the primary tool for working with `.hjx` files:

```bash
# Parse a file (see AST)
node dist/cli.js parse examples/counter.hjx

# Build to HTML/CSS/JS
node dist/cli.js build examples/counter.hjx --out dist-app

# Development server with hot reload
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5172
```

## NLP Engine

The built-in NLP engine enables AI-powered development with intent classification, code generation, error detection, and semantic search. See the [NLP Engine](/guide/nlp-engine) guide for details.

## Project Templates

Production-ready example projects demonstrating full-stack HJX applications:

| Project | Description |
|---------|-------------|
| [E-Commerce Store](https://github.com/loayabdalslam/hjx/tree/main/examples/projects/ecommerce) | Product catalog, cart, checkout, admin dashboard |
| [AI Chat](https://github.com/loayabdalslam/hjx/tree/main/examples/projects/ai-chat) | Multi-conversation chat with streaming responses |
| [Task Manager](https://github.com/loayabdalslam/hjx/tree/main/examples/projects/task-manager) | Kanban board, team assignments, analytics |

## Contributing

HJX is open source. Contributions welcome at [github.com/loayabdalslam/hjx](https://github.com/loayabdalslam/hjx).

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request
