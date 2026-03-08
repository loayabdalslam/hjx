# Composition Example

Demonstrates component composition - using multiple components together.

## Source Code

### Main App

```hjx
component App

imports:
  Card from "./components/Card.hjx"
  Button from "./components/Button.hjx"
  Input from "./components/Input.hjx"

state:
  cards = [
    { title: "Card 1", content: "This is the first card" },
    { title: "Card 2", content: "This is the second card" },
    { title: "Card 3", content: "This is the third card" }
  ]

layout:
  view.app:
    text.header: "Component Composition Demo"
    view.controls:
      Button label="Add Card" variant="primary"
      Button label="Clear All" variant="secondary"
    
    view.card-grid:
      for (card in cards):
        Card title="{{card.title}}" content="{{card.content}}"

style:
  .app { max-width: 900px; margin: 0 auto; padding: 20px; font-family: system-ui; }
  .header { font-size: 28px; font-weight: bold; margin-bottom: 20px; }
  .controls { display: flex; gap: 10px; margin-bottom: 30px; }
  .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }

handlers:
  addCard:
    set cards = cards + [{ title: "New Card", content: "New content" }]
  
  clearAll:
    set cards = []
```

### Card Component

```hjx
component Card

state:
  title = "Card Title"
  content = "Card content"

layout:
  div.card:
    div.header: "{{title}}"
    div.body: "{{content}}"

style:
  .card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
  .header { padding: 12px 16px; background: #f5f5f5; font-weight: bold; }
  .body { padding: 16px; }
```

### Button Component

```hjx
component Button

state:
  label = "Button"
  variant = "primary"

layout:
  button.btn (class variant):
    text: "{{label}}"

style:
  .btn { padding: 10px 20px; border-radius: 6px; cursor: pointer; border: none; }
  .primary { background: #007bff; color: white; }
  .secondary { background: #6c757d; color: white; }
```

## Key Concepts

- **Imports**: Import other `.hjx` files as components
- **Props**: Pass data using attributes
- **Composition**: Build complex UIs from simple components

## How It Works

1. Import components at the top
2. Use imported components as tags in layout
3. Pass data as attributes
4. Components are self-contained and reusable

## Running

```bash
node dist/cli.js dev examples/composition_demo.hjx --out dist-app --port 5172
```

## Benefits of Composition

- **Reusability**: Write once, use many times
- **Separation of concerns**: Each component does one thing
- **Maintainability**: Small, focused files are easier to maintain
- **Teamwork**: Different people can work on different components
