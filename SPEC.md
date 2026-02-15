# HJX Spec v0.1 (Draft)

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
```

Types supported: number, string, boolean.

## layout
Defines a tree of nodes.

Supported node kinds: `view`, `text`, `button`, `input`

Node syntax forms:

### Container node (can have children)
`view#id.class1.class2:`

### Leaf node with inline string
`text: "Hello {{name}}"`

### Button with handler
`button.primary (on click -> inc): "Increase"`

### Input with binding
`input (bind value <-> email)`

Notes:
- `#id` optional; `.class` repeated allowed
- `{{var}}` interpolates from state
- Click event supported: `(on click -> handlerName)`
- Two-way binding supported for input `value`

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

## Compilation output
Vanilla target emits:
- `index.html` : minimal page
- `app.css`    : scoped styles
- `app.js`     : runtime + compiled component
