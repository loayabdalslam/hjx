# Styling

HJX provides powerful CSS scoping and several convenience features for styling your components.

## Basic Syntax

Define styles in the `style:` block:

```hjx
style:
  .card { padding: 16px; border: 1px solid #ddd; }
  .title { font-size: 24px; font-weight: bold; }
```

## CSS Scoping

Styles are automatically scoped to your component using data attributes:

```hjx
component MyComponent

layout:
  view.card: "Hello"

style:
  .card { color: red; }
```

Compiles to:

```html
<div class="card" data-hjx-scope="mycomponent-abc123">
  Hello
</div>
```

```css
.card[data-hjx-scope="mycomponent-abc123"] {
  color: red;
}
```

This prevents style conflicts between components.

## Class Syntax

HJX supports Tailwind-like class syntax with colons:

```hjx
layout:
  view.flex.flex-col.gap-4.p-4:
    text: "Hello"
```

This adds classes `flex`, `flex-col`, `gap-4`, and `p-4`.

### Supported Special Characters

- `.` - Class separator
- `:` - CSS-like notation (converted to `-`)
- `#` - ID (e.g., `view#main`)
- `[` `]` - Attribute selectors (future)

## ID and Classes in Layout

```hjx
layout:
  view#main.container.centered:
    text#title: "Hello"
    button.primary.large:
      "Click me"
```

Renders:

```html
<div id="main" class="container centered">
  <span id="title">Hello</span>
  <button class="primary large">Click me</button>
</div>
```

## Style Block Features

### Multiple Properties

```hjx
style:
  .card {
    padding: 16px;
    margin: 8px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
  }
```

### Pseudo-classes

```hjx
style:
  .button:hover { background: #0056b3; }
  .button:active { transform: scale(0.98); }
  input:focus { border-color: #007bff; outline: none; }
```

### Media Queries

```hjx
style:
  .container { width: 100%; }
  @media (min-width: 768px) {
    .container { width: 750px; margin: 0 auto; }
  }
```

### Keyframes

```hjx
style:
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .fade-in { animation: fadeIn 0.3s ease; }
```

## Complete Example

```hjx
component StyledCard

state:
  isExpanded = false

layout:
  view.card (on click -> toggle):
    view.header:
      text.title: "Card Title"
      text.icon: "{{isExpanded ? '▼' : '▶'}}"
    if (isExpanded):
      view.content:
        text: "This is the expanded content."

style:
  .card {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: box-shadow 0.2s;
  }
  .card:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: #f8f9fa;
    cursor: pointer;
  }
  .title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  .icon {
    font-size: 12px;
    color: #666;
  }
  .content {
    padding: 16px;
    border-top: 1px solid #e0e0e0;
    color: #555;
    line-height: 1.6;
  }

handlers:
  toggle:
    set isExpanded = !isExpanded
```

## Best Practices

1. **Use semantic class names** - `.card` > `.c1`
2. **Scope styles to component** - Don't rely on global styles
3. **Use CSS variables** - For theming
4. **Keep it simple** - Avoid deep nesting

## Next Steps

- [Component Composition](/guide/components) - Reusable components
- [Server-Driven Mode](/guide/server-driven) - Real-time updates
- [Production Build](/guide/production) - Deploy your app
