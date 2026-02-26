# Form Example

A newsletter subscription form demonstrating two-way binding, form handling, and validation.

## The Code

```hjx
component SimpleForm

state:
  email = ""
  msg = "Enter your email address"
  submitted = false

layout:
  view.card:
    text.title: "Newsletter"
    input.field (bind value <-> email) placeholder="your@email.com"
    text.hint: "You typed: {{email}}"
    if (submitted):
      text.success: "✅ {{msg}}"
    else:
      text.note: "{{msg}}"
    button.primary (on click -> submit): "Submit"
    if (submitted):
      button.secondary (on click -> reset): "Reset"

style:
  .card { 
    padding: 24px; 
    border: 1px solid #e0e0e0; 
    border-radius: 12px; 
    font-family: system-ui, sans-serif; 
    max-width: 360px;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .title { font-size: 20px; font-weight: 600; margin-bottom: 16px; }
  .field { 
    width: 100%; 
    padding: 12px; 
    border: 1px solid #ddd; 
    border-radius: 8px; 
    font-size: 14px;
    box-sizing: border-box;
    margin-bottom: 12px;
  }
  .field:focus { outline: none; border-color: #007bff; }
  .hint { font-size: 12px; color: #666; margin-bottom: 12px; }
  .note { font-size: 14px; color: #666; margin-bottom: 12px; }
  .success { font-size: 14px; color: #28a745; font-weight: 500; margin-bottom: 12px; }
  .primary { 
    width: 100%; 
    padding: 12px; 
    background: #007bff; 
    color: white; 
    border: none; 
    border-radius: 8px; 
    cursor: pointer; 
    font-weight: 500;
  }
  .primary:hover { background: #0056b3; }
  .secondary { 
    width: 100%; 
    padding: 12px; 
    background: #6c757d; 
    color: white; 
    border: none; 
    border-radius: 8px; 
    cursor: pointer; 
    font-weight: 500;
    margin-top: 8px;
  }

handlers:
  submit:
    if (email === ""):
      set msg = "Please enter an email address"
    else:
      set msg = "Thank you for subscribing!"
      set submitted = true
  reset:
    set email = ""
    set msg = "Enter your email address"
    set submitted = false
```

## Features Demonstrated

### 1. Two-Way Binding

```hjx
input (bind value <-> email)
```

The input and state stay in sync automatically.

### 2. Conditional Rendering

```hjx
if (submitted):
  text.success: "✅ {{msg}}"
else:
  text.note: "{{msg}}"
```

Different content based on state.

### 3. Text Interpolation

```hjx
text.hint: "You typed: {{email}}"
```

Dynamic text based on state.

### 4. State Validation

```hjx
handlers:
  submit:
    if (email === ""):
      set msg = "Please enter an email address"
```

Validate before submitting.

## How It Works

1. **Type in input**: `email` state updates automatically
2. **Text updates**: "You typed: {{email}}" shows your input
3. **Click Submit**: 
   - Empty check → show error
   - Valid → show success message
4. **Click Reset**: Clear form and state

## Try It

```bash
node dist/cli.js dev examples/form.hjx --out dist-app --port 5173
```

Open http://localhost:5173

## Variations

### With Email Validation

```hjx
handlers:
  submit:
    if (email === ""):
      set msg = "Email is required"
    else if (email.indexOf("@") === -1):
      set msg = "Please enter a valid email"
    else:
      set msg = "Thank you!"
      set submitted = true
```

### Multiple Fields

```hjx
state:
  name = ""
  email = ""
  newsletter = true
```

### Auto-Submit

```hjx
layout:
  input (bind value <-> email) (on keydown -> checkEnter):
```

```hjx
handlers:
  checkEnter:
    if (key === "Enter"):
      submit()
```
