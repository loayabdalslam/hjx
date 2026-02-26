# Conditionals

Conditionals allow you to show or hide elements based on state.

## Basic Syntax

```hjx
layout:
  if (condition):
    view: "This shows when true"
```

## Supported Conditions

### Boolean

```hjx
if (isVisible):
  view: "Visible"

if (!isHidden):
  view: "Not hidden"
```

### Comparison

```hjx
if (count > 0):
  view: "Has items"

if (name === "John"):
  view: "Hello John"

if (age >= 18):
  view: "Adult"
```

### Multiple Conditions

```hjx
if (isActive && count > 0):
  view: "Active with items"

if (isValid || isAdmin):
  view: "Can access"
```

## If-Else

Use multiple if blocks for else:

```hjx
if (isLoggedIn):
  text: "Welcome!"
  
if (!isLoggedIn):
  text: "Please log in"
```

Or use ternary in text:

```hjx
text: "{{isLoggedIn ? 'Welcome!' : 'Please log in'}}"
```

## Complete Example

```hjx
component ConditionalDemo

state:
  isLoggedIn = false
  count = 0
  role = "user"
  items = []

layout:
  view.container:
    # Boolean condition
    if (isLoggedIn):
      view.welcome: "Welcome back!"
    
    # Negation
    if (!isLoggedIn):
      view.please-login: "Please log in"
    
    # Comparison
    if (count > 0):
      view: "Count: {{count}}"
    
    if (count === 0):
      view: "No items"
    
    # Multiple conditions
    if (isLoggedIn && role === "admin"):
      view.admin-panel: "Admin Panel"
    
    if (role === "user" || role === "admin"):
      view.user-panel: "User Panel"
    
    # Toggle button
    button (on click -> toggleLogin): "{{isLoggedIn ? 'Logout' : 'Login'}}"
    button (on click -> increment): "Add Item"
    button (on click -> decrement): "Remove Item"

style:
  .container { padding: 20px; font-family: system-ui; }
  .welcome { color: green; font-weight: bold; }
  .please-login { color: #666; }
  .admin-panel { background: #fff3cd; padding: 12px; border-radius: 4px; }
  .user-panel { background: #d4edda; padding: 12px; border-radius: 4px; }

handlers:
  toggleLogin:
    set isLoggedIn = !isLoggedIn
  
  increment:
    set count = count + 1
  
  decrement:
    if (count > 0):
      set count = count - 1
```

## Nested Conditionals

```hjx
layout:
  if (isLoggedIn):
    if (role === "admin"):
      view: "Admin content"
    else:
      view: "User content"
  
  if (!isLoggedIn):
    view: "Please log in"
```

## Complete with Else-If Pattern

```hjx
layout:
  if (status === "loading"):
    text: "Loading..."
  
  if (status === "error"):
    text: "Error occurred"
  
  if (status === "success"):
    text: "Success!"
  
  if (status === "idle"):
    text: "Ready"
```

## Best Practices

1. **Keep conditions simple** - Complex logic in handlers
2. **Use early returns** - Check edge cases first
3. **Consider ternary** - For simple text changes

## Supported Operators

| Operator | Description |
|----------|-------------|
| `===` | Strict equality |
| `!==` | Strict inequality |
| `>` | Greater than |
| `<` | Less than |
| `>=` | Greater or equal |
| `<=` | Less or equal |
| `!` | Not |
| `&&` | And |
| `||` | Or |
