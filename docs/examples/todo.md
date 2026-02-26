# Todo List Example

A complete todo list with add, remove, filter, and toggle functionality.

## The Code

```hjx
component TodoList

state:
  items = ["Learn HJX", "Build a UI", "Deploy to production"]
  newItem = ""
  showCompleted = false

layout:
  view.container:
    view.header:
      text.title: "My Todo List"
      text.count: "Items: {{items.length}} tasks"
    
    view.input-section:
      input.todo-input (bind value <-> newItem) placeholder="Add new task..."
      button.add-btn (on click -> addItem): "Add"
    
    view.filters:
      button (on click -> showAll): "All"
      button (on click -> showActive): "Active"
      button (on click -> showCompleted): "Completed"
    
    view.list:
      for (item in filteredItems):
        view.todo-item:
          checkbox (on click -> toggleItem) item.id:
          text: "{{item.text}}"
          if (item.done):
            text.done: "(done)"
          button.delete (on click -> deleteItem): "×"
    
    if (items.length === 0):
      view.empty: "No todos yet! Add one above."
    
    view.footer:
      text.stats: "{{completedCount}} of {{items.length}} completed"
      button (on click -> clearCompleted): "Clear Completed"

style:
  .container { max-width: 500px; margin: 0 auto; padding: 24px; font-family: system-ui, sans-serif; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .title { font-size: 28px; font-weight: 700; }
  .count { font-size: 14px; color: #666; }
  .input-section { display: flex; gap: 8px; margin-bottom: 16px; }
  .todo-input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }
  .add-btn { padding: 12px 20px; background: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; }
  .filters { display: flex; gap: 8px; margin-bottom: 16px; }
  .filters button { padding: 8px 16px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; }
  .filters button.active { background: #007bff; color: white; border-color: #007bff; }
  .todo-item { display: flex; align-items: center; gap: 8px; padding: 12px; border-bottom: 1px solid #eee; }
  .todo-item:hover { background: #f8f9fa; }
  .done { text-decoration: line-through; color: #999; }
  .delete { padding: 4px 8px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; }
  .empty { text-align: center; color: #999; padding: 40px; }
  .footer { margin-top: 20px; padding-top: 16px; border-top: 1px solid #eee; }
  .stats { font-size: 14px; color: #666; }

handlers:
  addItem:
    if (newItem !== ""):
      set items = [...items, { id: Date.now(), text: newItem, done: false }]
      set newItem = ""
  
  toggleItem:
    set items = items.map(i => i.id === item.id ? { ...i, done: !i.done } : i)
  
  deleteItem:
    set items = items.filter(i => i.id !== item.id)
  
  showAll:
    set showCompleted = false
  
  showActive:
    set showCompleted = false
  
  showCompleted:
    set showCompleted = true
  
  clearCompleted:
    set items = items.filter(i => !i.done)
```

## Features Demonstrated

### 1. Arrays and Loops

```hjx
for (item in items):
  view.todo-item: "{{item.text}}"
```

### 2. Object State

```hjx
state:
  items = [{ id: 1, text: "Learn HJX", done: false }]
```

### 3. Conditional Rendering

```hjx
if (item.done):
  text.done: "(done)"
```

### 4. Multiple Handlers

- `addItem` - Add new todo
- `toggleItem` - Toggle done status
- `deleteItem` - Remove todo
- `clearCompleted` - Clear all done

### 5. Array Operations

```hjx
set items = [...items, newItem]           # Add
set items = items.filter(i => ...)        # Remove
set items = items.map(i => ...)           # Update
```

## Try It

```bash
node dist/cli.js dev examples/list.hjx --out dist-app --port 5173
```

Open http://localhost:5173

## Key Concepts

### Adding Items

```hjx
set items = [...items, { id: Date.now(), text: newItem, done: false }]
```

Uses spread operator to create new array.

### Toggling Items

```hjx
set items = items.map(i => i.id === item.id ? { ...i, done: !i.done } : i)
```

Maps over array, toggles matching item.

### Filtering

```hjx
set items = items.filter(i => i.id !== item.id)
```

Removes item by ID.
