# Examples

Learn HJX by exploring working examples. Each example demonstrates different features.

## Getting Started Examples

### [Counter](/examples/counter)
A simple counter with increment/decrement buttons.

**Concepts:** State, event handlers, text interpolation, styling

```hjx
component Counter

state:
  count = 0

layout:
  view: "Count: {{count}}"
  button (on click -> inc): "+"
  button (on click -> dec): "-"

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
```

### [Form](/examples/form)
Newsletter subscription form with two-way binding.

**Concepts:** Input binding, form handling, validation, state updates

### [Todo List](/examples/todo)
A full todo list with add, remove, and filter.

**Concepts:** Arrays, loops, conditionals, multiple handlers

### [Dashboard](/examples/dashboard)
Real-time server-driven dashboard.

**Concepts:** Server-driven mode, WebSocket, script block, computed values

### [Composition](/examples/composition)
Reusable components with props and slots.

**Concepts:** Imports, props, slots, component composition

---

## Running Examples

```bash
# Build an example
node dist/cli.js build examples/counter.hjx --out dist-app

# Run with dev server
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173
```

---

## More Examples

Check the `examples/` folder in the repository for more:

- `examples/counter.hjx` - Basic counter
- `examples/form.hjx` - Form with binding
- `examples/list.hjx` - List rendering
- `examples/conditional.hjx` - Conditional rendering
- `examples/dashboard.hjx` - Server-driven dashboard
- `examples/composition_demo.hjx` - Component composition
- `examples/components/` - Reusable component library
