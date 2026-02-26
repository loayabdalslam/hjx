# Styling

HJX provides scoped CSS styling for each component.

## The Style Block

Define styles in the `style:` block:

```hjx
style:
  .container {
    padding: 20px;
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
  }
```

## CSS Scoping

All styles are automatically scoped to prevent conflicts:

```hjx
component Card

style:
  .card { border: 1px solid #ddd; }
```

Compiles to:

```css
.hjx-card .card { border: 1px solid #ddd; }
```

## Selectors

### Class Selectors

```hjx
style:
  .button { padding: 10px; }
  .primary { background: blue; }
  .large { font-size: 18px; }
```

### ID Selectors

```hjx
style:
  #header { background: #333; }
```

### Element Selectors

```hjx
style:
  button { cursor: pointer; }
  input { border: 1px solid #ccc; }
```

### Multiple Classes

```hjx
style:
  .btn.primary { background: blue; }
  .btn.secondary { background: gray; }
```

## Pseudo-classes

```hjx
style:
  .button:hover {
    background: darkblue;
  }
  
  .input:focus {
    border-color: blue;
  }
```

## Responsive Design

```hjx
style:
  .container {
    width: 100%;
  }
  
  @media (min-width: 768px) {
    .container {
      width: 750px;
      margin: 0 auto;
    }
  }
```

## CSS Variables

```hjx
style:
  :root {
    --primary: #007bff;
    --secondary: #6c757d;
  }
  
  .button {
    background: var(--primary);
  }
```

## Animations

```hjx
style:
  .fade-in {
    animation: fadeIn 0.3s ease-in;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
```

## Flexbox Layout

```hjx
style:
  .container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
```

## Grid Layout

```hjx
style:
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
```

## Example

```hjx
component Card

state:
  title = "Welcome"

layout:
  view.card:
    text.title: "{{title}}"
    text.content: "This is card content"

style:
  .card {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
  }
  
  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .content {
    color: #666;
    line-height: 1.5;
  }
```
