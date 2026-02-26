# Syntax Overview

This document provides a complete reference for the HJX syntax.

## File Structure

Every `.hjx` file has this structure:

```hjx
component <Name>

imports:           # Optional
  Component from "./Component.hjx"

state:             # Optional
  variable = value

script:            # Optional
  export function init(store) {}

layout:            # Required
  view: "content"

style:             # Optional
  .class { }

handlers:          # Optional
  handlerName:
    # statements
```

## Block Syntax

Each block starts with a keyword followed by a colon:

```hjx
component: Name    # ❌ Invalid
component Name    # ✅ Invalid  
component:        # ✅ Declares component (name on next line)
```

The correct format:

```hjx
component Name    # ✅ Component declaration
  imports:        # ✅ Block starts with colon
  state:          # ✅ Another block
```

## Indentation

HJX uses **indentation** to define hierarchy:

```hjx
layout:
  view:           # Indented 2 spaces
    text:         # Indented 4 spaces
    button:       # Indented 4 spaces
```

Use **2 or 4 spaces** consistently. Tabs are not recommended.

## Comments

Comments start with `#`:

```hjx
# This is a comment
component Counter
  state:
    count = 0  # Inline comment
```

## Case Sensitivity

- **Keywords** are lowercase: `component`, `state`, `layout`, `style`
- **Component names** are PascalCase: `MyComponent`
- **Variables** are camelCase: `myVariable`

## Reserved Words

These words cannot be used as variable names:

- `component`, `imports`, `state`, `script`, `layout`, `style`, `handlers`
- `if`, `for`, `true`, `false`, `null`, `undefined`

## Encoding

Files should be UTF-8 encoded.

## Line Endings

Use Unix-style line endings (`\n`) for best compatibility.

## Complete Example

```hjx
component Demo

# Import other components
imports:
  Button from "./Button.hjx"

# Reactive state variables
state:
  count = 0
  name = "World"
  items = ["a", "b", "c"]

# Server-side initialization (server-driven mode)
script:
  export function init(store) {
    setInterval(() => {
      store.set({ count: store.get('count') + 1 });
    }, 1000);
  }

# UI layout with indentation
layout:
  view#app.container:
    text.title: "Hello {{name}}!"
    text: "Count: {{count}}"
    
    # Conditional
    if (count > 10):
      text.warning: "High count!"
    
    # Loop
    for (item in items):
      text.item: "• {{item}}"
    
    # Event binding
    button (on click -> increment): "+"
    button (on click -> decrement): "-"

# Scoped CSS
style:
  .container { padding: 20px; font-family: system-ui; }
  .title { font-size: 24px; font-weight: bold; }
  .warning { color: red; }

# Event handlers
handlers:
  increment:
    set count = count + 1
  decrement:
    set count = count - 1
```

## Next Steps

- [Component Declaration](/language/component)
- [State Block](/language/state)
- [Layout Block](/language/layout)
- [Style Block](/language/style)
- [Handlers Block](/language/handlers)
