# Imports

The `imports:` block allows you to use other HJX components within your component.

## Syntax

```hjx
imports:
  ComponentName from "./path/to/Component.hjx"
  AnotherComponent from "./path/to/Another.hjx"
```

## Using Imported Components

After importing, use components like built-in elements:

```hjx
imports:
  Button from "./Button.hjx"
  Card from "./Card.hjx"

layout:
  Card (title="My Card"):
    text: "Hello from the card!"
    Button (on click -> handleClick): "Click Me"
```

## Props

Pass data to components using props:

```hjx
Card (title="Welcome" class="w-[400px]")
Button (variant="primary" disabled=false)
Input (placeholder="Enter text" type="email")
```

### Common Props

| Prop | Description |
|------|-------------|
| `title` | Title text (for cards, etc.) |
| `class` | Additional CSS classes |
| `disabled` | Disable the element |
| `placeholder` | Placeholder text |
| `type` | Input type (text, email, password) |
| `value` | Input value |

## Slots

Components can have slot content:

```hjx
Card (title="Form"):
  Input (bind value <-> email)
  Input (bind value <-> password)
  Button (on click -> submit): "Login"
```

The content between component tags becomes the slot content.

## Creating Reusable Components

### Button.hjx

```hjx
component Button

state:
  label = "Button"
  variant = "primary"

layout:
  view.button (on click -> handleClick):
    text: "{{label}}"

style:
  .button {
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    border: none;
    font-weight: 500;
  }
  .primary { background: #007bff; color: white; }
  .secondary { background: #6c757d; color: white; }

handlers:
  handleClick:
    log "Button clicked!"
```

### Card.hjx

```hjx
component Card

state:
  title = ""

layout:
  view.card:
    if (title !== ""):
      view.header: "{{title}}"
    view.content:
      # Slot content here

style:
  .card { border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; }
  .header { padding: 16px; border-bottom: 1px solid #e0e0e0; font-weight: 600; }
  .content { padding: 16px; }
```

## Relative Paths

Use relative paths from the current file:

```hjx
imports:
  Button from "./components/Button.hjx"
  Card from "./components/Card.hjx"
  Header from "../Header.hjx"
  Base from "../../BaseComponent.hjx"
```

## Complete Example

```hjx
component LoginForm

imports:
  Button from "./Button.hjx"
  Input from "./Input.hjx"
  Card from "./Card.hjx"

state:
  email = ""
  password = ""
  message = ""

layout:
  view.container:
    Card (title="Login"):
      view.form:
        Input (placeholder="Email" bind value <-> email)
        Input (placeholder="Password" type="password" bind value <-> password)
        Button (on click -> login): "Sign In"
        text.error: "{{message}}"

style:
  .container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5; }
  .form { display: flex; flex-direction: column; gap: 12px; min-width: 300px; }
  .error { color: red; font-size: 14px; text-align: center; }

handlers:
  login:
    if (email === ""):
      set message = "Please enter email"
    else if (password === ""):
      set message = "Please enter password"
    else:
      set message = "Welcome, " + email + "!"
```

## Best Practices

1. **Organize components** - Keep related components in folders
2. **Use index files** - Export multiple components from one file (future)
3. **Document props** - Comment expected props
4. **Keep components focused** - Single responsibility
