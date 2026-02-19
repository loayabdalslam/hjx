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

## Compilation Output

The vanilla compiler generates three files:

- **`index.html`**: Minimal HTML page with embedded runtime
- **`app.css`**: Scoped CSS styles
- **`app.js`**: Component logic and runtime code