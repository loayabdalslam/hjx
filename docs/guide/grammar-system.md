# Dynamic Grammar System

HJX v0.2 introduces a **fully customizable grammar system** that lets you control how natural language is translated into HJX code.

## Overview

The grammar system is defined in `grammar.yml` at the project root. You can edit this file to add, modify, or remove language patterns without touching any code.

{% raw %}
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
```
{% endraw %}

## Grammar File Structure

The `grammar.yml` file is organized into sections:

| Section | Purpose |
|---------|---------|
| `component_creation` | Rules for creating new components |
| `state_rules` | Rules for defining state variables |
| `layout_rules` | Rules for adding layout elements |
| `style_rules` | Rules for applying styles |
| `handler_rules` | Rules for creating event handlers |
| `api_rules` | Rules for defining API endpoints |
| `conditional_rules` | Rules for conditional rendering |
| `loop_rules` | Rules for list rendering |
| `custom_rules` | **Your custom rules** |

## Pattern Syntax

Patterns use simple capture groups. Reference them with double-brace syntax:

{% raw %}
```yaml
patterns:
  - "create a {{1}} component"
  - "add state {{1}} with {{2}}"
  - "make {{1}} {{2}}"
```
{% endraw %}

### Filters

| Filter | Description |
|--------|-------------|
| `capitalize` | Capitalize first letter |
| `lowercase` | Convert to lowercase |
| `nospace` | Remove all spaces |
| `camelcase` | Convert to camelCase |

## Template Syntax

Templates generate HJX code. Use capture references:

{% raw %}
```yaml
template: |
  component {{1|capitalize}}
  state:
    {{2}} = 0
  layout:
    view.container:
      text.title: "{{1}}"
```
{% endraw %}

## Using Custom Grammar

### 1. Edit grammar.yml

Add your rules under `custom_rules:`:

{% raw %}
```yaml
custom_rules:
  rules:
    - name: "weather-widget"
      patterns:
        - "make a weather widget"
      template: |
        component WeatherWidget
        state:
          temperature = 72
        layout:
          view.card:
            text.temp: "{{temperature}}F"
        style:
          .card:
            card
```
{% endraw %}

### 2. Test with Flow CLI

```bash
hjx flow --grammar grammar.yml "make a weather widget"
```

## Built-in Patterns Reference

### Component Creation

| Pattern | Output |
|---------|--------|
| `create a [name] component` | Empty component scaffold |

### State

| Pattern | Output |
|---------|--------|
| `add state [name]` | `state: [name] = 0` |
| `add state [name] as text` | `state: [name] = ""` |

### Layout

| Pattern | Output |
|---------|--------|
| `add button [label]` | `button.primary: "[label]"` |
| `add input bound to [var]` | `input.field (bind value <-> [var]):` |

### Style

| Pattern | Output |
|---------|--------|
| `center [element]` | Flexbox centering |
| `make [element] a card` | Card preset |

## Advanced: Overriding Built-in Rules

You can override built-in patterns by adding them to `custom_rules`:

{% raw %}
```yaml
custom_rules:
  rules:
    - name: "counter-custom"
      patterns:
        - "create counter"
      template: |
        component Counter
        state:
          count = 0
          step = 1
        layout:
          view.card:
            text: "Count: {{count}}"
            button (on click -> inc): "+{{step}}"
        handlers:
          inc:
            set count = count + step
```
{% endraw %}

## Next Steps

- Learn about the [Flow-State Engine](./flow-state)
- Explore [Natural Language CSS](./nl-css)
- Check out [React Compilation](./react-compilation)
