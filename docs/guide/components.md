# Components

HJX supports component composition - building complex UIs from smaller, reusable components.

## Creating Components

A component is simply a `.hjx` file. Create `Button.hjx`:

```hjx
component Button

state:
  label = "Click me"
  variant = "primary"

layout:
  button.btn (on click -> handleClick):
    text: "{{label}}"

style:
  .btn { padding: 10px 20px; border-radius: 6px; cursor: pointer; }
  .primary { background: #007bff; color: white; border: none; }
  .secondary { background: #6c757d; color: white; border: none; }

handlers:
  handleClick:
    log "Button clicked"
```

## Using Components

Import and use components in other files:

```hjx
component App

imports:
  Button from "./components/Button.hjx"

layout:
  view.app:
    Button variant="primary"
    Button variant="secondary"
```

## Component Props

Pass data to components using attributes:

```hjx
component Card

state:
  title = "Default Title"
  content = ""

layout:
  div.card:
    div.header:
      text: "{{title}}"
    div.body:
      text: "{{content}}"

style:
  .card { border: 1px solid #ddd; border-radius: 8px; }
  .header { font-weight: bold; padding: 12px; border-bottom: 1px solid #eee; }
  .body { padding: 12px; }
```

Usage:

```hjx
component App

imports:
  Card from "./Card.hjx"

layout:
  view.app:
    Card title="Hello" content="This is a card"
    Card title="Another" content="More content"
```

## Nested Components

Components can contain other components:

```hjx
component Dashboard

imports:
  Card from "./Card.hjx"
  Button from "./Button.hjx"

layout:
  view.dashboard:
    Card title="Stats" content="Some stats here"
    Button label="Refresh"
```

## Composition Patterns

### List of Components

```hjx
component ItemList

state:
  items = ["Item 1", "Item 2", "Item 3"]

imports:
  Card from "./Card.hjx"

layout:
  view.list:
    for (item in items):
      Card title="{{item}}"
```

### Conditional Components

```hjx
component App

state:
  isLoggedIn = false

imports:
  LoginForm from "./LoginForm.hjx"
  Dashboard from "./Dashboard.hjx"

layout:
  view.app:
    if (isLoggedIn):
      Dashboard
    
    if (!isLoggedIn):
      LoginForm
```

## Best Practices

1. **Keep components focused** - Each component should do one thing well
2. **Use descriptive names** - `SubmitButton` is better than `Button1`
3. **Extract common styles** - Share CSS using the style block
4. **Compose from the top down** - Start with a layout, then extract components
