# HJX Spec v0.1

## File structure
A `.hjx` file contains blocks in this order (order is flexible but recommended):
1. `component <Name>`
2. `state:`
3. `layout:`
4. `style:`
5. `handlers:`

Blocks are indentation-sensitive (2 spaces recommended).

## component
Syntax:
`component <Identifier>`

Example:
`component Counter`

## state
Defines reactive variables (component-local).

Syntax (subset):
```
state:
  name = 0
  title = "Hello"
  enabled = true
  items = ["todo1", "todo2"]
```

Types supported: number, string, boolean, arrays, objects.

## layout
Defines a tree of nodes with optional control flow.

Supported node kinds: `view`, `text`, `button`, `input`, `if`, `for`

Node syntax forms:

### Container node (can have children)
`view#id.class1.class2:`

### Leaf node with inline string
`text: "Hello {{name}}"`

### Button with handler
`button.primary (on click -> inc): "Increase"`

### Input with binding
`input (bind value <-> email)`

### Conditional block
```
if (condition):
  view.optional:
    text: "Shows if condition is true"
```

Supported conditions:
- Variable: `if (isLoggedIn):`
- Negation: `if (!isPremium):`
- Equality: `if (status === "active"):`
- Inequality: `if (status != "pending"):`

### Loop block
```
for (item in items):
  view.row:
    text: "{{item}}"
```

Notes:
- `#id` optional; `.class` repeated allowed
- `{{var}}` interpolates from state
- `{{item}}` in loops refers to loop variable
- `(on click -> handlerName)` executes handler
- Two-way binding for `input` (bind value <-> key)
- CSS classes support complex characters like `:` and `/` (Tailwind-ready)
- Control flow blocks can be nested
- If/for blocks automatically show/hide based on condition/list

## style
Raw CSS rules. Compiler scopes them by prefixing selectors with the component scope attribute.

Example:
```
style:
  .card { padding: 16px; }
```

## handlers
Defines handler bodies. Handler body uses a tiny statement language.

Syntax:
```
handlers:
  inc:
    set count = count + 1
  debug:
    log "hi"
```

Statements supported:
- `set <name> = <expr>`
- `log "<string>"`

Expressions:
- numbers, identifiers, parentheses
- binary ops: `+ - * /`

## script (Optional)
Background/initialization code that runs on the server (dev mode) or with `init()` export.

Example:
```
script:
  export function init(store) {
    setInterval(() => {
      store.set({ timestamp: Date.now() });
    }, 1000);
  }
```

## Compilation output
Vanilla target emits:
- `index.html` : minimal page with scoped styles
- `app.css`    : scoped styles
- `app.js`     : runtime + compiled component + handlers

Server-driven target emits:
- Same as vanilla, but with WebSocket synchronization
- Server manages state and evaluates conditions/loops
- Real-time updates via WebSocket connection
