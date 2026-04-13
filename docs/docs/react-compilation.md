---
sidebar_label: React Compilation
---

# React Compilation

Compile HJX directly to React functional components with hooks and CSS modules.

## Basic Usage

```bash
hjx build counter.hjx --target react
```

### Generated Files

- `Counter.tsx` — React component with `useState` hooks
- `Counter.module.css` — Scoped CSS modules

## Example: Counter

**Input:**

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

  return (
    <div className={styles.card} id="root">
      <span className={styles.title}>Count: {count}</span>
      <button className={styles.primary} onClick={() => setCount(count + 1)}>
        Increase
      </button>
      <button className={styles.secondary} onClick={() => setCount(count - 1)}>
        Decrease
      </button>
    </div>
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

## Features Converted

| HJX Feature | React Equivalent |
|-------------|-----------------|
| `state: x = 0` | `const [x, setX] = useState(0)` |
| `button (on click -> fn)` | `<button onClick={() => fn()}>` |
| `input (bind value <-> x)` | `<input value={x} onChange={...} />` |
| `if (condition):` | `{condition && (...)}` |
| `for (item in list):` | `{list.map((item) => (...))}` |
| `text: "{{x}}"` | `<span>{x}</span>` |

## React + Backend

```bash
hjx build todo-app.hjx --target react --backend
```

Generates:
- `TodoApp.tsx` — React component with API calls
- `TodoApp.module.css` — CSS modules
- `api/routes.ts` — Express.js routes
- `api/handlers.ts` — TypeScript handlers

## Next

- [REST API Integration](./api-integration) — Define API endpoints
- [Flow-State Engine](./flow-state) — Write UI in English
