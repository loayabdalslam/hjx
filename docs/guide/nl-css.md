# Natural Language CSS

Write styles using human-readable descriptions instead of raw CSS. The compiler translates your intent to proper CSS automatically.

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

HJX includes built-in style presets that expand to multiple CSS properties:

| Shortcut | Expands to |
|----------|-----------|
| `card` | padding, background, border-radius, box-shadow |
| `button primary` | padding, background, color, border, cursor, font-weight |
| `button secondary` | padding, background, color, border, cursor |
| `button ghost` | padding, background, color, border, cursor |
| `input field` | padding, border, font-size, width |
| `container` | max-width, margin, padding |
| `center` | display flex, justify-content, align-items |
| `flex col` | display flex, flex-direction column |
| `flex row` | display flex, flex-direction row |
| `grid 2` | display grid, 2 columns, gap |
| `grid 3` | display grid, 3 columns, gap |
| `grid 4` | display grid, 4 columns, gap |

## Property Syntax

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
| `margin auto` | `margin: auto;` |
| `border radius 12px` | `border-radius: 12px;` |
| `font size 24px` | `font-size: 24px;` |
| `font weight bold` | `font-weight: bold;` |
| `text align center` | `text-align: center;` |
| `display flex` | `display: flex;` |
| `justify content center` | `justify-content: center;` |
| `align items center` | `align-items: center;` |
| `gap 16px` | `gap: 16px;` |
| `box shadow light` | `box-shadow: 0 2px 8px rgba(0,0,0,0.1);` |
| `transition all 0.3s ease` | `transition: all 0.3s ease;` |

## Pseudo-Selectors

Support for `:hover`, `:active`, `:focus`, etc.:

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

Define responsive styles with simple media queries:

```hjx
breakpoints:
  mobile = 480px
  tablet = 768px
  desktop = 1024px

style:
  .container:
    padding 20px

  .container @mobile:
    padding 12px
    flex direction column

  .title @mobile:
    font size 24px
```

### Default Breakpoints

| Breakpoint | Query |
|---|---|
| `@mobile` | `max-width: 480px` |
| `@tablet` | `max-width: 768px` |
| `@desktop` | `min-width: 1024px` |

## Mixed Syntax

You can still use raw CSS if preferred:

```hjx
style:
  /* Raw CSS still works */
  .card {
    padding: 16px;
    border-radius: 12px;
  }

  /* Or natural language */
  .button:
    button primary
```

## Complete Example

```hjx
component Dashboard

state:
  users = 0

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
    color #1a1a1a
    text align center

  .stats-grid:
    grid 3

  .stat-card:
    card
    padding 24px
    text align center

  .label:
    font size 14px
    color #666

  .value:
    font size 32px
    font weight bold

breakpoints:
  mobile = 480px
  tablet = 768px

style:
  .stats-grid @tablet:
    grid 2

  .stats-grid @mobile:
    grid 1
```

## Next Steps

- Learn about [React Compilation](./react-compilation)
- Explore [REST API Integration](./api-integration)
- Check out [Flow-State Engine](./flow-state)
