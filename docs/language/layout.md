# Layout Block

The `layout:` block defines the UI structure using indentation-based syntax.

## Overview

Layout uses **whitespace indentation** to define the DOM hierarchy:

```hjx
layout:
  parent:
    child1: "Content"
    child2: "More content"
```

Compiles to:

```html
<div>
  <span>Content</span>
  <span>More content</span>
</div>
```

## Elements

### View (div)

Generic container element:

```hjx
view: "Content"
view.card: "With class"
view#main: "With ID"
view.card.primary: "Multiple classes"
```

### Text (span)

Inline text element:

```hjx
text: "Hello World"
text.title: "With class"
```

### Button

```hjx
button: "Click Me"
button.primary: "Styled button"
```

### Input

```hjx
input: ""
input (placeholder="Enter text"):
input (bind value <-> name):
```

### Form

```hjx
form (on submit -> handleSubmit):
  input:
  button: "Submit"
```

## Attributes

### ID and Classes

```hjx
view#main.container.centered:
  text#title.heading: "Title"
```

Renders:

```html
<div id="main" class="container centered">
  <span id="title" class="heading">Title</span>
</div>
```

### Event Binding

```hjx
button (on click -> handler): "Click"
input (on input -> handler):
form (on submit -> handler):
```

### Value Binding

```hjx
input (bind value <-> name):
```

### Placeholder

```hjx
input (placeholder="Enter name"):
```

### Type

```hjx
input (type="password"):
input (type="email"):
button (type="submit"):
```

## Text Interpolation

Use `{{variable}}` for dynamic text:

```hjx
text: "Hello {{name}}"
text: "Count: {{count}}"
text: "{{firstName}} {{lastName}}"
```

## Indentation Rules

- Use **consistent indentation** (2 or 4 spaces)
- Children must be indented more than parents
- Empty elements use a trailing colon:

```hjx
layout:
  view:
    text: "Has content"
    view: ""  # Empty element
```

## Complete Example

```hjx
component Demo

state:
  name = "World"
  items = ["A", "B", "C"]
  show = true

layout:
  view#app.container:
    view.header:
      text.title: "My App"
      text.subtitle: "Welcome, {{name}}!"
    
    view.content:
      if (show):
        view.card:
          text: "This is visible"
          for (item in items):
            text.item: "• {{item}}"
      else:
        text.hidden: "Hidden content"
    
    view.footer:
      button.primary (on click -> toggle): "Toggle"
      input (bind value <-> name) placeholder="Your name"

style:
  .container { max-width: 800px; margin: 0 auto; padding: 20px; }
  .header { margin-bottom: 20px; }
  .title { font-size: 24px; font-weight: bold; }
  .content { min-height: 200px; }
  .card { padding: 16px; border: 1px solid #ddd; border-radius: 8px; }
  .footer { margin-top: 20px; display: flex; gap: 12px; }

handlers:
  toggle:
    set show = !show
```

## Supported Elements

| Element | HTML Tag | Description |
|---------|----------|-------------|
| `view` | `<div>` | Block container |
| `text` | `<span>` | Inline text |
| `button` | `<button>` | Button |
| `input` | `<input>` | Input field |
| `form` | `<form>` | Form |
| `a` | `<a>` | Link |
| `img` | `<img>` | Image |
| `ul` | `<ul>` | Unordered list |
| `ol` | `<ol>` | Ordered list |
| `li` | `<li>` | List item |
| `p` | `<p>` | Paragraph |
| `h1`-`h6` | `<h1>`-`<h6>` | Headings |
