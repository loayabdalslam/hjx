---
sidebar_label: Natural Language CSS
---

# Natural Language CSS

Write styles using human-readable descriptions instead of raw CSS.

## Why Natural Language CSS?

Traditional CSS requires memorizing properties, values, and syntax. With Natural Language CSS, you write what you mean:

```hjx
style:
  .card:
    card
    text align center
    display flex
    flex direction column
    gap 24px
```

## Shortcuts & Presets

| Shortcut | Expands To |
|----------|-----------|
| `card` | padding: 16px, background: white, border-radius: 12px, box-shadow |
| `button primary` | padding, blue background, white text, no border, cursor |
| `button secondary` | padding, white background, gray border, cursor |
| `button ghost` | padding, transparent background, blue text |
| `input field` | padding, border, font-size, full width |
| `container` | max-width: 1200px, margin: auto, padding |
| `center` | display: flex, justify-content: center, align-items: center |
| `grid 2` | display: grid, 2 columns, gap |
| `grid 3` | display: grid, 3 columns, gap |
| `grid 4` | display: grid, 4 columns, gap |

## Property Descriptions

Write properties in natural language:

```hjx
style:
  .container:
    padding 20px
    margin auto
    max width 1200px

  .title:
    font size 32px
    font weight bold
    color #333

  .button:
    padding 10px 16px
    background #007bff
    color white
    border none
    border radius 8px
    cursor pointer
```

### Common Properties

| Natural Language | Generated CSS |
|---|---|
| `padding 16px` | `padding: 16px;` |
| `font size 24px` | `font-size: 24px;` |
| `display flex` | `display: flex;` |
| `justify content center` | `justify-content: center;` |
| `box shadow light` | `box-shadow: 0 2px 8px rgba(0,0,0,0.1);` |
| `transition all 0.3s ease` | `transition: all 0.3s ease;` |

## Pseudo-Selectors

```hjx
style:
  .button:
    button primary

  .button:hover:
    background #0056b3
    box shadow medium
    transition all 0.2s ease

  .button:active:
    transform scale 0.98

  .button:focus:
    outline 2px solid #007bff
    outline offset 2px
```

## Media Queries

```hjx
breakpoints:
  mobile = 480px
  tablet = 768px

style:
  .container @mobile:
    padding 12px
    flex direction column

  .title @mobile:
    font size 24px
```

## Complete Dashboard Example

```hjx
component Dashboard

state:
  users = 1234

layout:
  view.container:
    text.title: "Dashboard"
    view.stats-grid:
      view.stat-card:
        text.label: "Users"
        text.value: "{{users}}"

style:
  .container:
    container
    display flex
    flex direction column
    gap 20px

  .title:
    font size 28px
    font weight bold
    text align center

  .stats-grid:
    grid 3

  .stat-card:
    card
    padding 24px
    text align center
```

## Mixed Syntax

You can still use raw CSS if preferred:

```hjx
style:
  .card {
    padding: 16px;
    border-radius: 12px;
  }

  .button:
    button primary
```

## Next

- [React Compilation](./react-compilation) — Generate React components
- [REST API Integration](./api-integration) — Define API endpoints
