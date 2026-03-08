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

While HJX doesn't have computed properties, you can compute values in handlers:

```hjx
state:
  a = 10
  b = 5
  sum = 0

handlers:
  calculate:
    set sum = a + b
```

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
