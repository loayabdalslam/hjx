# Composition Example

A complete example showing component composition, imports, props, and slots.

## The Code

```hjx
component CompositionDemo

imports:
  Button from "./Button.hjx"
  Input from "./Input.hjx"
  Card from "./Card.hjx"

state:
  name = ""
  count = 0
  message = "Welcome to HJX Composition!"

layout:
  view.container:
    Card (title="Login" description="Enter your details below"):
      view.form:
        view.field:
          text.label: "Username"
          Input (placeholder="johndoe" bind value <-> name)
        
        view.field:
          text.label: "Counter: {{count}}"
          view.counter:
            Button (variant="outline" on click -> dec): "-"
            Button (on click -> inc): "+"
        
        Button (class="w-full" on click -> submit): "Submit"
        
        text.message: "{{message}}"

style:
  .container { 
    min-height: 100vh; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    padding: 16px; 
    background: #f5f5f5; 
    font-family: system-ui, sans-serif;
  }
  .form { display: flex; flex-direction: column; gap: 16px; }
  .field { display: flex; flex-direction: column; gap: 4px; }
  .label { font-size: 14px; font-weight: 500; color: #374151; }
  .counter { display: flex; gap: 8px; }
  .message { text-align: center; font-size: 14px; color: #6b7280; margin-top: 8px; }

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
  submit:
    set message = "Hello " + name + "! You clicked " + count + " times."
```

## Features Demonstrated

### 1. Imports

```hjx
imports:
  Button from "./Button.hjx"
  Input from "./Input.hjx"
  Card from "./Card.hjx"
```

Import reusable components from other files.

### 2. Props

```hjx
Card (title="Login" description="Enter your details below"):
```

Pass data to components using props.

### 3. Slots

```hjx
Card (title="Login"):
  view.form:
    # Slot content
```

Content inside component tags becomes the slot.

### 4. Multiple Components

Use imported components like built-in elements:

```hjx
Input (bind value <-> name)
Button (on click -> submit): "Submit"
```

## Component Files

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
    transition: all 0.2s;
  }
  .primary { background: #007bff; color: white; }
  .primary:hover { background: #0056b3; }
  .outline { background: transparent; border: 1px solid #007bff; color: #007bff; }
  .w-full { width: 100%; }

handlers:
  handleClick:
    log "Button clicked!"
```

### Input.hjx

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
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    width: 100%;
  }
  .input:focus {
    outline: none;
    border-color: #007bff;
  }
```

### Card.hjx

```hjx
component Card

state:
  title = ""
  description = ""

layout:
  view.card:
    if (title !== ""):
      view.header:
        text.title: "{{title}}"
        if (description !== ""):
          text.description: "{{description}}"
    view.content:
      # Slot content

style:
  .card {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 400px;
  }
  .header {
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
  }
  .title {
    font-size: 18px;
    font-weight: 600;
  }
  .description {
    font-size: 14px;
    color: #6b7280;
    margin-top: 4px;
  }
  .content {
    padding: 20px;
  }
```

## Try It

```bash
node dist/cli.js dev examples/composition_demo.hjx --out dist-app --port 5173
```

Make sure to have the component files in `examples/components/`.

## Composition Patterns

### Reusable UI Library

Create a set of base components:
- Button, Input, Card
- Modal, Dropdown, Tabs
- Form, Select, Checkbox

### Feature Components

Build larger features:
- LoginForm, RegisterForm
- UserProfile, SettingsPanel
- TodoList, KanbanBoard

### Page Components

Compose pages from features:
- Dashboard = Card + Metric + Chart
- Admin = Table + Modal + Form

## Best Practices

1. **One component per file** - Keep them focused
2. **Document props** - Comment expected props
3. **Consistent styling** - Follow a design system
4. **Test components** - Verify in isolation
