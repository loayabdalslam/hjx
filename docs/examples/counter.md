# Counter Example

A simple counter demonstrating core HJX features: state, event handlers, and text interpolation.

## The Code

```hjx
component Counter

state:
  count = 0

layout:
  view#root.card:
    text.title: "Count: {{count}}"
    button.primary (on click -> inc): "Increase"
    button.ghost (on click -> dec): "Decrease"
    button.danger (on click -> reset): "Reset"

style:
  .card { 
    padding: 16px; 
    border: 1px solid #ddd; 
    border-radius: 12px; 
    display: inline-flex; 
    flex-direction: column; 
    gap: 12px; 
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; 
    min-width: 200px;
  }
  .title { font-size: 24px; font-weight: 600; text-align: center; }
  .primary { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 0; background: #007bff; color: white; }
  .primary:hover { background: #0056b3; }
  .ghost { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 1px solid #ddd; background: transparent; }
  .ghost:hover { background: #f8f9fa; }
  .danger { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 0; background: #dc3545; color: white; }
  .danger:hover { background: #c82333; }
  button { font-size: 14px; font-weight: 500; transition: all 0.2s; }

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
  reset:
    set count = 0
```

## Features Demonstrated

### 1. State Declaration
```hjx
state:
  count = 0
```
Defines a reactive variable that triggers UI updates when changed.

### 2. Text Interpolation
```hjx
text.title: "Count: {{count}}"
```
The `{{count}}` syntax inserts the state value into the text.

### 3. Event Binding
```hjx
button (on click -> inc): "Increase"
```
Binds the click event to the `inc` handler.

### 4. Handler Logic
```hjx
handlers:
  inc:
    set count = count + 1
```
Updates the state, which automatically updates the UI.

### 5. Scoped Styling
```hjx
style:
  .card { ... }
```
CSS is scoped to prevent conflicts with other components.

## How It Works

1. **Initial render**: `count` is 0, displays "Count: 0"
2. **Click "+"**: Handler runs, sets `count = 1`, UI updates
3. **Click "-"**: Handler runs, sets `count = 0`, UI updates
4. **Click "Reset"**: Handler runs, sets `count = 0`, UI updates

## Try It

```bash
# Build
node dist/cli.js build examples/counter.hjx --out dist-app

# Run dev server
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173
```

Open http://localhost:5173

## Variations

### With Validation

```hjx
handlers:
  dec:
    if (count > 0):
      set count = count - 1
```

### With Steps

```hjx
state:
  count = 0
  step = 1

handlers:
  inc:
    set count = count + step
```

### With Min/Max

```hjx
handlers:
  inc:
    if (count < 100):
      set count = count + 1
  dec:
    if (count > 0):
      set count = count - 1
```
