---
sidebar_label: Quick Start
---

# Quick Start

Build your first HJX app in 5 minutes.

## Step 1: Create a Counter

Create a file called `counter.hjx`:

```hjx title="counter.hjx"
component Counter

state:
  count = 0

layout:
  view#root.card:
    text.title: "Count: {{count}}"
    view.buttons:
      button.primary (on click -> inc): "Increase"
      button.secondary (on click -> dec): "Decrease"
    button.ghost (on click -> reset): "Reset"

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

  .buttons:
    display flex
    gap 12px
    justify content center

  .primary:
    button primary

  .secondary:
    button secondary

  .ghost:
    button ghost

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
  reset:
    set count = 0
```

## Step 2: Build

```bash
node dist/cli.js build counter.hjx --out dist-app
```

This generates:
- `dist-app/index.html` — The HTML page
- `dist-app/app.css` — Scoped styles
- `dist-app/app.js` — Runtime + logic

## Step 3: Preview

Open `dist-app/index.html` in your browser. The counter works immediately — click Increase/Decrease/Reset.

## Or Use Flow-State

Skip the syntax entirely:

```bash
node dist/cli.js flow "create a counter component"
```

This generates the complete HJX code from natural English.

## Or Compile to React

```bash
node dist/cli.js build counter.hjx --out dist-app --target react
```

Generates `Counter.tsx` + `Counter.module.css`.

## Try Examples

The repository includes ready-to-use examples:

```bash
# Counter
node dist/cli.js build examples/counter.hjx --out dist-app

# Todo App with API
node dist/cli.js build examples/todo-app.hjx --out dist-app --target react --backend

# Dashboard with Natural Language CSS
node dist/cli.js build examples/dashboard_v2.hjx --out dist-app
```

## Next Steps

- [Syntax Guide](./syntax) — Learn the full HJX syntax
- [Flow-State Engine](./flow-state) — Write UI in English
- [Natural Language CSS](./nl-css) — Describe styles in words
