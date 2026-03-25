# Counter Example

A simple counter demonstrating basic state management and event handlers.

## Source Code

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

## Key Concepts

- **State**: Defines a `count` variable initialized to 0
- **Text interpolation**: Uses `{{count}}` to display the value
- **Event handlers**: `on click` attaches click events
- **Handlers**: `inc` and `dec` update the state

## How It Works

1. The `state` block defines `count = 0`
2. The `layout` displays `{{count}}` in the text element
3. When the "Increase" button is clicked, the `inc` handler runs
4. The handler updates `count = count + 1`
5. The UI automatically re-renders with the new value

## Running

```bash
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5172
```

Open the specified port in your browser to see the counter.
