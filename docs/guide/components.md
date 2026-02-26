# Component Composition

Learn how to build reusable components and compose them together.

## Importing Components

First, import components using the `imports:` block:

```hjx
imports:
  Button from "./Button.hjx"
  Card from "./Card.hjx"
  Input from "./Input.hjx"
```

## Using Imported Components

Use imported components like built-in elements:

```hjx
layout:
  Card (title="Welcome"):
    text: "Hello, World!"
    Button (on click -> sayHello): "Click Me"
```

## Props

Pass data to components using props in parentheses:

```hjx
Card (title="My Card" class="w-[400px]")
```

Common props:
- `title` - Card title
- `class` - Additional CSS classes
- `disabled` - Disable element
- `placeholder` - Input placeholder

## Slots

Slot content goes inside the component tags:

```hjx
Card (title="Form"):
  Input (bind value <-> name)
  Button (on click -> submit): "Submit"
```

The content between the component tags becomes the slot.

## Building Reusable Components

### Button Component

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
    transition: all 0.2s;
  }
  .primary { background: #007bff; color: white; }
  .secondary { background: #6c757d; color: white; }
  .outline { background: transparent; border: 1px solid #007bff; color: #007bff; }

handlers:
  handleClick:
    log "Button clicked!"
```

### Card Component

```hjx
component Card

state:
  title = ""

layout:
  view.card:
    if (title !== ""):
      view.header: "{{title}}"
    view.content:
      # Slot content goes here

style:
  .card {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
    background: white;
  }
  .header {
    padding: 16px;
    border-bottom: 1px solid #e0e0e0;
    font-weight: 600;
    font-size: 18px;
  }
  .content {
    padding: 16px;
  }
```

### Input Component

```hjx
component Input

state:
  value = ""
  placeholder = "Enter text..."

layout:
  input.input (bind value <-> value) placeholder="{{placeholder}}"

style:
  .input {
    padding: 10px 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
  }
  .input:focus {
    outline: none;
    border-color: #007bff;
  }
```

## Complete Example

```hjx
component LoginForm

imports:
  Button from "./Button.hjx"
  Card from "./Card.hjx"
  Input from "./Input.hjx"

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
        text.message: "{{message}}"

style:
  .container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .message {
    text-align: center;
    color: #666;
    font-size: 14px;
  }

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

1. **One component per file** - Keep components focused
2. **Use descriptive names** - `PrimaryButton` > `Btn1`
3. **Document props** - Comment what props do
4. **Style consistently** - Follow your design system

## Next Steps

- [Hot Reload](/guide/hot-reload) - Fast development cycle
- [Production Build](/guide/production) - Deploy your app
- [Language Reference](/language/syntax) - Full syntax guide
