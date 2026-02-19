# Form Example

A form component showing input binding and dynamic updates.

## Code

```hjx
component SimpleForm

state:
  email = ""
  msg = "Type your email"

layout:
  view.card:
    text.title: "Newsletter"
    input.field (bind value <-> email)
    text.hint: "You typed: {{email}}"
    button.primary (on click -> submit): "Submit"
    text.note: "{{msg}}"

style:
  .card { padding: 16px; border: 1px solid #ddd; border-radius: 12px; display: flex; flex-direction: column; gap: 10px; width: 320px; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; }
  .title { font-size: 18px; font-weight: 700; }
  .field { padding: 10px 12px; border-radius: 10px; border: 1px solid #ddd; }
  .primary { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 0; }
  .hint { font-size: 13px; opacity: .8; }
  .note { font-size: 13px; }

handlers:
  submit:
    log "submitted"
    set msg = "Submitted ✅"
```

## Features Demonstrated

- **Two-way Binding**: `bind value <-> email` connects input to state
- **Dynamic Text**: Real-time updates with `{{email}}`
- **Event Handling**: Submit button with handler
- **State Updates**: Changing `msg` on submit

## Try It

```bash
node dist/cli.js dev examples/form.hjx --out dist-app --port 5173
```