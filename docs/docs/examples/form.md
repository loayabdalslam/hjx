# Forms Example

Demonstrates input binding, form handling, and validation.

## Source Code

```hjx
component FormDemo

state:
  name = ""
  email = ""
  age = 0
  errors = {}
  submitted = false

layout:
  view.form-container:
    if (!submitted):
      view.form:
        text.label: "Name"
        input.name-input (bind value -> name)
        
        text.label: "Email"
        input.email-input (bind value -> email)
        
        text.label: "Age"
        input.age-input (bind value -> age)
        
        button.submit (on click -> submit): "Submit"
    
    if (submitted):
      view.success:
        text: "Thank you, {{name}}!"
        text: "Email: {{email}}"
        text: "Age: {{age}}"
        button.back (on click -> reset): "Submit Another"

style:
  .form-container { max-width: 400px; margin: 40px auto; font-family: system-ui; }
  .form { display: flex; flex-direction: column; gap: 16px; }
  .label { font-weight: 600; margin-bottom: 4px; }
  input { padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; }
  .submit, .back { padding: 12px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; }
  .success { padding: 20px; background: #d4edda; border-radius: 8px; }

handlers:
  submit:
    set errors = {}
    if (name == ""):
      set errors = { nameError: "Name is required" }
    if (email == ""):
      set errors = { emailError: "Email is required" }
    if (name != "" && email != ""):
      set submitted = true
  
  reset:
    set submitted = false
    set name = ""
    set email = ""
    set age = 0
```

## Key Concepts

- **Two-way binding**: `(bind value -> variable)` connects input to state
- **Conditional form**: Show form or success message based on state
- **Validation**: Check values in handler before updating state

## How It Works

1. Input fields are bound to state variables
2. Typing in an input updates the bound state
3. Clicking submit triggers validation
4. If valid, shows success message
5. Reset clears form and state

## Running

```bash
node dist/cli.js dev examples/form.hjx --out dist-app --port 5172
```
