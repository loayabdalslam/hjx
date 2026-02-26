# Runtime API

The runtime provides client-side reactivity for HJX components.

## Overview

The runtime:
1. Mounts components to the DOM
2. Tracks reactive state changes
3. Updates the DOM efficiently
4. Handles event binding

## Usage

```javascript
import { runtime } from './dist/runtime.js';

// Mount a component
runtime.mount(document.getElementById('root'), {
  html: '...',
  css: '...',
  js: '...'
});
```

## Functions

### runtime.mount(element: HTMLElement, component: CompiledComponent): void

Mount a compiled component to an element.

```javascript
const container = document.getElementById('root');
runtime.mount(container, compiledComponent);
```

### runtime.unmount(element: HTMLElement): void

Unmount a component.

```javascript
runtime.unmount(document.getElementById('root'));
```

### runtime.createStore(initialState: State): Store

Create a reactive store.

```javascript
const store = runtime.createStore({ count: 0 });
store.subscribe((state) => {
  console.log('State changed:', state);
});
```

## Store API

### store.get(key: string): any

Get a state value.

```javascript
const count = store.get('count');
```

### store.set(key: string | object, value?: any): void

Set state values.

```javascript
store.set('count', 42);
store.set({ count: 42, name: 'John' });
```

### store.subscribe(handler: (state: State) => void): () => void

Subscribe to state changes.

```javascript
const unsubscribe = store.subscribe((state) => {
  console.log('State:', state);
});

// Later
unsubscribe();
```

### store.compute(key: string, fn: () => any): void

Create a computed value.

```javascript
store.compute('fullName', () => {
  return store.get('firstName') + ' ' + store.get('lastName');
});
```

## Event Handling

The runtime handles DOM events:

```javascript
// Click events
element.addEventListener('click', handler);

// Input events
element.addEventListener('input', handler);

// Form events
element.addEventListener('submit', handler);
```

## DOM Updates

The runtime uses fine-grained updates:

1. Track which state each element depends on
2. On state change, update only affected elements
3. Avoid full re-renders

## Integration

### With Frameworks

```javascript
// React
import { runtime } from './dist/runtime.js';

function HJXComponent({ code }) {
  const ref = useRef();
  
  useEffect(() => {
    const compiled = compile(parse(code));
    runtime.mount(ref.current, compiled);
    return () => runtime.unmount(ref.current);
  }, [code]);
  
  return <div ref={ref} />;
}
```

### Vanilla JS

```javascript
import { parse } from './dist/parser.js';
import { compile } from './dist/compiler/vanilla.js';
import { runtime } from './dist/runtime.js';

const source = `...`;
const ast = parse(source);
const compiled = compile(ast);

runtime.mount(document.getElementById('app'), compiled);
```

## Performance

Runtime optimizations:
- **Fine-grained reactivity** - Only update changed parts
- **Event delegation** - Single listener per event type
- **Batch updates** - Group rapid state changes
- **Memoization** - Cache computed values

## SSR Support

For server-side rendering:

```javascript
import { renderToString } from './dist/runtime.js';

const html = renderToString(compiled);
console.log(html);
```
