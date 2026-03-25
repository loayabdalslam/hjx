# State Management

HJX has built-in reactive state management. State changes automatically trigger UI updates.

## Defining State

```hjx
state:
  count = 0
  name = "World"
  isActive = true
  items = ["a", "b", "c"]
```

## Using State in Layout

Reference state variables in text:

```hjx
layout:
  text: "Hello {{name}}"
  text: "Count: {{count}}"
```

## Updating State

Use handlers to update state:

```hjx
handlers:
  increment:
    set count = count + 1
  
  decrement:
    set count = count - 1
  
  reset:
    set count = 0
  
  setName:
    set name = "New Name"
```

## State Reactivity

When state changes, the UI updates automatically:

```hjx
component Counter

state:
  count = 0

layout:
  view:
    text: "Count: {{count}}"
    button (on click -> increment): "+"
    button (on click -> decrement): "-"

handlers:
  increment:
    set count = count + 1
  
  decrement:
    set count = count - 1
```

## Computed Values

Computed values are derived state that automatically update when dependencies change. See [Computed Values](./computed-values.md) for the complete guide.

```hjx
state:
  price = 25
  quantity = 3

computed:
  total = "price * quantity"
  formattedTotal = "'$' + total"

layout:
  text: "Total: {{formattedTotal}}"
```

Computed values support:
- **Automatic updates** when dependencies change
- **Chaining** (computed values can depend on other computed values)
- **Expressions** (math, string operations, array methods)
- **Memoization** (only recalculates when needed)

## State with Arrays

```hjx
state:
  todos = ["Buy milk", "Walk dog"]

handlers:
  addTodo:
    set todos = todos + ["New task"]
  
  clearTodos:
    set todos = []
```

## State with Objects

```hjx
state:
  user = { name: "Alice", age: 30 }

handlers:
  birthday:
    set user = { name: user.name, age: user.age + 1 }
```

## Two-Way Binding

For input elements, use two-way binding:

```hjx
layout:
  input (bind value -> username)
  text: "Hello {{username}}"
```

This automatically:
- Displays the state value in the input
- Updates state when the input changes

## Conditional Rendering

Use state to conditionally show/hide elements:

```hjx
state:
  isLoggedIn = false

layout:
  if (isLoggedIn):
    view.dashboard: "Welcome!"
  
  if (!isLoggedIn):
    view.login: "Please log in"
```

## List Rendering

Use state arrays with `for`:

```hjx
state:
  items = ["Apple", "Banana", "Cherry"]

layout:
  for (item in items):
    view.item: "{{item}}"
```
