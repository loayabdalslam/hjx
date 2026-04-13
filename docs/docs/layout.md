---
sidebar_label: Layout
---

# Layout

Define the UI tree using indentation.

## Nodes

| Syntax | Description |
|---|---|
| `view` | Container (`div`) |
| `text` | Text (`span`) |
| `button` | Button |
| `input` | Input field |

## Examples

```hjx
layout:
  view#root.card:
    text.title: "Hello {{name}}"
    button.primary (on click -> submit): "Submit"
    input.field (bind value <-> email):
```

See [Syntax](./syntax) for the full reference.
