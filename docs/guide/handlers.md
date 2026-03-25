# Handlers

Handlers define the behavior and logic of your component. They respond to user events and update state.

## Defining Handlers

```hjx
handlers:
  handleClick:
    set count = count + 1
  
  handleInput:
    log "Input changed"
```

## Attaching Handlers

Bind handlers to events in the layout:

```hjx
layout:
  button (on click -> handleClick): "Click me"
  input (on input -> handleInput)
  form (on submit -> handleSubmit):
```

## Available Events

- `on click` - Mouse click
- `on input` - Input value change
- `on submit` - Form submission
- `on change` - Select/checkbox change
- `on mouseover` - Mouse hover
- `on mouseout` - Mouse leave
- `on keydown` - Keyboard press
- `on keyup` - Keyboard release

## Handler Statements

### Set Statement

Update state values:

```hjx
handlers:
  increment:
    set count = count + 1
  
  setName:
    set name = "New Name"
  
  toggle:
    set isActive = !isActive
```

### Log Statement

Debug with console.log:

```hjx
handlers:
  debug:
    log "Button clicked"
    log "Count is: {{count}}"
```

### Conditionals

Use if/else inside handlers:

```hjx
handlers:
  checkValue:
    if (count > 10):
      log "Count is large"
      set count = 0
    
    if (count <= 10):
      log "Count is small"
```

## Expressions

### Arithmetic

```hjx
set result = a + b
set result = a - b
set result = a * b
set result = a / b
```

### Comparison

```hjx
if (a > b):
if (a < b):
if (a >= b):
if (a <= b):
if (a == b):
if (a != b):
```

### Logical

```hjx
if (a && b):
if (a || b):
if (!a):
```

### String Operations

```hjx
set greeting = "Hello " + name
```

## Event Context

Handlers receive an event context with:

- `event` - The DOM event
- `el` - The target element
- `store` - The state store

```hjx
handlers:
  handleClick:
    log event.type
    log el.id
```

## Complete Example

```hjx
component TodoApp

state:
  todos = []
  inputText = ""

layout:
  view.app:
    input (bind value -> inputText)
    button (on click -> addTodo): "Add"
    for (todo in todos):
      view.todo: "{{todo}}"

handlers:
  addTodo:
    if (inputText != ""):
      set todos = todos + [inputText]
      set inputText = ""
      log "Added: {{inputText}}"
    
    if (inputText == ""):
      log "Please enter text"
```

## Best Practices

1. Keep handlers simple and focused
2. Use descriptive handler names
3. Add logging for debugging
4. Validate input before updating state
5. Handle edge cases (empty input, etc.)
