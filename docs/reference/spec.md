# Language Specification v0.1

## File Structure

A `.hjx` file contains blocks in this order (order is flexible but recommended):

1. `component <Name>`
2. `state:`
3. `layout:`
4. `style:`
5. `handlers:`

Blocks are indentation-sensitive (2 spaces recommended).

## Component Declaration

### Syntax
```
component <Identifier>
```

### Example
```hjx
component Counter
```

## State Block

Defines reactive variables (component-local).

### Syntax
```
state:
  name = value
  title = "Hello"
  enabled = true
```

### Supported Types
- `number`: `42`, `3.14`
- `string`: `"hello"`, `'world'`
- `boolean`: `true`, `false`
- `array`: `["item1", "item2"]`
- `object`: `{ name: "John", age: 30 }`

## Imports Block

Import and compose other `.hjx` components:

### Syntax
```
imports:
  Button from "./components/Button.hjx"
  Card from "./components/Card.hjx"
```

Use imported components in layout with **props** and **slots**:

```hjx
layout:
  Card (title="My Card"):
    text: "This is slot content"
    Button (variant="primary" on click -> save): "Save"
```

## Layout Block

Defines a tree of DOM nodes.

### Supported Node Types
- `view`: Generic container element
- `text`: Text content
- `button`: Interactive button
- `input`: Form input field

### Node Syntax

#### Container Node (with children)
```
view#id.class1.class2 (attrs):
  child nodes...
```

#### Leaf Node with Text
```
text: "Hello {{variable}}"
```

#### Button with Event
```
button.primary (on click -> handler): "Click me"
```

#### Input with Binding
```
input (bind value <-> stateVar)
```

### Control Flow

#### Conditional Rendering
```hjx
layout:
  if (isLoggedIn):
    text: "Welcome back!"

  if (!isLoggedIn):
    text: "Please log in."

  if (status === "active"):
    text: "Account is active"
```

**Supported condition operators:** `!` (negation), `===` (equality), `==` (equality), `!=` (inequality)

#### Loop Rendering
```hjx
layout:
  for (item in items):
    view.row:
      text: "{{item}}"
```

The loop variable (`item`) is available for interpolation within the loop body.

### Attributes and Modifiers

- **ID**: `#myId`
- **Classes**: `.class1.class2`
- **Events**: `(on click -> handlerName)`
- **Bindings**: `(bind value <-> stateVar)`
- **Custom Attributes**: `(attr="value")`

## Style Block

Raw CSS rules. The compiler automatically scopes them by prefixing selectors with a component-specific attribute.

### Syntax
```
style:
  .card { padding: 16px; border: 1px solid #ddd; }
  .button { cursor: pointer; }
```

## Handlers Block

Defines event handler functions using a simple statement language.

### Syntax
```
handlers:
  handlerName:
    statement1
    statement2
```

### Supported Statements

#### Variable Assignment
```
set variable = expression
```

#### Debug Logging
```
log "message"
```

### Expressions

- Numbers: `42`, `3.14`
- Identifiers: `count`, `name`
- Parentheses: `(a + b)`
- Binary operations: `+`, `-`, `*`, `/`
- Array spread: `[...items, newItem]`

## Script Block (Optional)

Server-side initialization code. The `init(store)` function receives a reactive store for background state updates:

```hjx
script:
  export function init(store) {
    setInterval(() => {
      store.set({ timestamp: Date.now() });
    }, 1000);
  }
```

The store provides:
- `store.get(key?)` — get current state (or specific key)
- `store.set(patch)` — update state and push changes to clients

## Compilation Output

The vanilla compiler generates three files:

- **`index.html`**: Minimal HTML page with embedded runtime
- **`app.css`**: Scoped CSS styles
- **`app.js`**: Component logic and runtime code

The server-driven compiler additionally includes:
- WebSocket client for real-time state synchronization
- Server-managed state evaluation
- Automatic UI updates on state changes