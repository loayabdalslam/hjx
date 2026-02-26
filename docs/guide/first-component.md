# Your First Component

In this guide, we'll walk through creating a complete HJX component from scratch.

## The Component Structure

Every HJX file follows this structure:

```hjx
component <Name>

imports:           # Optional: import other components
  Button from "./Button.hjx"

state:             # Reactive variables
  count = 0

script:            # Optional: server-side initialization
  export function init(store) {}

layout:            # UI structure (required)
  view: "Hello"

style:             # Scoped CSS
  .class { }

handlers:          # Event handlers
  handlerName:
    # logic
```

Only the `component` and `layout` blocks are required. Everything else is optional.

## Creating a Counter

Let's build a counter component step by step:

### Step 1: Declare the Component

```hjx
component Counter
```

This declares a component named `Counter`.

### Step 2: Add State

```hjx
state:
  count = 0
```

State variables are reactive. When they change, the UI updates automatically.

### Step 3: Define the Layout

```hjx
layout:
  view#root.card:
    text: "Count: {{count}}"
    button (on click -> inc): "+"
```

The layout uses indentation to define hierarchy. Key syntax:
- `view` - generic container (renders as `<div>`)
- `text` - inline text (renders as `<span>`)
- `button` - button element
- `#root` - adds `id="root"`
- `.card` - adds `class="card"`
- `{{count}}` - interpolates the state variable
- `(on click -> inc)` - binds click event to handler

### Step 4: Add Styling

```hjx
style:
  .card { padding: 16px; border: 1px solid #ddd; border-radius: 8px; }
```

CSS is automatically scoped to the component using data attributes.

### Step 5: Add Event Handlers

```hjx
handlers:
  inc:
    set count = count + 1
```

Handlers are defined using a simple statement language:
- `set <variable> = <expression>` - update state
- `log "<message>"` - log to console

## The Complete Component

Putting it all together:

```hjx
component Counter

state:
  count = 0

layout:
  view#root.card:
    text.title: "Count: {{count}}"
    view.buttons:
      button.primary (on click -> inc): "+"
      button.secondary (on click -> dec): "-"

style:
  .card { padding: 20px; border: 1px solid #ddd; border-radius: 12px; text-align: center; }
  .title { font-size: 24px; font-weight: bold; margin-bottom: 16px; }
  .buttons { display: flex; gap: 8px; justify-content: center; }
  .primary, .secondary { padding: 8px 16px; border-radius: 6px; cursor: pointer; border: none; }
  .primary { background: #007bff; color: white; }
  .secondary { background: #6c757d; color: white; }

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
```

## Try It Out

```bash
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173
```

Open http://localhost:5173 and click the buttons!

## Summary

- **component** - declares the component name
- **state** - reactive variables
- **layout** - UI structure with indentation
- **style** - scoped CSS
- **handlers** - event logic

## Next Steps

- [State Management](/guide/state) - Learn more about reactive state
- [Event Handling](/guide/events) - Handle more events
- [Styling](/guide/styling) - Advanced CSS techniques
