# Flow-State Engine

The **Flow-State Engine** allows you to write UI code in natural English, or seamlessly mix English with HJX code.

## Quick Start

```bash
# Generate HJX from natural language
hjx flow "create a counter component"

# Use custom grammar
hjx flow --grammar my-rules.yml "make a weather widget"

# Compile directly to HTML/CSS/JS
hjx flow --compile "create a form with name and email"
```

## How It Works

The Flow-State Engine uses pattern matching to translate natural English descriptions into complete HJX code. It supports:

1. **Pure Natural Language** — Write entirely in English
2. **Mixed Code + Language** — Blend English with HJX syntax
3. **Custom Grammar** — Define your own patterns via `grammar.yml`

## Pure Natural Language

Describe what you want in plain English:

```bash
$ hjx flow "create a counter component"
```

Generates:

```hjx
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

  .title:
    font size 32px
    font weight bold
    color #333

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

## Built-in Patterns

| Pattern | Example Command | Output |
|---------|----------------|--------|
| Counter | `create a counter` | Full counter with state + handlers |
| Form | `make a form` | Form with inputs, bindings, submit |
| Todo List | `create a todo list` | Todo app with add/remove |
| State | `add state called count` | `state: count = 0` |
| Button | `add button called Submit` | `button.primary: "Submit"` |
| Style | `make the card centered` | Natural language CSS |

## Mixed Code + Language

Seamlessly blend natural English with HJX code:

```:
create a dashboard component
state:
  users = 0
  revenue = 0

make the container centered with a card style
add a title that says "Analytics Dashboard"
add buttons for "View Reports" and "Export Data"
```

The engine automatically detects which lines are code and which are English, processing each appropriately.

## Custom Grammar

Take full control of the language by editing `grammar.yml`:

```yaml
custom_rules:
  rules:
    - name: "my-widget"
      patterns:
        - "make a {{1}} widget"
        - "build {{1}} component"
      template: |
        component {{1|capitalize}}Widget

        state:
          value = 0

        layout:
          view.card:
            text: "{{1}}"

        style:
          .card:
            card

        handlers:
```

### Pattern Syntax

- `{{1}}` — Capture group from the pattern
- `{{1|capitalize}}` — Apply filter to captured text
- `{{1|lowercase}}` — Convert to lowercase
- `{{1|nospace}}` — Remove spaces
- `{{1|camelcase}}` — Convert to camelCase

### Using Custom Grammar

```bash
hjx flow --grammar my-rules.yml "make a weather widget"
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

The engine reports match confidence (0-1):

```
✅ Intent: counter
📊 Confidence: 98.0%
```

Higher confidence means better pattern match. If confidence is low, try being more specific or check the suggestions.

## Next Steps

- Learn about [Natural Language CSS](./nl-css)
- Explore the [Grammar System](./grammar-system)
- Check out [React Compilation](./react-compilation)
