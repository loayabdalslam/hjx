# React Compilation

Compile HJX directly to React functional components with hooks and CSS modules.

## Basic Usage

```bash
hjx build counter.hjx --target react
```

### Generated Files

- `Counter.tsx` — React component with `useState` hooks
- `Counter.module.css` — Scoped CSS modules

## Example

**Input (counter.hjx):**

```hjx
component Counter

state:
  count = 0

layout:
  view#root.card:
    text.title: "Count: {{count}}"
    button.primary (on click -> inc): "Increase"
    button.secondary (on click -> dec): "Decrease"

style:
  .card:
    card
    text align center
    display flex
    flex direction column
    gap 24px

  .primary:
    button primary

  .secondary:
    button secondary

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
```

**Output (Counter.tsx):**

```tsx
import React, { useState } from 'react';
import styles from './Counter.module.css';

export function Counter() {
  const [count, setCount] = useState(0);

  function inc() {
    setCount(count + 1);
  }

  function dec() {
    setCount(count - 1);
  }

  return (
    <view className={styles.card} id="root">
      <text className={styles.title}>Count: {count}</text>
      <button className={styles.primary} onClick={() => inc()}>Increase</button>
      <button className={styles.secondary} onClick={() => dec()}>Decrease</button>
    </view>
  );
}
```

**Output (Counter.module.css):**

```css
[data-hjx-scope="hjx-counter"] .card {
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

[data-hjx-scope="hjx-counter"] .primary {
  padding: 10px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}
```

## React + Backend

Compile with Express.js backend routes:

```bash
hjx build todo-app.hjx --target react --backend
```

### Generated Backend Files

- `api/routes.ts` — Express.js routes
- `api/handlers.ts` — TypeScript API handlers

```typescript
// api/routes.ts
import { Router } from 'express';
import * as handlers from './handlers.js';

const router = Router();

router.get('/api/todos', handlers.fetchTodos);
router.post('/api/todos', handlers.createTodo);
router.put('/api/todos/:id', handlers.updateTodo);
router.delete('/api/todos/:id', handlers.deleteTodo);

export default router;
```

## Features

- **useState hooks** — All state variables become React state
- **Event handlers** — Click handlers converted to onClick
- **Two-way binding** — Input binding with onChange
- **Conditionals** — `if` becomes `{condition && (...)}`
- **Loops** — `for` becomes `{list.map(...)}`
- **CSS Modules** — Scoped styles with `[data-hjx-scope]`

## Next Steps

- Learn about [REST API Integration](./api-integration)
- Explore [Natural Language CSS](./nl-css)
