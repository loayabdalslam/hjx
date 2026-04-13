---
sidebar_label: REST API Integration
---

# REST API Integration

Define API endpoints directly in HJX and auto-generate Express.js backend routes.

## Defining Endpoints

```hjx
api:
  GET /api/todos -> fetchTodos:
    query:
      page = 1
      limit = 10

  POST /api/todos -> createTodo:
    body:
      text = string
      done = boolean

  PUT /api/todos/:id -> updateTodo:
    params:
      id = number
    body:
      done = boolean

  DELETE /api/todos/:id -> deleteTodo:
    params:
      id = number
```

## Using in Handlers

```hjx
handlers:
  loadData:
    fetch fetchTodos -> todos
    set items = todos

  addItem:
    fetch createTodo with { text: newItem, done: false } -> result
    set items = [...items, result]
    set newItem = ""

  toggleDone:
    fetch updateTodo with { id: todo.id, done: !todo.done } -> updated
    set items = items.map(t -> t.id === updated.id ? updated : t)

  deleteItem:
    fetch deleteTodo with { id: todo.id }
    set items = items.filter(t -> t.id != todo.id)
```

## Compile with Backend

```bash
hjx build todo-app.hjx --target react --backend
```

### Generated Backend Files

**api/routes.ts:**

```typescript
import { Router } from 'express';
import * as handlers from './handlers.js';

const router = Router();

router.get('/api/todos', handlers.fetchTodos);
router.post('/api/todos', handlers.createTodo);
router.put('/api/todos/:id', handlers.updateTodo);
router.delete('/api/todos/:id', handlers.deleteTodo);

export default router;
```

**api/handlers.ts:**

```typescript
import { Request, Response } from 'express';

export async function fetchTodos(req: Request, res: Response) {
  try {
    const { page, limit } = req.query;
    // TODO: Implement database query
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function createTodo(req: Request, res: Response) {
  try {
    const { text, done } = req.body;
    // TODO: Implement database insert
    res.json({ success: true, data: { text, done } });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
```

## Flow-State API Definition

Define endpoints using natural language:

```bash
hjx flow "add get endpoint /api/todos"
hjx flow "add post endpoint /api/todos"
hjx flow "fetch from /api/users"
```

## Complete Example

```hjx
component TodoApp

state:
  todos = []
  newTodo = ""
  loading = false

api:
  GET /api/todos -> fetchTodos
  POST /api/todos -> createTodo
  DELETE /api/todos/:id -> deleteTodo

layout:
  view.container:
    text.title: "Todo App"

    if (loading):
      text: "Loading..."

    view.input-section:
      input.field (bind value <-> newTodo):
      button.primary (on click -> addTodo): "Add"

    for (todo in todos):
      view.todo-item:
        text: "{{todo.text}}"
        button.delete (on click -> deleteItem): "Delete"

style:
  .container:
    container
    display flex
    flex direction column
    gap 20px

  .input-section:
    display flex
    gap 12px

  .field:
    input field

  .primary:
    button primary

handlers:
  addTodo:
    set loading = true
    fetch createTodo with { text: newTodo } -> result
    set todos = [...todos, result]
    set newTodo = ""
    set loading = false

  deleteItem:
    fetch deleteTodo with { id: todo.id }
    set todos = todos.filter(t -> t.id != todo.id)
```

## Next

- [React Compilation](./react-compilation) — Generate React components
- [Grammar System](./grammar-system) — Customize the language
