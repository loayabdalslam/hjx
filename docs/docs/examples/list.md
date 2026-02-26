# Lists Example

Demonstrates using `for` blocks to render lists of items.

## Source Code

```hjx
component TodoList

state:
  todos = [
    { id: 1, text: "Buy groceries", done: false },
    { id: 2, text: "Walk the dog", done: true },
    { id: 3, text: "Finish project", done: false }
  ]
  newTodo = ""

layout:
  view.container:
    text.title: "My Todos"
    
    view.add-form:
      input (bind value -> newTodo)
      button (on click -> addTodo): "Add"
    
    view.list:
      for (todo in todos):
        view.item (class done: todo.done):
          checkbox (on change -> toggleTodo, data-id: todo.id)
          text.todo-text: "{{todo.text}}"
          button.delete (on click -> deleteTodo, data-id: todo.id): "×"

style:
  .container { max-width: 500px; margin: 40px auto; font-family: system-ui; }
  .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
  .add-form { display: flex; gap: 10px; margin-bottom: 20px; }
  .add-form input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
  .add-form button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; }
  .item { display: flex; align-items: center; gap: 10px; padding: 12px; border-bottom: 1px solid #eee; }
  .item.done { opacity: 0.5; }
  .item.done .todo-text { text-decoration: line-through; }
  .todo-text { flex: 1; }
  .delete { background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; padding: 5px 10px; }

handlers:
  addTodo:
    if (newTodo != ""):
      set todos = todos + [{ id: Date.now(), text: newTodo, done: false }]
      set newTodo = ""
  
  toggleTodo:
    log "Toggle todo"
  
  deleteTodo:
    set todos = todos.filter(t => t.id != todo.id)
```

## Key Concepts

- **for blocks**: Iterate over arrays
- **Array methods**: Use `.filter()` in handlers
- **Conditional classes**: Apply classes based on state

## How It Works

1. `for (todo in todos)` iterates over the array
2. Each item is rendered with its properties
3. Clicking "Add" appends to the array
4. The list updates automatically

## Running

```bash
node dist/cli.js dev examples/list.hjx --out dist-app --port 5172
```
