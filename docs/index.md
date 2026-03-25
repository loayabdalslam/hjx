---
layout: home

hero:
  name: HJX
  text: A Compiled UI Language
  tagline: Unify structure, style, and logic into a single .hjx file
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View Examples
      link: /examples/counter

features:
  - title: Single File Components
    details: Write HTML, CSS, and JavaScript in one .hjx file. No more jumping between multiple files.
  - title: Zero Dependencies
    details: Compiles to clean, dependency-free HTML, CSS, and JavaScript. Runs anywhere.
  - title: Reactive State
    details: Built-in state management with automatic UI updates when state changes.
  - title: Server-Driven Mode
    details: Optional server-driven state management via WebSocket for complex applications.
  - title: Hot Reload
    details: Fast development cycle with instant updates as you type.
  - title: TypeScript Support
    details: Full TypeScript support with type-safe runtime APIs.

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
