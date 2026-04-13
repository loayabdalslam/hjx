---
sidebar_label: Grammar System
---

# Dynamic Grammar System

Edit `grammar.yml` to customize how natural language translates to HJX.

## Pattern Syntax

```yaml
custom_rules:
  rules:
    - name: "my-widget"
      patterns:
        - "make a {{1}} widget"
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

## Filters

| Filter | Description |
|--------|-------------|
| `capitalize` | Capitalize first letter |
| `lowercase` | Convert to lowercase |
| `nospace` | Remove spaces |
| `camelcase` | Convert to camelCase |

## Usage

```bash
hjx flow --grammar grammar.yml "make a weather widget"
```

See [Flow-State Engine](./flow-state) for more examples.
