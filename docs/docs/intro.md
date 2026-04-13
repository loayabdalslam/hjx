---
sidebar_label: Introduction
slug: /intro
---

# HJX — The Unified UI Language

**One file. HTML + CSS + JS. Zero config. Write in English or code — your choice.**

HJX is a compiled UI language that unifies **structure**, **style**, and **logic** into a single `.hjx` file. It compiles to clean, dependency-free **HTML + CSS + JavaScript** or **React components** — no virtual DOM, no runtime overhead, no framework lock-in.

## Why HJX?

| Feature | HJX | React | Vue | Svelte |
|---------|-----|-------|-----|--------|
| Single file | ✅ | ❌ (needs setup) | ❌ | ✅ |
| No dependencies | ✅ | ❌ (React runtime) | ❌ (Vue runtime) | ❌ (Svelte runtime) |
| Write in English | ✅ Flow-State | ❌ | ❌ | ❌ |
| Natural Language CSS | ✅ | ❌ | ❌ | ❌ |
| Auto API routes | ✅ | ❌ | ❌ | ❌ |
| Compile to React | ✅ | N/A | ❌ | ❌ |

## Quick Example

```hjx title="counter.hjx"
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
    card
    text align center
    display flex
    flex direction column
    gap 24px

  .title:
    font size 32px
    font weight bold

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

## Flow-State Engine (NEW in v0.2)

Write UI in plain English:

```bash
$ hjx flow "create a counter component"
```

Generates:

```hjx
component Counter
state:
  count = 0
layout:
  view#root.card:
    text.title: "Count: {{count}}"
    ...
handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
```

## Key Features

### 🗣️ Flow-State Engine
Describe UI in natural English. Mix code and language seamlessly.

### 🎨 Natural Language CSS
Write `card`, `button primary`, `font size 32px` — the compiler translates to CSS.

### ⚛️ React Compilation
One command: `hjx build --target react` → `.tsx` components with hooks.

### 🔌 REST API Integration
Define API endpoints in HJX. Auto-generate Express.js routes.

### 📝 Dynamic Grammar
Edit `grammar.yml` to customize the language. Full control over patterns.

### 🚀 Zero Dependencies
Compiles to clean HTML/CSS/JS. No runtime. No bundle. No lock-in.

## Next Steps

- [Installation](./installation) — Get set up in 2 minutes
- [Quick Start](./quick-start) — Build your first HJX app
- [Flow-State Engine](./flow-state) — Write UI in English
