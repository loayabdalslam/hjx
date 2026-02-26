# State Management

State is the heart of HJX's reactivity system. This guide covers everything you need to know about managing state.

## Basic State

Define state using the `state:` block:

```hjx
state:
  count = 0
  name = "World"
  isActive = true
```

## Supported Types

HJX supports several data types:

### Numbers

```hjx
state:
  count = 42
  price = 19.99
  negative = -10
```

### Strings

```hjx
state:
  name = "John"
  message = 'Hello world'
  empty = ""
```

### Booleans

```hjx
state:
  isEnabled = true
  isComplete = false
```

### Arrays

```hjx
state:
  items = ["apple", "banana", "cherry"]
  numbers = [1, 2, 3, 4, 5]
  mixed = [1, "two", true]
```

### Objects

```hjx
state:
  user = { name: "John", age: 30 }
  config = { theme: "dark", lang: "en" }
```

## Reactive Updates

When state changes, the UI updates automatically:

```hjx
component Demo

state:
  count = 0

layout:
  view:
    text: "Count: {{count}}"
    button (on click -> increment): "Add One"

handlers:
  increment:
    set count = count + 1
```

Try clicking the button - the text updates instantly.

## Array Operations

### Adding Items

```hjx
handlers:
  add:
    set items = [...items, newItem]
```

### Removing Items

```hjx
handlers:
  remove:
    set items = items.filter(i => i !== target)
```

### Updating Items

```hjx
handlers:
  update:
    set items = items.map(i => i.id === id ? newValue : i)
```

## Object Updates

```hjx
handlers:
  updateUser:
    set user = { ...user, name: newName }
```

## Computed Values

There's no special computed syntax, but you can use helper functions:

```hjx
component TodoList

state:
  items = ["Learn HJX", "Build something"]
  filter = "all"

layout:
  view:
    text: "Total: {{items.length}}"
    text: "Filtered: {{filteredCount}}"

script:
  export function init(store) {
    store.compute('filteredCount', () => {
      const items = store.get('items');
      const filter = store.get('filter');
      if (filter === 'all') return items.length;
      return items.filter(i => i.done).length;
    });
  }
```

## State in Server-Driven Mode

In server-driven mode, state lives on the server:

```hjx
component Dashboard

state:
  users = []
  cpu = 0

script:
  export function init(store) {
    setInterval(() => {
      store.set({
        cpu: Math.random() * 100,
        users: fetchUsers()
      });
    }, 1000);
  }

layout:
  view:
    text: "CPU: {{cpu}}%"
    for (user in users):
      text: "{{user.name}}"
```

The server pushes updates to all connected clients automatically.

## Best Practices

1. **Keep state minimal** - Only store what you need for rendering
2. **Use meaningful names** - `items` > `arr`, `isLoading` > `loading`
3. **Group related state** - Use objects for related data
4. **Avoid deeply nested state** - Keep it flat when possible

## Next Steps

- [Event Handling](/guide/events) - Respond to user actions
- [Control Flow](/language/conditionals) - Conditionals and loops
- [Server-Driven Mode](/guide/server-driven) - Real-time updates
