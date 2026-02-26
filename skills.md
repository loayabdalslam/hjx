# HJX Language Skills

## Overview

HJX is a compiled UI language that unifies structure, style, and logic into a single `.hjx` file. It compiles to clean, dependency-free HTML + CSS + JavaScript.

## Core Skills

### 1. Component Creation

**Skill:** Create complete HJX components from scratch

**Capabilities:**
- Define component with `component <Name>` syntax
- Initialize reactive state with types: number, string, boolean, arrays, objects
- Build UI layout tree with view, text, button, input, if, for nodes
- Write scoped CSS styles
- Implement event handlers with reactive statements

**Example:**
```hjx
component TodoApp
state:
  todos = []
  newTodo = ""
  filter = "all"

layout:
  view.container:
    text.title: "My Todos"
    input (bind value <-> newTodo):
    button (on click -> addTodo): "Add"
    for (todo in todos):
      view.todo-item:
        text: "{{todo.text}}"

style:
  .container { padding: 20px; }
  .title { font-size: 24px; }

handlers:
  addTodo:
    set todos = [...todos, {text: newTodo, done: false}]
    set newTodo = ""
```

### 2. Reactive State Management

**Skill:** Manage reactive state with proper initialization and updates

**Capabilities:**
- Primitive types: `count = 0`, `name = "John"`, `active = true`
- Arrays: `items = ["a", "b", "c"]`
- Objects: `user = {name: "John", age: 30}`
- Nested updates: `set user.name = "Jane"`
- Array operations: spread syntax for adding/removing items

**Example:**
```hjx
state:
  counter = 0
  items = []
  user = {name: "", email: ""}

handlers:
  increment:
    set counter = counter + 1
  
  addItem:
    set items = [...items, "new item"]
  
  removeItem:
    set items = items.slice(1)
```

### 3. Conditional Rendering

**Skill:** Implement conditional UI with if/else logic

**Capabilities:**
- Simple condition: `if (isLoggedIn):`
- Negation: `if (!isPremium):`
- Equality: `if (status === "active"):`
- Inequality: `if (count != 0):`
- Complex conditions with &&, ||

**Example:**
```hjx
layout:
  if (isLoggedIn):
    view.dashboard:
      text: "Welcome {{username}}"
  else:
    view.login-prompt:
      text: "Please login"
  
  if (isLoading):
    view.spinner:
      text: "Loading..."
  
  if (errorMsg):
    view.error:
      text: "{{errorMsg}}"
```

### 4. List Rendering

**Skill:** Render lists with for loops

**Capabilities:**
- Iterate arrays: `for (item in items):`
- Access index: `for (item, index- Use in items):`
 loop variable in interpolation: `{{item.name}}`
- Nested loops

**Example:**
```hjx
state:
  products = [
    {name: "Apple", price: 1.50},
    {name: "Banana", price: 0.75}
  ]

layout:
  for (product in products):
    view.product-card:
      text: "{{product.name}} - ${{product.price}}"
      button (on click -> buy): "Buy"
```

### 5. Form Handling

**Skill:** Build forms with two-way data binding

**Capabilities:**
- Input binding: `input (bind value <-> fieldName)`
- Textarea support
- Select dropdowns
- Form validation states
- Submit handlers

**Example:**
```hjx
state:
  email = ""
  password = ""
  isSubmitting = false

layout:
  view.form:
    input.email (bind value <-> email):
    input.password (bind value <-> password):
    button (on click -> submit): "Submit"
  
  if (isSubmitting):
    text: "Submitting..."

handlers:
  submit:
    set isSubmitting = true
    log "Form submitted: " + email
```

### 6. Event Handling

**Skill:** Implement click, input, and custom events

**Capabilities:**
- Click handlers: `button (on click -> handlerName):`
- Input handlers: `input (on input -> handlerName):`
- Handler body with set, log statements
- Multiple handlers per component

**Example:**
```hjx
handlers:
  handleClick:
    set count = count + 1
    log "Clicked! Count is now: " + count
  
  handleInput:
    log "Input changed"
  
  handleSubmit:
    if (email === ""):
      set error = "Email required"
    else:
      set submitted = true
```

### 7. Styling

**Skill:** Write scoped CSS with component-level isolation

**Capabilities:**
- Class selectors: `.className { }`
- ID selectors: `#id { }`
- Element selectors: `view { }`, `button { }`
- Pseudo-classes: `:hover`, `:focus`
- Flexbox, Grid layouts
- Responsive media queries in style block

**Example:**
```hjx
style:
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 16px;
    margin-bottom: 12px;
  }
  .btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  .btn:hover {
    background: #0056b3;
  }
```

### 8. CSS Class Management

**Skill:** Handle complex CSS class names including Tailwind

**Capabilities:**
- Multiple classes: `.class1.class2`
- Classes with special chars: `.md:flex`, `.hover:bg-blue`
- Dynamic classes via interpolation (future)
- Tailwind utility classes

**Example:**
```hjx
layout:
  view.container.md:flex.flex-col:
    view.card.bg-white.rounded-lg:
      text: "Tailwind classes work!"
```

### 9. Component Composition

**Skill:** Compose multiple components and manage data flow

**Capabilities:**
- Multiple components in one file (future)
- Shared state via parent-child
- Event bubbling
- Component patterns

**Example:**
```hjx
component App
state:
  sharedValue = 0

layout:
  view.app:
    text: "Shared: {{sharedValue}}"
    button (on click -> inc): "Increment"

component ChildComponent
state:
  localValue = 0

layout:
  view.child:
    text: "Local: {{localValue}}"
```

### 10. Advanced Patterns

**Skill:** Implement complex UI patterns

**Capabilities:**
- Modal/dialog
- Tabs
- Accordion
- Dropdown menus
- Drag and drop (future)
- Real-time updates

**Example - Modal:**
```hjx
state:
  showModal = false

layout:
  button (on click -> openModal): "Open Modal"
  
  if (showModal):
    view.modal-overlay:
      view.modal-content:
        text: "Modal Content"
        button (on click -> closeModal): "Close"

handlers:
  openModal:
    set showModal = true
  closeModal:
    set showModal = false
```

**Example - Tabs:**
```hjx
state:
  activeTab = "home"

layout:
  view.tabs:
    button.tab (on click -> setTab("home")): "Home"
    button.tab (on click -> setTab("about")): "About"
  
  if (activeTab === "home"):
    view.tab-content:
      text: "Home content"
  
  if (activeTab === "about"):
    view.tab-content:
      text: "About content"

handlers:
  setTab:
    set activeTab = tabName
```

## Compilation Targets

### Vanilla (Client-side)

- Pure HTML/CSS/JS output
- No dependencies
- Full reactivity with custom runtime
- Fast initial load

### Server-Driven (Real-time)

- WebSocket-based state sync
- Server evaluates conditions/loops
- Real-time updates without client logic
- Great for collaborative apps

## Best Practices

1. **Keep state minimal** - Only store what's needed for UI
2. **Use descriptive names** - `newTodo` not `n`, `isLoading` not `l`
3. **Style scoped** - Classes won't leak to other components
4. **Handle errors** - Always show error states
5. **Loading states** - Show feedback during async operations
6. **Mobile-first** - Design responsive from start

## Common Patterns

### Loading + Error + Content
```hjx
layout:
  if (isLoading):
    text: "Loading..."
  else if (error):
    text: "Error: {{error}}"
  else:
    view.content:
      text: "{{data}}"
```

### Empty State
```hjx
layout:
  if (items.length === 0):
    view.empty-state:
      text: "No items yet"
  else:
    for (item in items):
      view.item:
        text: "{{item}}"
```

### Toggle
```hjx
state:
  isOn = false

layout:
  button (on click -> toggle): "{{isOn ? 'ON' : 'OFF'}}"

handlers:
  toggle:
    set isOn = !isOn
```

### Counter
```hjx
state:
  count = 0

layout:
  text: "{{count}}"
  button (on click -> inc): "+"
  button (on click -> dec): "-"

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
```

### Form with Validation
```hjx
state:
  email = ""
  emailError = ""

layout:
  input (bind value <-> email):
  if (emailError):
    text.error: "{{emailError}}"

handlers:
  validate:
    if (email === ""):
      set emailError = "Email required"
    else if (email.indexOf("@") === -1):
      set emailError = "Invalid email"
    else:
      set emailError = ""
```
