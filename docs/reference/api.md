# API Reference

Low-level APIs for advanced HJX usage and integration.

## Parser API

### `parseHJX(source: string, filename?: string): HJXAst`

Parses HJX source code into an AST.

**Parameters:**
- `source`: The HJX source code as a string
- `filename`: Optional filename for error reporting

**Returns:** `HJXAst` object

## Compiler APIs

### `buildVanilla(ast: HJXAst): { html: string; css: string; js: string }`

Compiles an AST to vanilla HTML/CSS/JS.

**Parameters:**
- `ast`: Parsed HJX AST

**Returns:** Object with `html`, `css`, and `js` strings

### `buildServerDriven(ast: HJXAst): { html: string; css: string; js: string }`

Compiles an AST for server-driven rendering.

## Runtime APIs

### `createStore(initial: Record<string, any>)`

Creates a reactive state store.

**Returns:** Store object with `get()`, `set(patch)`, and `subscribe(fn)` methods

### `textBinder(store, root, selector, template)`

Binds text interpolation to DOM elements.

### `clickBinder(store, root, selector, handler)`

Binds click events to handlers.

### `inputBinder(store, root, selector, stateKey)`

Binds input elements to state with two-way binding.

## Type Definitions

### `HJXAst`
```typescript
{
  kind: "HJXAst";
  version: "0.1";
  component: { name: string };
  imports: Record<string, string>;
  script: string;
  state: Record<string, HJXStateValue>;
  layout: HJXNode | null;
  style: string;
  handlers: Record<string, HJXHandler>;
}
```

### `HJXNode`
```typescript
{
  kind: "node";
  tag: string;
  id?: string;
  classes: string[];
  attrs: Record<string, string>;
  text: string | null;
  events: Record<string, string>;
  bind: HJXBind | null;
  children: HJXNode[];
}
```

### `HJXHandler`
```typescript
{
  name: string;
  body: string[]; // Array of statement lines
}
```