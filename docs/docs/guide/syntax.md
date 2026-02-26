# HJX Syntax

HJX uses an indentation-based syntax similar to Python. Each `.hjx` file is divided into blocks.

## Basic Structure

A typical HJX file has these sections:

```hjx
component ComponentName

imports:
  Button from "./components/Button.hjx"

state:
  variableName = value

layout:
  element.class#id (events): "text content"

style:
  .selector { property: value; }

handlers:
  handlerName:
    statements
```

## Component Declaration

Every HJX file must start with a component declaration:

```hjx
component MyComponent
```

The component name must be a valid identifier (letters, numbers, underscores, starting with a letter or underscore).

## Imports

Import other HJX components:

```hjx
imports:
  Button from "./Button.hjx"
  Card from "./Card.hjx"
```

Imported components can be used in the layout using their name as a tag.

## State

Define reactive state variables:

```hjx
state:
  count = 0
  name = "World"
  isVisible = true
  items = ["a", "b", "c"]
```

Supported value types:
- Numbers (`0`, `42`, `3.14`)
- Strings (`"hello"` or `'hello'`)
- Booleans (`true`, `false`)
- Arrays (`[1, 2, 3]`)

## Layout

The layout block defines your HTML structure using indentation:

### Basic Elements

```hjx
layout:
  div.container:
    h1: "Hello World"
    p.description: "This is a paragraph"
    span.label: "Label Text"
```

### Elements with Classes and IDs

```hjx
layout:
  div#app.container:
    div.card.primary:
      text: "Content"
```

### Event Handlers

Attach event handlers directly in the layout:

```hjx
layout:
  button (on click -> handleClick): "Click Me"
  input (on input -> handleInput)
  form (on submit -> handleSubmit):
```

### Text Interpolation

Use `{{variableName}}` to display state values:

```hjx
layout:
  text: "Hello {{name}}"
  text: "Count: {{count}}"
```

### Conditional Rendering (if)

```hjx
layout:
  if (isLoggedIn):
    view.dashboard:
      text: "Welcome back!"
  
  if (!isLoggedIn):
    view.login-prompt:
      text: "Please log in"
```

### List Rendering (for)

```hjx
layout:
  for (item in items):
    view.item:
      text: "{{item.name}}"
```

## Style

The style block contains CSS. It's scoped to your component automatically:

```hjx
style:
  .container { padding: 20px; }
  .card { background: white; border-radius: 8px; }
  button.primary { background: blue; color: white; }
```

Each style selector is automatically scoped with a unique class to prevent conflicts.

## Handlers

Define event handlers in the handlers block:

```hjx
handlers:
  handleClick:
    set count = count + 1
  
  handleSubmit:
    log "Form submitted"
    set isSubmitted = true
  
  complexHandler:
    set temp = count * 2
    set count = temp + 1
    if (count > 10):
      set count = 0
```

### Available Statements

- `set variable = expression` - Update state
- `log "message"` - Log to console
- Conditionals inside handlers using `if (condition):`

### Expressions

Expressions support:
- Arithmetic: `+`, `-`, `*`, `/`
- Comparison: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Logical: `&&`, `||`, `!`
- String concatenation with `+`

## Complete Example

```hjx
component UserProfile

state:
  username = "Alice"
  isPremium = false
  posts = ["Hello", "World"]

layout:
  view.profile:
    text.greeting: "Welcome {{username}}"
    
    if (isPremium):
      view.badge: "⭐ Premium"
    
    for (post in posts):
      view.post:
        text: "{{post}}"
    
    button (on click -> togglePremium):
      "Toggle Premium"

style:
  .profile { padding: 20px; }
  .greeting { font-size: 24px; }
  .badge { color: gold; }

handlers:
  togglePremium:
    set isPremium = !isPremium
```
