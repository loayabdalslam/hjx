# Style Block

The `style:` block defines CSS that is automatically scoped to the component.

## Basic Syntax

```hjx
style:
  .class-name { property: value; }
```

## Automatic Scoping

Styles are scoped using data attributes:

```hjx
component Card

layout:
  view.card: "Content"

style:
  .card { padding: 16px; }
```

Compiles to:

```css
.card[data-hjx-scope="card-abc123"] {
  padding: 16px;
}
```

## Selectors

### Class Selectors

```hjx
style:
  .button { padding: 10px; }
  .card.container { padding: 20px; }
```

### ID Selectors

```hjx
style:
  #main { min-height: 100vh; }
```

### Element Selectors

```hjx
style:
  view { display: block; }
  text { color: #333; }
```

### Attribute Selectors

```hjx
style:
  [disabled] { opacity: 0.5; }
```

## Pseudo-classes

```hjx
style:
  .button:hover { background: #0056b3; }
  .button:active { transform: scale(0.98); }
  input:focus { border-color: #007bff; }
  .link:visited { color: purple; }
```

## Pseudo-elements

```hjx
style:
  .clearfix::after { content: ""; clear: both; display: table; }
  .first-letter::first-letter { font-size: 2em; }
```

## Media Queries

```hjx
style:
  .container { width: 100%; }
  
  @media (min-width: 768px) {
    .container { width: 750px; margin: 0 auto; }
  }
  
  @media (max-width: 480px) {
    .container { padding: 10px; }
  }
```

## Keyframes

```hjx
style:
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .fade-in { animation: fadeIn 0.3s ease; }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
```

## CSS Variables

```hjx
style:
  :root {
    --primary: #007bff;
    --secondary: #6c757d;
    --spacing: 8px;
  }
  
  .button {
    background: var(--primary);
    padding: var(--spacing);
  }
```

## Nesting

Standard CSS doesn't support nesting. Use flat selectors:

```hjx
style:
  .parent { }
  .parent .child { }
  .parent > .direct-child { }
```

## Complete Example

```hjx
component StyledCard

state:
  isActive = false

layout:
  view.card (on click -> toggle):
    view.header: "Card Title"
    view.content: "Click to {{isActive ? 'close' : 'open'}}"

style:
  .card {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
  }
  .card:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    cursor: pointer;
  }
  .card.active {
    border-color: #007bff;
  }
  .header {
    padding: 16px;
    border-bottom: 1px solid #e0e0e0;
    font-weight: 600;
    font-size: 18px;
    background: #f8f9fa;
  }
  .content {
    padding: 16px;
    color: #555;
    line-height: 1.6;
  }

handlers:
  toggle:
    set isActive = !isActive
```

## Tailwind-like Classes

HJX supports using Tailwind-style class names in layout:

```hjx
layout:
  view.flex.flex-col.gap-4.p-4.bg-white:
    text.text-xl.font-bold: "Title"
```

These are passed through as-is to the HTML class attribute.

## Best Practices

1. **Use scoped styles** - Avoid global styles
2. **Use meaningful names** - `.card` > `.c1`
3. **Keep specificity low** - Avoid deeply nested selectors
4. **Use CSS variables** - For theming and reuse
