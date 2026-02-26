# Loops

Loops allow you to render repeated elements based on arrays.

## Basic Syntax

```hjx
layout:
  for (item in items):
    view: "{{item}}"
```

## Array Loops

### Simple Array

```hjx
state:
  items = ["apple", "banana", "cherry"]

layout:
  for (item in items):
    text: "• {{item}}"
```

### With Index

```hjx
for (item in items):
  text: "{{index + 1}}. {{item}}"
```

## Object Loops

Loop through object keys:

```hjx
state:
  user = { name: "John", age: 30, city: "NYC" }

layout:
  for (key in Object.keys(user)):
    text: "{{key}}: {{user[key]}}"
```

## Nested Loops

```hjx
layout:
  for (category in categories):
    view.category:
      text: "{{category.name}}"
      for (item in category.items):
        text.item: "• {{item}}"
```

## Complete Example

```hjx
component TodoList

state:
  todos = [
    { id: 1, text: "Learn HJX", done: true },
    { id: 2, text: "Build an app", done: false },
    { id: 3, text: "Deploy to production", done: false }
  ]
  newTodo = ""
  filter = "all"

layout:
  view.container:
    view.header:
      text.title: "My Todo List"
      text.count: "{{todoCount}} tasks"
    
    view.input-section:
      input (bind value <-> newTodo) placeholder="Add new task"
      button (on click -> addTodo): "Add"
    
    view.filters:
      button (on click -> setFilter): "All"
      button (on click -> setFilterActive): "Active"
      button (on click -> setFilterDone): "Done"
    
    view.list:
      for (todo in filteredTodos):
        view.todo-item:
          checkbox (on click -> toggleTodo): ""
          text: "{{todo.text}}"
          if (todo.done):
            text.done: "(done)"
          button (on click -> deleteTodo): "X"
    
    if (todos.length === 0):
      view.empty: "No todos yet!"

style:
  .container { max-width: 500px; margin: 0 auto; padding: 20px; font-family: system-ui; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .title { font-size: 24px; font-weight: bold; }
  .input-section { display: flex; gap: 8px; margin-bottom: 16px; }
  .filters { display: flex; gap: 8px; margin-bottom: 16px; }
  .todo-item { display: flex; align-items: center; gap: 8px; padding: 8px; border-bottom: 1px solid #eee; }
  .done { text-decoration: line-through; color: #999; }
  .empty { text-align: center; color: #999; padding: 20px; }
  input { flex: 1; padding: 8px; }
  button { padding: 8px 12px; cursor: pointer; }

handlers:
  addTodo:
    if (newTodo !== ""):
      set todos = [...todos, { id: Date.now(), text: newTodo, done: false }]
      set newTodo = ""
  
  toggleTodo:
    set todos = todos.map(t => t.id === todo.id ? { ...t, done: !t.done } : t)
  
  deleteTodo:
    set todos = todos.filter(t => t.id !== todo.id)
  
  setFilter:
    set filter = "all"
  
  setFilterActive:
    set filter = "active"
  
  setFilterDone:
    set filter = "done"
```

Note: The `filteredTodos` would need to be computed in the script block for server-driven mode, or you can use inline filtering:

```hjx
layout:
  for (todo in todos):
    if ((filter === "all") || (filter === "active" && !todo.done) || (filter === "done" && todo.done)):
      view.item: "{{todo.text}}"
```

## Keyed Rendering

HJX uses array index as key by default. For better performance with dynamic lists, consider using unique IDs.

## Performance Tips

1. **Use unique keys** - Prefer `id` over index
2. **Filter before rendering** - Use computed values
3. **Limit list size** - Paginate large lists

## Loops with Conditionals

```hjx
layout:
  for (item in items):
    if (item.visible):
      view: "{{item.name}}"
```

## Best Practices

1. **Keep loops simple** - Avoid complex logic in loop body
2. **Use meaningful variable names** - `todo` > `t` > `i`
3. **Consider pagination** - For large datasets
