# Bindings

Bindings keep HTML elements in sync with state variables.

## Value Binding

Two-way binding between input and state:

```hjx
layout:
  input (bind value <-> name)
```

When the user types:
1. State `name` updates
2. Text showing `{{name}}` updates

When state changes:
1. Input value updates
2. User sees the new value

## Supported Elements

### Input

```hjx
input (bind value <-> name)
input (bind value <-> email) placeholder="Email"
input (bind value <-> password) type="password"
input (bind value <-> search) placeholder="Search..."
```

### Textarea

```hjx
textarea (bind value <-> message):
```

### Select

```hjx
select (bind value <-> country):
  option: "USA"
  option: "UK"
  option: "Germany"
```

## Binding Syntax

```hjx
bind value <-> stateVariable
```

- `stateVariable` - The state variable to bind to
- `value` - The element's value property
- `<->` - Bidirectional sync

## Complete Example

```hjx
component FormDemo

state:
  firstName = ""
  lastName = ""
  email = ""
  country = "USA"
  bio = ""
  subscribed = false
  message = ""

layout:
  view.container:
    view.form:
      view.field:
        text.label: "First Name"
        input (bind value <-> firstName) placeholder="Enter first name"
      
      view.field:
        text.label: "Last Name"
        input (bind value <-> lastName) placeholder="Enter last name"
      
      view.field:
        text.label: "Email"
        input (bind value <-> email) type="email" placeholder="Enter email"
      
      view.field:
        text.label: "Country"
        select (bind value <-> country):
          option: "USA"
          option: "UK"
          option: "Canada"
          option: "Germany"
      
      view.field:
        text.label: "Bio"
        textarea (bind value <-> bio) placeholder="Tell us about yourself":
      
      view.field:
        checkbox (bind value <-> subscribed):
        text: "Subscribe to newsletter"
      
      view.actions:
        button.submit (on click -> submit): "Submit"
        button.clear (on click -> clear): "Clear"
    
    view.preview:
      text.title: "Preview"
      text: "Name: {{firstName}} {{lastName}}"
      text: "Email: {{email}}"
      text: "Country: {{country}}"
      text: "Bio: {{bio}}"
      text: "Subscribed: {{subscribed ? 'Yes' : 'No'}}"
      
      if (message !== ""):
        text.message: "{{message}}"

style:
  .container { max-width: 800px; margin: 0 auto; padding: 20px; font-family: system-ui; }
  .form, .preview { flex: 1; padding: 20px; }
  .field { margin-bottom: 16px; }
  .label { display: block; margin-bottom: 4px; font-weight: 500; }
  input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
  textarea { min-height: 80px; }
  .actions { display: flex; gap: 8px; margin-top: 16px; }
  button { padding: 10px 20px; cursor: pointer; border: none; border-radius: 4px; }
  .submit { background: #007bff; color: white; }
  .clear { background: #6c757d; color: white; }
  .preview { background: #f8f9fa; border-radius: 8px; }
  .title { font-size: 18px; font-weight: bold; margin-bottom: 12px; }
  .message { margin-top: 16px; padding: 12px; background: #d4edda; border-radius: 4px; color: #155724; }

handlers:
  submit:
    if (firstName === ""):
      set message = "Please enter first name"
    else if (email === ""):
      set message = "Please enter email"
    else:
      set message = "Form submitted! Hello, " + firstName + "!"
  
  clear:
    set firstName = ""
    set lastName = ""
    set email = ""
    set country = "USA"
    set bio = ""
    set subscribed = false
    set message = ""
```

## Binding vs Event Handlers

| Feature | Binding | Handler |
|---------|---------|---------|
| Auto sync | Yes | No |
| Use case | Forms | Actions |
| Syntax | `(bind value <-> var)` | `(on click -> handler)` |

## Combining Bindings and Handlers

```hjx
layout:
  input (bind value <-> search) (on input -> search):
  button (on click -> clearSearch): "Clear"
```

## Best Practices

1. **Use bindings for forms** - Keeps data in sync
2. **Use handlers for actions** - Click, submit, etc.
3. **Validate on submit** - Don't over-validate on input
4. **Reset properly** - Clear form after submission
