# Control Flow

HJX supports conditional rendering and list rendering directly in the layout block.

## Conditional Rendering (`if`)

Show or hide elements based on state values:

```yaml
layout:
  if (isLoggedIn):
    text: "Welcome back!"

  if (!isLoggedIn):
    text: "Please log in."
```

### Supported Conditions

| Syntax | Description | Example |
|--------|-------------|---------|
| Variable | Truthy check | `if (isActive):` |
| Negation | Falsy check | `if (!isActive):` |
| Equality | Strict comparison | `if (status === "active"):` |
| Inequality | Not-equal check | `if (status != "pending"):` |

### Nesting

Conditional blocks can contain any layout nodes, including nested conditions:

```yaml
layout:
  if (isLoggedIn):
    view.dashboard:
      text: "Welcome, {{username}}"
      if (isAdmin):
        button (on click -> openAdmin): "Admin Panel"
```

## List Rendering (`for`)

Render a list of items from an array in state:

```yaml
state:
  items = ["Learn HJX", "Build a UI", "Deploy"]

layout:
  view.list:
    for (item in items):
      view.row:
        text: "• {{item}}"
```

### Loop Variable

The loop variable (e.g., `item`) is available for text interpolation inside the loop body. It can also be used in nested elements:

```yaml
for (task in tasks):
  view.task-card:
    text.name: "{{task}}"
    button (on click -> removeTask): "Remove"
```

### Dynamic Arrays

Arrays can be modified in handlers using spread syntax:

```yaml
state:
  items = []
  newItem = ""

handlers:
  addItem:
    set items = [...items, newItem]
    set newItem = ""
```

## Full Example

```yaml
component TodoList

state:
  items = ["Learn HJX", "Build a UI"]
  newItem = ""
  showCount = true

layout:
  view.container:
    text.title: "Todo List"

    if (showCount):
      text.count: "Tasks: {{items.length}}"

    view.input-row:
      input (bind value <-> newItem):
      button (on click -> addItem): "Add"

    for (item in items):
      view.item:
        text: "• {{item}}"

style:
  .container { padding: 20px; max-width: 400px; }
  .input-row { display: flex; gap: 8px; margin: 12px 0; }
  .item { padding: 8px 0; border-bottom: 1px solid #eee; }

handlers:
  addItem:
    set items = [...items, newItem]
    set newItem = ""
```

---

**Next:** [Components →](/guide/components)
