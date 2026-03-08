# Components

HJX supports composing UIs from multiple reusable components using the `imports:` block.

## Importing Components

Import other `.hjx` files at the top of your component:

```yaml
component MyApp

imports:
  Button from "./components/Button.hjx"
  Card from "./components/Card.hjx"
  Input from "./components/Input.hjx"
```

Each import maps a **local name** to a `.hjx` file path (relative to the current file).

## Using Components

Use imported components in your `layout:` block just like built-in elements:

```yaml
layout:
  Card (title="Welcome"):
    text: "Hello from HJX!"
    Button (variant="primary" on click -> save): "Save"
```

## Props

Pass data to child components using attributes:

```yaml
layout:
  Card (title="Dashboard" description="System overview"):
    text: "Content here"
  Button (variant="outline" size="icon" on click -> action): "Click"
```

Props are passed as string attributes. The child component receives them and can use them in its layout via interpolation.

## Slots

Child content placed inside a component tag becomes **slot content**. The child component renders it using a `slot` element:

### Parent
```yaml
layout:
  Card (title="My Card"):
    text: "This text goes into the slot"
    Button (on click -> save): "Save"
```

### Child (Card.hjx)
```yaml
component Card

layout:
  view.card:
    text.title: "{{title}}"
    slot:
```

Everything inside `Card (...):`  in the parent is rendered where `slot:` appears in the child.

## Events on Components

You can bind events to imported components the same way as built-in elements:

```yaml
layout:
  Button (on click -> increment): "+"
  Button (on click -> decrement): "-"
```

## Full Example

### `App.hjx`
```yaml
component App

imports:
  Button from "./components/Button.hjx"
  Card from "./components/Card.hjx"

state:
  count = 0
  name = ""

layout:
  view.container:
    Card (title="Counter Demo"):
      view.row:
        Button (variant="outline" on click -> dec): "-"
        text.count: "{{count}}"
        Button (on click -> inc): "+"
      Button (class="w-full" on click -> reset): "Reset"

style:
  .container { padding: 20px; display: flex; justify-content: center; }
  .row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .count { font-size: 24px; font-weight: bold; }

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
  reset:
    set count = 0
```

### Running

```bash
node dist/cli.js dev App.hjx --out dist-app --port 5173
```

The compiler automatically resolves imports, loads the full component tree, and compiles everything together.

---

**Next:** [Server-Driven Mode →](/guide/server-driven)
