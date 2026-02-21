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

### `buildServerDriven(tree: LoadedComponent): { html: string; css: string; js: string }`

Compiles a loaded component tree for server-driven rendering with WebSocket synchronization.

**Parameters:**
- `tree`: A `LoadedComponent` object (from `loadComponentTree`)

**Returns:** Object with `html`, `css`, and `js` strings

### `loadComponentTree(filePath: string): LoadedComponent`

Recursively loads a `.hjx` file and all its imported components into a component tree.

**Parameters:**
- `filePath`: Absolute path to the root `.hjx` file

**Returns:** `LoadedComponent` object with `ast`, `path`, and resolved `imports`

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

### `ifBinder(store, root, selector, condition)`

Binds conditional visibility to DOM elements based on a condition expression.

### `forBinder(store, root, selector, itemName, listName)`

Binds list rendering — iterates over an array in state and renders template HTML for each item.

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

### `LoadedComponent`
```typescript
{
  ast: HJXAst;
  path: string;
  imports: Record<string, LoadedComponent>;
}
```

### `HJXNode`
```typescript
{
  kind: "node" | "if" | "for" | "else";
  tag: string;
  condition?: string;       // for "if" nodes
  iterator?: {              // for "for" nodes
    item: string;
    list: string;
  };
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