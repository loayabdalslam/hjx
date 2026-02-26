# Handlers Block

The `handlers:` block defines event handlers that respond to user interactions.

## Basic Syntax

```hjx
handlers:
  handlerName:
    # statements
```

## Statements

### Set Statement

Update state variables:

```hjx
handlers:
  increment:
    set count = count + 1
  
  setName:
    set name = "John"
  
  setMultiple:
    set count = 0
    set name = ""
```

### Log Statement

Output to console:

```hjx
handlers:
  debug:
    log "Button clicked!"
    log "Count is: " + count
```

## Supported Operators

### Arithmetic

```hjx
set count = count + 1      # Addition
set count = count - 1      # Subtraction
set count = count * 2      # Multiplication
set count = count / 2     # Division
set count = count % 10     # Modulo
```

### Comparison

```hjx
set result = count === 0   # Equal
set result = count !== 0   # Not equal
set result = count > 10    # Greater than
set result = count < 10    # Less than
set result = count >= 10   # Greater or equal
set result = count <= 10   # Less or equal
```

### Logical

```hjx
set result = !isActive           # Not
set result = isValid && isActive # And
set result = isValid || isActive # Or
```

### String

```hjx
set fullName = firstName + " " + lastName
set message = "Hello " + name + "!"
```

## Array Operations

### Spread

```hjx
handlers:
  add:
    set items = [...items, newItem]
  
  prepend:
    set items = [newItem, ...items]
```

### Filter

```hjx
handlers:
  remove:
    set items = items.filter(i => i !== target)
```

### Map

```hjx
handlers:
  update:
    set items = items.map(i => i.id === id ? newValue : i)
```

## Object Operations

### Spread

```hjx
handlers:
  updateUser:
    set user = { ...user, name: newName }
```

## Conditionals in Handlers

Simple conditionals using if:

```hjx
handlers:
  submit:
    if (email === ""):
      set error = "Email is required"
    else:
      set error = ""
      log "Submitting: " + email
```

## Event Binding Syntax

In the layout block, bind handlers with:

```hjx
layout:
  button (on click -> increment): "+"
  button (on click -> decrement): "-"
  input (on input -> handleInput):
  form (on submit -> handleSubmit):
```

## Complete Example

```hjx
component InteractiveDemo

state:
  count = 0
  name = ""
  items = ["apple", "banana"]
  user = { name: "John", age: 30 }
  message = ""

layout:
  view.container:
    view.section:
      text: "Counter: {{count}}"
      button (on click -> increment): "+"
      button (on click -> decrement): "-"
      button (on click -> reset): "Reset"
    
    view.section:
      input (bind value <-> name) placeholder="Enter name"
      text: "Hello {{name}}!"
    
    view.section:
      text: "Items: {{items.length}}"
      for (item in items):
        text: "• {{item}}"
      button (on click -> addItem): "Add Item"
      button (on click -> clearItems): "Clear"
    
    view.section:
      text: "Message: {{message}}"
      button (on click -> showMessage): "Show Message"

style:
  .container { padding: 20px; font-family: system-ui; }
  .section { margin-bottom: 24px; padding: 16px; border: 1px solid #ddd; border-radius: 8px; }
  button { margin: 4px; padding: 8px 16px; cursor: pointer; }
  input { padding: 8px; margin-right: 8px; }

handlers:
  increment:
    set count = count + 1
    log "Count: " + count
  
  decrement:
    if (count > 0):
      set count = count - 1
  
  reset:
    set count = 0
    log "Counter reset"
  
  addItem:
    set items = [...items, "item" + items.length]
  
  clearItems:
    set items = []
  
  showMessage:
    if (name === ""):
      set message = "Please enter a name first"
    else:
      set message = "Hello, " + name + "!"
```

## Best Practices

1. **Use descriptive names** - `handleSubmit` > `hs`
2. **Keep handlers focused** - One responsibility per handler
3. **Log for debugging** - Use `log` during development
4. **Validate input** - Check values before updating state
