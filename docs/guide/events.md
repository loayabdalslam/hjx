# Event Handling

Learn how to handle user interactions in HJX.

## Basic Event Binding

Attach event handlers using the `(on <event> -> <handler>)` syntax:

```hjx
layout:
  button (on click -> handleClick): "Click Me"
```

Supported events include:
- `click` - Mouse click
- `input` - Input value change
- `change` - Input blur after change
- `submit` - Form submission
- `keydown` - Keyboard press
- `keyup` - Keyboard release
- `focus` - Element gains focus
- `blur` - Element loses focus
- `mouseenter` - Mouse enters element
- `mouseleave` - Mouse leaves element

## Handler Definition

Define handlers in the `handlers:` block:

```hjx
handlers:
  handleClick:
    set count = count + 1
    log "Button clicked!"
```

## Multiple Handlers

```hjx
layout:
  button (on click -> increment): "+"
  button (on click -> decrement): "-"
  button (on click -> reset): "Reset"

handlers:
  increment:
    set count = count + 1
  decrement:
    set count = count - 1
  reset:
    set count = 0
```

## Form Events

### Input Binding

Two-way binding keeps state in sync with input:

```hjx
layout:
  input (bind value <-> name)
  text: "Hello {{name}}!"
```

The `bind value <-> stateVar` syntax:
- Updates state when input changes
- Updates input when state changes

### Form Submission

```hjx
layout:
  form (on submit -> handleSubmit):
    input (bind value <-> email)
    button type="submit": "Submit"

handlers:
  handleSubmit:
    log "Submitted: " + email
```

Prevent default form submission by returning false in your handler (handled automatically).

## Keyboard Events

```hjx
layout:
  input (on keydown -> handleKey):
    text (on keyup -> handleKeyUp):

handlers:
  handleKey:
    log "Key down!"
  handleKeyUp:
    log "Key up!"
```

## Accessing Event Data

```hjx
handlers:
  handleClick:
    # Simple counter
    set count = count + 1
    
  handleInput:
    # Input value is automatically synced via binding
    set message = "You typed: " + inputValue
    
  handleKey:
    # Access key directly
    if (key === "Enter"):
      log "Enter pressed!"
```

## Event Modifiers

Currently supported inline:
- `(on click -> handler)` - Basic click
- `(on click.stop -> handler)` - Stop propagation (future)
- `(on click.prevent -> handler)` - Prevent default (future)

## Complete Example

```hjx
component InteractiveForm

state:
  name = ""
  email = ""
  submitted = false
  clicks = 0

layout:
  view.container:
    text.title: "Event Demo"
    
    view.section:
      text: "Click count: {{clicks}}"
      button (on click -> increment): "Click Me"
      button (on click -> reset): "Reset"
    
    view.section:
      text: "Two-way binding:"
      input.name-input (bind value <-> name) placeholder="Enter name"
      text: "Hello {{name}}!"
    
    view.section:
      text: "Form:"
      input.email-input (bind value <-> email) placeholder="Enter email"
      button (on click -> submit): "Submit"
      if (submitted):
        text.success: "Submitted!"

style:
  .container { padding: 20px; font-family: system-ui; }
  .section { margin-bottom: 20px; padding: 16px; border: 1px solid #ddd; border-radius: 8px; }
  .title { font-size: 24px; font-weight: bold; margin-bottom: 16px; }
  .success { color: green; font-weight: bold; }
  input { padding: 8px; margin-right: 8px; border: 1px solid #ccc; border-radius: 4px; }
  button { padding: 8px 16px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px; }

handlers:
  increment:
    set clicks = clicks + 1
  reset:
    set clicks = 0
  submit:
    set submitted = true
    log "Form submitted with email: " + email
```

## Best Practices

1. **Use descriptive handler names** - `handleSubmit` > `hs` > `f1`
2. **Keep handlers focused** - One action per handler
3. **Leverage two-way binding** - Use `bind value` for forms
4. **Log for debugging** - Use `log` statements during development

## Next Steps

- [State Management](/guide/state) - Reactive state
- [Styling](/guide/styling) - Make it look good
- [Control Flow](/language/conditionals) - Conditionals and loops
