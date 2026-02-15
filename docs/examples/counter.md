# Counter Example

A simple counter component demonstrating state management, event handling, and styling.

## Code

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
  .card { padding: 16px; border: 1px solid #ddd; border-radius: 12px; display: inline-flex; flex-direction: column; gap: 12px; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; }
  .title { font-size: 18px; font-weight: 600; }
  .primary { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 0; }
  .ghost { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 1px solid #ddd; background: transparent; }

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
```

## Features Demonstrated

- **State**: Reactive `count` variable
- **Layout**: Nested view structure with text and buttons
- **Events**: Click handlers for increment/decrement
- **Styling**: Scoped CSS with classes
- **Interpolation**: `{{count}}` for dynamic text

## Try It

```bash
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173
```