---
layout: home

hero:
  name: HJX
  text: Unified UI Language
  tagline: Build web UIs from a single .hjx file
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/loayabdalslam/hjx

features:
  - title: Single File Components
    details: Write HTML, CSS, and JavaScript logic in one cohesive .hjx file
  - title: Reactive State
    details: Built-in reactive state management with simple bindings
  - title: Vanilla Output
    details: Compiles to standard HTML, CSS, and JavaScript - no framework lock-in
  - title: Developer Friendly
    details: Clean, indentation-based syntax that's easy to read and write
---

## Quick Example

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

This compiles to a fully functional counter component!