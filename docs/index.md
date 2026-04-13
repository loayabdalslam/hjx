---
layout: home

hero:
  name: HJX
  text: The Unified UI Language
  tagline: One file. HTML + CSS + JS. Zero config. Write in English or code.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Flow-State Engine
      link: /guide/flow-state
    - theme: alt
      text: View Examples
      link: /examples/

features:
  - title: Single File Components
    details: Write HTML, CSS, and JavaScript in one .hjx file. No more jumping between multiple files.
  - title: Flow-State Engine
    details: "Write UI in plain English. create a counter becomes full working HJX code. Mix code and language seamlessly."
  - title: Natural Language CSS
    details: Write styles like `card`, `button primary`, `font size 32px`. The compiler translates intent to CSS.
  - title: Zero Dependencies
    details: Compiles to clean, dependency-free HTML, CSS, and JavaScript. Runs anywhere.
  - title: React Compilation
    details: "One command: `hjx build --target react` produces .tsx components with hooks and CSS modules."
  - title: REST API Integration
    details: Define API endpoints in HJX. Auto-generate Express.js routes and handlers.
  - title: Reactive State
    details: Built-in state management with automatic UI updates when state changes.
  - title: Dynamic Grammar
    details: Edit grammar.yml to customize the language. Full control over patterns and templates.
  - title: Hot Reload
    details: Fast development cycle with instant updates as you type.

---

## Quick Example

```hjx
component Counter

state:
  count = 0

layout:
  view.card:
    text: "Count: {{count}}"
    button (on click -> inc): "Increase"

style:
  .card { padding: 20px; }
  button { cursor: pointer; }

handlers:
  inc:
    set count = count + 1
```

Compiles to clean, readable HTML, CSS, and JavaScript with zero dependencies.
