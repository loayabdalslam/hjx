# HJX Spec v0.2

> **New in v0.2:** Natural language CSS syntax, React compilation target, REST API integration

## File structure
A `.hjx` file contains blocks in this order (order is flexible but recommended):
1. `component <Name>`
2. `imports:`
3. `state:`
4. `api:` (NEW — REST API endpoints)
5. `layout:`
6. `style:` (NEW — natural language syntax)
7. `handlers:`
8. `script:`

Blocks are indentation-sensitive (2 spaces recommended).

---

## component
Syntax:
`component <Identifier>`

Example:
`component Counter`

---

## imports
Import other `.hjx` components or React components.

```
imports:
  Button from "./components/Button.hjx"
  Card from "./components/Card.hjx"
  ReactComponent from "./MyReactComponent.jsx"
```

---

## state
Defines reactive variables (component-local).

```
state:
  name = 0
  title = "Hello"
  enabled = true
  items = ["todo1", "todo2"]
  user = { name: "John", age: 30 }
```

Types supported: number, string, boolean, arrays, objects.

---

## api (NEW)
Define REST API endpoints that the component can call. The compiler generates both client-side fetch calls and optional server-side Express.js routes.

### Syntax

```
api:
  <METHOD> <endpoint> -> <handlerName>
```

### Example

```
api:
  GET /api/todos -> fetchTodos
  POST /api/todos -> createTodo
  PUT /api/todos/:id -> updateTodo
  DELETE /api/todos/:id -> deleteTodo
```

### Usage in handlers

API calls are invoked in handlers using `fetch`:

```
handlers:
  loadData:
    fetch fetchTodos -> todos
    set items = todos

  addItem:
    fetch createTodo with { text: newItem } -> result
    set items = [...items, result]
    set newItem = ""
```

### With request body

```
  fetch createTodo with { title: "New task", priority: "high" } -> result
```

### With query params

```
  fetch fetchTodos with { page: 1, limit: 10 } -> data
```

### Auto-generated server routes (optional)

When building with `--backend` flag, the compiler generates Express.js routes:

```typescript
// Generated: dist/server/routes/todos.js
import { Router } from 'express';
const router = Router();

router.get('/api/todos', async (req, res) => {
  // User-defined handler logic
});

router.post('/api/todos', async (req, res) => {
  // User-defined handler logic
});

export default router;
```

### Full API block syntax

For advanced use, define request/response schemas:

```
api:
  GET /api/todos -> fetchTodos:
    query:
      page = 1
      limit = 10
    response:
      type = array
      item = { id: number, text: string, done: boolean }

  POST /api/todos/:id -> updateTodo:
    params:
      id = number
    body:
      text = string
      done = boolean
    response:
      type = object
      schema = { id: number, text: string, done: boolean }
```

---

## layout
Defines a tree of nodes with optional control flow.

Supported node kinds: `view`, `text`, `button`, `input`, `if`, `for`

### Container node (can have children)
`view#id.class1.class2:`

### Leaf node with inline string
`text: "Hello {{name}}"`

### Button with handler
`button.primary (on click -> inc): "Increase"`

### Input with binding
`input (bind value <-> email)`

### Conditional block
```
if (condition):
  view.optional:
    text: "Shows if condition is true"
```

Supported conditions:
- Variable: `if (isLoggedIn):`
- Negation: `if (!isPremium):`
- Equality: `if (status === "active"):`
- Inequality: `if (status != "pending"):`

### Loop block
```
for (item in items):
  view.row:
    text: "{{item}}"
```

### React component in layout (NEW)

Imported React components can be used in layout:

```
layout:
  MyReactComponent (prop=value on click -> handler):
    text: "Slot content"
```

---

## style (NEW — Natural Language Syntax)

Write styles using human-readable descriptions instead of raw CSS. The compiler translates natural language to proper CSS automatically.

### Basic syntax

```
style:
  .selector:
    property description
```

### Property descriptions (natural language → CSS mapping)

| Natural Language | Generated CSS |
|---|---|
| `padding 16px` | `padding: 16px;` |
| `padding 10px 20px` | `padding: 10px 20px;` |
| `margin auto` | `margin: auto;` |
| `border 1px solid #ddd` | `border: 1px solid #ddd;` |
| `border radius 12px` | `border-radius: 12px;` |
| `border none` | `border: none;` |
| `background white` | `background: white;` |
| `background #007bff` | `background: #007bff;` |
| `background linear gradient top to bottom white gray` | `background: linear-gradient(to bottom, white, gray);` |
| `color #333` | `color: #333;` |
| `color white` | `color: white;` |
| `font size 24px` | `font-size: 24px;` |
| `font size 1.5rem` | `font-size: 1.5rem;` |
| `font weight bold` | `font-weight: bold;` |
| `font weight 600` | `font-weight: 600;` |
| `font family sans serif` | `font-family: sans-serif;` |
| `text align center` | `text-align: center;` |
| `text align left` | `text-align: left;` |
| `text align right` | `text-align: right;` |
| `text decoration none` | `text-decoration: none;` |
| `text decoration underline` | `text-decoration: underline;` |
| `text transform uppercase` | `text-transform: uppercase;` |
| `line height 1.5` | `line-height: 1.5;` |
| `letter spacing 1px` | `letter-spacing: 1px;` |
| `width 100%` | `width: 100%;` |
| `width 400px` | `width: 400px;` |
| `max width 800px` | `max-width: 800px;` |
| `min height 100vh` | `min-height: 100vh;` |
| `height 50px` | `height: 50px;` |
| `display flex` | `display: flex;` |
| `display grid` | `display: grid;` |
| `display block` | `display: block;` |
| `display inline block` | `display: inline-block;` |
| `display none` | `display: none;` |
| `flex direction column` | `flex-direction: column;` |
| `flex direction row` | `flex-direction: row;` |
| `flex wrap wrap` | `flex-wrap: wrap;` |
| `justify content center` | `justify-content: center;` |
| `justify content space between` | `justify-content: space-between;` |
| `align items center` | `align-items: center;` |
| `gap 16px` | `gap: 16px;` |
| `gap 10px 20px` | `gap: 10px 20px;` |
| `grid template columns 1fr 1fr 1fr` | `grid-template-columns: 1fr 1fr 1fr;` |
| `grid template columns repeat 3 1fr` | `grid-template-columns: repeat(3, 1fr);` |
| `box shadow light` | `box-shadow: 0 2px 8px rgba(0,0,0,0.1);` |
| `box shadow medium` | `box-shadow: 0 4px 12px rgba(0,0,0,0.15);` |
| `box shadow heavy` | `box-shadow: 0 8px 24px rgba(0,0,0,0.2);` |
| `box shadow none` | `box-shadow: none;` |
| `border radius 12px` | `border-radius: 12px;` |
| `rounded` | `border-radius: 9999px;` (pill shape) |
| `rounded full` | `border-radius: 50%;` (circle) |
| `cursor pointer` | `cursor: pointer;` |
| `overflow hidden` | `overflow: hidden;` |
| `overflow auto` | `overflow: auto;` |
| `overflow scroll` | `overflow: scroll;` |
| `position relative` | `position: relative;` |
| `position absolute` | `position: absolute;` |
| `position fixed` | `position: fixed;` |
| `position sticky` | `position: sticky;` |
| `top 0` | `top: 0;` |
| `left 0` | `left: 0;` |
| `right 0` | `right: 0;` |
| `bottom 0` | `bottom: 0;` |
| `z index 10` | `z-index: 10;` |
| `opacity 0.5` | `opacity: 0.5;` |
| `transition all 0.3s ease` | `transition: all 0.3s ease;` |
| `transition opacity 0.2s` | `transition: opacity 0.2s;` |
| `transform rotate 45deg` | `transform: rotate(45deg);` |
| `transform scale 1.1` | `transform: scale(1.1);` |
| `transform translate X -100%` | `transform: translateX(-100%);` |
| `object fit cover` | `object-fit: cover;` |
| `aspect ratio 16/9` | `aspect-ratio: 16/9;` |

### Shortcuts & presets

| Shortcut | Expands to |
|---|---|
| `card` | `padding 16px`, `background white`, `border radius 12px`, `box shadow light` |
| `button primary` | `padding 10px 16px`, `background #007bff`, `color white`, `border none`, `border radius 8px`, `cursor pointer`, `font weight 600` |
| `button secondary` | `padding 10px 16px`, `background white`, `color #333`, `border 1px solid #ddd`, `border radius 8px`, `cursor pointer` |
| `button ghost` | `padding 10px 16px`, `background transparent`, `color #007bff`, `border none`, `cursor pointer` |
| `input field` | `padding 10px 14px`, `border 1px solid #ddd`, `border radius 8px`, `font size 14px`, `width 100%` |
| `container` | `max width 1200px`, `margin auto`, `padding 0 20px` |
| `center` | `display flex`, `justify content center`, `align items center` |
| `flex col` | `display flex`, `flex direction column` |
| `flex row` | `display flex`, `flex direction row` |
| `flex wrap` | `display flex`, `flex wrap wrap` |
| `grid 3` | `display grid`, `grid template columns repeat 3 1fr`, `gap 16px` |
| `grid 2` | `display grid`, `grid template columns repeat 2 1fr`, `gap 16px` |
| `grid 4` | `display grid`, `grid template columns repeat 4 1fr`, `gap 16px` |
| `full width` | `width 100%` |
| `full height` | `height 100vh` |
| `hidden` | `display none` |

### Pseudo-selectors

```
style:
  .button:
    padding 10px 16px
    background #007bff
    color white
    border none
    border radius 8px
    cursor pointer

  .button:hover:
    background #0056b3
    box shadow medium

  .button:active:
    transform scale 0.98

  .button:focus:
    outline 2px solid #007bff
    outline offset 2px
```

### Media queries

```
style:
  .container:
    padding 20px

  .container @mobile:
    padding 10px
    flex direction column

  .container @tablet:
    padding 15px
```

Breakpoint defaults:
- `@mobile`: `max-width: 480px`
- `@tablet`: `max-width: 768px`
- `@desktop`: `min-width: 1024px`

Custom breakpoints:

```
breakpoints:
  mobile = 480px
  tablet = 768px
  desktop = 1024px
  widescreen = 1440px
```

### Mixed syntax (backward compatible)

You can still use raw CSS if preferred:

```
style:
  .card {
    padding: 16px;
    border-radius: 12px;
  }

  .button:
    padding 10px 16px
    background #007bff
```

---

## breakpoints (NEW)
Define custom breakpoints for media queries.

```
breakpoints:
  mobile = 480px
  tablet = 768px
  desktop = 1024px
```

---

## handlers
Defines handler bodies. Handler body uses a tiny statement language.

### Basic statements

```
handlers:
  inc:
    set count = count + 1
  debug:
    log "hi"
```

Statements supported:
- `set <name> = <expr>`
- `log "<string>"`

Expressions:
- numbers, identifiers, parentheses
- binary ops: `+ - * /`

### API calls (NEW)

```
handlers:
  loadData:
    fetch fetchTodos -> todos
    set items = todos

  addItem:
    fetch createTodo with { text: newItem, done: false } -> result
    set items = [...items, result]
    set newItem = ""

  deleteItem:
    fetch deleteTodo with { id: targetId }
    set items = items.filter(i -> i.id != targetId)
```

### Async/await pattern

```
handlers:
  loadData:
    set loading = true
    fetch fetchTodos -> data
    set items = data
    set loading = false
  catch error:
    set errorMsg = "Failed to load data"
    set loading = false
```

---

## script (Optional)
Background/initialization code that runs on the server (dev mode) or with `init()` export.

```
script:
  export function init(store) {
    setInterval(() => {
      store.set({ timestamp: Date.now() });
    }, 1000);
  }
```

---

## Compilation targets

### Vanilla (Client-side)
Emits:
- `index.html` — minimal page with scoped styles
- `app.css` — scoped styles
- `app.js` — runtime + compiled component + handlers

### Server-Driven (Real-time)
Emits:
- Same as vanilla, but with WebSocket synchronization
- Server manages state and evaluates conditions/loops
- Real-time updates via WebSocket connection

### React (NEW)
Emits:
- `Component.tsx` — React functional component with hooks
- `Component.module.css` — scoped CSS modules
- Uses `useState`/`useEffect` for reactivity

```bash
node dist/cli.js build examples/counter.hjx --out dist-app --target react
```

### React + Backend (NEW)
Emits:
- `Component.tsx` — React component
- `Component.module.css` — scoped CSS modules
- `api/routes.ts` — Express.js routes
- `api/handlers.ts` — API handler functions

```bash
node dist/cli.js build examples/todo-app.hjx --out dist-app --target react --backend
```

---

## CLI commands

| Command | Description |
|---|---|
| `hjx parse <file.hjx>` | Print the AST (JSON) |
| `hjx build <file.hjx> --out <dir>` | Compile to vanilla HTML/CSS/JS |
| `hjx build <file.hjx> --out <dir> --target react` | Compile to React component |
| `hjx build <file.hjx> --out <dir> --target react --backend` | Compile to React + Express backend |
| `hjx dev <file.hjx> --out <dir> --port <n>` | Dev server with hot reload |
