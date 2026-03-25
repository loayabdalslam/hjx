# Language Spec

The complete HJX v0.1 language specification.

## File Structure

A `.hjx` file contains blocks in this order (flexible but recommended):

1. `component <Name>`
2. `imports:`
3. `state:`
4. `computed:`
5. `layout:`
6. `style:`
7. `handlers:`
8. `script:`

Blocks are indentation-sensitive (2 spaces recommended).

## Component Declaration

```hjx
component Counter
```

Declares the component name. Must be a valid identifier (letters, numbers, underscore).

## Imports

```hjx
imports:
  Button from "./components/Button.hjx"
  Card from "./components/Card.hjx"
```

Import other `.hjx` components for composition.

## State

Defines reactive variables (component-local):

```hjx
state:
  count = 0
  title = "Hello"
  enabled = true
  items = ["todo1", "todo2"]
  user = { name: "Alice", age: 30 }
```

**Supported types:** `number`, `string`, `boolean`, `array`, `object`

## Computed

Derived values calculated from state:

```hjx
computed:
  doubled = count * 2
  fullName = firstName + " " + lastName
```

## Layout

Defines a tree of UI nodes with control flow.

### Container node
```hjx
view#id.class1.class2:
```

### Leaf with text
```hjx
text: "Hello {{name}}"
```

### Button with handler
```hjx
button.primary (on click -> inc): "Increase"
```

### Input with binding
```hjx
input (bind value <-> email)
```

### Conditional
```hjx
if (isLoggedIn):
  text: "Welcome back!"

if (!isPremium):
  button (on click -> upgrade): "Upgrade"
```

**Supported conditions:**
- Variable: `if (isLoggedIn):`
- Negation: `if (!isPremium):`
- Equality: `if (status === "active"):`
- Inequality: `if (status != "pending"):`

### Loop
```hjx
for (item in items):
  view.row:
    text: "{{item}}"
```

### Notes
- `#id` is optional; `.class` can be repeated
- `{{var}}` interpolates from state
- `(on click -> handlerName)` executes handler
- `(bind value <-> key)` enables two-way binding
- CSS classes support `:` and `/` (Tailwind-ready)

## Style

Raw CSS rules. Compiler scopes them by prefixing selectors with a component attribute:

```hjx
style:
  .card { padding: 16px; border-radius: 12px; }
  .primary { background: blue; color: white; }
```

## Handlers

A tiny statement language for event handlers:

```hjx
handlers:
  increment:
    set count = count + 1
  decrement:
    set count = count - 1
  debug:
    log "Button clicked"
```

**Statements:**
- `set <name> = <expr>` — Update state variable
- `log "<string>"` — Console log

**Expressions:**
- Numbers, identifiers, parentheses
- Binary ops: `+ - * /`
- Ternary: `condition ? valueA : valueB`

## Script (Optional)

JavaScript that runs on the server or with `init()`:

```hjx
script:
  export function init(store) {
    setInterval(() => {
      store.set({ timestamp: Date.now() });
    }, 1000);
  }
```

## Compilation Output

### Vanilla Target
- `index.html` — Minimal page with scoped styles
- `app.css` — Scoped CSS
- `app.js` — Runtime + compiled component

### Server-Driven Target
- Same as vanilla, plus WebSocket synchronization
- Server manages state and evaluates conditions/loops
- Real-time updates via WebSocket
