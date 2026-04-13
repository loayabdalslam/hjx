---
sidebar_label: Flow-State Engine
---

# Flow-State Engine

Write UI code in plain English. The Flow-State Engine translatess natural language descriptions directly into HJX code.

## How It Works

```
Natural English → Pattern Matching → Template Generation → HJX Code
```

## Basic Usage

### Create Components

```bash
hjx flow "create a counter component"
hjx flow "make a form with name and email fields"
hjx flow "build a todo list with add and delete"
```

### Add Features

```bash
hjx flow "add state called count"
hjx flow "add button called Submit"
hjx flow "make the card centered with a shadow"
```

### Compile Directly

```bash
hjx flow --compile "create a counter component"
```

This outputs HTML/CSS/JS ready to use.

## Built-in Patterns

| English Input | Generated Output |
|--------------|-----------------|
| `create a counter` | Full counter with increment/decrement/reset |
| `make a form` | Form with inputs, two-way binding, submit handler |
| `create a todo list` | Todo app with add/remove functionality |
| `add state called X` | `state: X = 0` |
| `add button called X` | `button.primary: "X"` with handler |
| `make X centered` | Flexbox centering CSS |

## Example: Counter

```bash
$ hjx flow "create a counter component"

✅ Intent: counter
📊 Confidence: 98.0%

component Counter

state:
  count = 0

layout:
  view#root.card:
    text.title: "Count: {{count}}"
    view.buttons:
      button.primary (on click -> inc): "Increase"
      button.secondary (on click -> dec): "Decrease"

style:
  .card:
    card
    text align center
    display flex
    flex direction column
    gap 24px

  .primary:
    button primary

  .secondary:
    button secondary

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
```

## Mixed Code + Language

Seamlessly blend natural English with HJX code:

```
create a dashboard component
state:
  users = 0
  revenue = 0

make the container centered with a card style
add a title that says "Analytics Dashboard"
add buttons for "View Reports" and "Export Data"
```

The engine detects which lines are code vs English and processes each appropriately.

## Custom Grammar

Edit `grammar.yml` to add your own patterns:

```yaml title="grammar.yml"
custom_rules:
  rules:
    - name: "weather-widget"
      patterns:
        - "make a weather widget"
        - "build weather display"
      template: |
        component WeatherWidget

        state:
          temperature = 72
          condition = "sunny"

        layout:
          view.card:
            text.temp: "{{temperature}}°F"
            text.condition: "{{condition}}"

        style:
          .card:
            card
```

Then use it:

```bash
hjx flow --grammar grammar.yml "make a weather widget"
```

## CLI Options

| Flag | Description |
|------|-------------|
| `--file, -f` | Read input from file |
| `--grammar, -g` | Load custom grammar file |
| `--out, -o` | Write output to file |
| `--compile, -c` | Compile to HTML/CSS/JS |
| `--watch, -w` | Watch for changes (file mode) |

## Confidence Scoring

The engine reports match confidence (0.0 - 1.0):

```
✅ Intent: counter
📊 Confidence: 98.0%
```

- **0.9+** — Excellent match, production-ready
- **0.8-0.9** — Good match, may need minor tweaks
- **0.6-0.8** — Decent match, review generated code
- **Below 0.6** — Try being more specific or check suggestions

## Performance

| Input | Match Time | Generation Time |
|-------|-----------|----------------|
| "create a counter" | < 1ms | < 5ms |
| "make a form" | < 1ms | < 5ms |
| Mixed code+English | < 2ms | < 10ms |
| Custom grammar | < 2ms | < 8ms |

## Next

- [Grammar System](./grammar-system) — Full control over language patterns
- [Natural Language CSS](./nl-css) — Describe styles in words
