---
sidebar_label: Syntax
---

# HJX Syntax

Every `.hjx` file contains blocks in this order:

```
component <Name>
imports:
state:
api:
layout:
style:
breakpoints:
handlers:
script:
```

## Example

```hjx
component Counter

state:
  count = 0

layout:
  view#root.card:
    text.title: "Count: {{count}}"
    button.primary (on click -> inc): "Increase"

style:
  .card:
    card
    text align center

  .primary:
    button primary

handlers:
  inc:
    set count = count + 1
```

See [Quick Start](./quick-start) for a full walkthrough.
