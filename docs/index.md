---
layout: home

hero:
  name: HJX
  text: The Unified UI Language
  tagline: One file. HTML + CSS + JS. Zero config.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View Examples
      link: /examples/counter

features:
  - title: Simple Yet Powerful
    details: Write your entire UI component in a single .hjx file. No imports, no boilerplate, no configuration.
    icon: ⚡

  - title: Zero Dependencies
    details: Compiles to clean, dependency-free HTML, CSS, and JavaScript. No runtime overhead, no framework lock-in.
    icon: 📦

  - title: Reactive by Default
    details: Built-in state management with fine-grained reactivity. Updates only what changes - blazing fast.
    icon: 🔄

  - title: Server-Driven Mode
    details: Push state updates from your server via WebSocket. Perfect for real-time dashboards.
    icon: 🖥️

  - title: Hot Reload
    details: Development server with instant hot module replacement. See changes as you type.
    icon: 🔥

  - title: TypeScript Support
    details: Full TypeScript support with type-safe APIs and comprehensive documentation.
    icon: 🔷
---

## Quick Example

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

**That's it.** One file → a fully working interactive counter.

## Why HJX?

| Feature | HJX | React | Vue | Svelte |
|---------|-----|-------|-----|--------|
| Files per component | 1 | 3+ | 3+ | 1 |
| Dependencies | 0 | 1+ | 1+ | 0 |
| Runtime overhead | 0 | ~40kb | ~90kb | 0 |
| Learning curve | Low | High | Medium | Low |
| Server-driven | Yes | No | No | No |

## Installation

```bash
git clone https://github.com/loayabdalslam/hjx.git
cd hjx
npm install
npm run build
```

## Quick Start

```bash
# Build an example
node dist/cli.js build examples/counter.hjx --out dist-app

# Start dev server with hot reload
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173
```

Open http://localhost:5173 and you're live!

## What's Inside

<div class="grid-cards">

### Guide
Learn HJX from scratch with our comprehensive guides.

- [Getting Started](/guide/getting-started)
- [Your First Component](/guide/first-component)
- [State Management](/guide/state)
- [Event Handling](/guide/events)

### Language
Deep dive into the HJX syntax and features.

- [Syntax Overview](/language/syntax)
- [State Block](/language/state)
- [Layout Block](/language/layout)
- [Style Block](/language/style)
- [Handlers Block](/language/handlers)

### CLI
Command-line interface reference.

- [Commands](/cli/commands)
- [Build](/cli/build)
- [Dev Server](/cli/dev)
- [Parse](/cli/parse)

### Examples
Learn by example with working code.

- [Counter](/examples/counter)
- [Form Binding](/examples/form)
- [Todo List](/examples/todo)
- [Dashboard](/examples/dashboard)
- [Composition](/examples/composition)

</div>

<style>
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.grid-cards h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: var(--vp-c-brand-1);
}

.grid-cards ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.grid-cards li {
  margin: 0.5rem 0;
}

.grid-cards a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.grid-cards a:hover {
  color: var(--vp-c-brand-1);
}
</style>
