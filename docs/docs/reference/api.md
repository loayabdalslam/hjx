# API Reference

## Runtime API

The runtime provides functions for state management and DOM binding.

### createStore

Creates a reactive state store:

```typescript
function createStore(initial: Record<string, any>): Store
```

**Parameters:**
- `initial` - Initial state object

**Returns:**
- Store with `get()`, `set()`, and `subscribe()` methods

**Example:**

```typescript
const store = createStore({ count: 0 });
store.get(); // { count: 0 }
store.set({ count: 1 });
```

### Store Methods

#### get()

Get current state:

```typescript
store.get(): Record<string, any>
```

#### set()

Update state:

```typescript
store.set(patch: Record<string, any>): void
```

#### subscribe()

Subscribe to state changes:

```typescript
store.subscribe(fn: () => void): () => void
```

Returns unsubscribe function.

## Binders

### textBinder

Bind text content to state:

```typescript
function textBinder(
  store: Store,
  root: Element,
  selector: string,
  template: string
): void
```

**Parameters:**
- `store` - The state store
- `root` - Root element to search in
- `selector` - CSS selector for target element
- `template` - Template with `{{variable}}` placeholders

### clickBinder

Bind click events:

```typescript
function clickBinder(
  store: Store,
  root: Element,
  selector: string,
  fn: (ctx: Context) => void
): void
```

### inputBinder

Bind two-way input:

```typescript
function inputBinder(
  store: Store,
  root: Element,
  selector: string,
  stateKey: string
): void
```

### ifBinder

Bind conditional rendering:

```typescript
function ifBinder(
  store: Store,
  root: Element,
  selector: string,
  condition: string
): void
```

### forBinder

Bind list rendering:

```typescript
function forBinder(
  store: Store,
  root: Element,
  selector: string,
  itemName: string,
  listName: string
): void
```

## Context Object

Handlers receive a context object:

```typescript
interface Context {
  store: Store;
  event: Event;
  el: Element;
}
```

## Usage Example

```typescript
import { createStore, mount, textBinder, clickBinder } from './runtime.js';

const store = createStore({ count: 0 });

const handlers = {
  increment: (ctx) => {
    ctx.store.set({ count: ctx.store.get().count + 1 });
  }
};

// Bind text
textBinder(store, root, '.count', 'Count: {{count}}');

// Bind click
clickBinder(store, root, 'button', (ctx) => {
  handlers.increment(ctx);
});
```
