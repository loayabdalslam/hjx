# HJX Project Context — v0.2

## Project Overview

**HJX** is a compiled UI language that unifies structure (HTML), style (CSS), and logic (JavaScript) into a single `.hjx` file. It compiles to clean, dependency-free vanilla HTML/CSS/JS or React components — no virtual DOM, no runtime overhead, no framework lock-in.

**Version:** 0.2.0 (with Flow-State Engine)
**License:** MIT
**Repository:** https://github.com/loayabdalslam/hjx

### Key Features
- **Indentation-based syntax** — Clean, whitespace-sensitive UI tree
- **Reactive state** — Automatic DOM updates when state changes
- **Scoped CSS** — Styles automatically scoped via `[data-hjx-scope]`
- **Natural Language CSS** — Write styles like `card`, `button primary`, `font size 32px`
- **Flow-State Engine** — Write UI in plain English: `hjx flow "create a counter component"`
- **Dynamic Grammar** — User-editable `grammar.yml` for complete language control
- **React Compilation** — `hjx build file.hjx --target react` → `.tsx` + CSS modules
- **REST API Integration** — Define API endpoints in HJX, auto-generate Express routes
- **3 compilation targets:**
  - **Vanilla** — Pure client-side HTML/CSS/JS
  - **Server-Driven** — WebSocket-based state sync
  - **React** — React functional components with hooks

### HJX File Structure
```
component <Name>        ← Component declaration
imports:                ← Optional: import other .hjx components
state:                  ← Reactive variables
api:                    ← REST API endpoints (NEW)
layout:                 ← UI tree (indentation-based)
style:                  ← Natural language CSS (NEW)
handlers:               ← Event logic
breakpoints:            ← Custom media query breakpoints (NEW)
```

---

## Building and Running

### Prerequisites
- Node.js v18+
- npm v9+

### Commands

```bash
# Install dependencies
npm install

# Build the TypeScript compiler
npm run build

# Start dev server (with hot reload)
npm run dev

# Run tests
npm test

# Run benchmarks
npm run benchmark

# Flow-State Engine
node dist/cli.js flow "create a counter component"
node dist/cli.js flow --grammar custom.yml "make a todo app"
node dist/cli.js flow --compile "create a form with name and email"
```

### CLI Usage

```bash
# Parse a .hjx file and print AST (JSON)
node dist/cli.js parse examples/counter.hjx

# Compile to HTML/CSS/JS (vanilla)
node dist/cli.js build examples/counter.hjx --out dist-app

# Compile to React component
node dist/cli.js build examples/todo-app.hjx --out dist-app --target react

# Compile to React + Express backend
node dist/cli.js build examples/todo-app.hjx --out dist-app --target react --backend

# Flow-State: Natural language to HJX
node dist/cli.js flow "create a dashboard with stats"
node dist/cli.js flow --file prompt.txt --out result.hjx
```

---

## Flow-State Engine (NEW)

The **Flow-State Engine** allows you to write UI code in natural English, or mix English with HJX code.

### Pure Natural Language
```bash
hjx flow "create a counter component"
hjx flow "make a todo app with add and delete"
hjx flow "build a dashboard with charts"
```

### Mixed Code + Language
```
create a dashboard component
state:
  users = 0
  revenue = 0

make the container centered with a card layout
add a title that says "Dashboard"
add buttons for "View Reports" and "Manage Users"
```

### With Custom Grammar
```bash
hjx flow --grammar my-rules.yml "make a widget"
```

Edit `grammar.yml` to add your own patterns:
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

### Built-in Patterns
| Pattern | Example | Output |
|---------|---------|--------|
| Counter | `create a counter` | Full counter component with state + handlers |
| Form | `make a form` | Form with inputs, bindings, submit handler |
| Todo | `create a todo list` | Todo app with add/remove functionality |
| State | `add state called count` | `state: count = 0` |
| Button | `add button called Submit` | `button.primary (on click -> handleSubmit): "Submit"` |
| Style | `make the card centered` | Natural language CSS |

---

## Natural Language CSS (NEW)

Write styles using human-readable descriptions instead of raw CSS:

```hjx
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

  .primary:hover:
    background #0056b3
    box shadow medium
    transition all 0.2s ease
```

### Shortcuts & Presets
| Shortcut | Expands to |
|----------|-----------|
| `card` | padding, background, border-radius, box-shadow |
| `button primary` | padding, background, color, border, cursor |
| `input field` | padding, border, font-size, width |
| `container` | max-width, margin, padding |
| `grid 3` | display grid, 3 columns, gap |
| `center` | display flex, justify-content, align-items |

### Media Queries
```hjx
breakpoints:
  mobile = 480px
  tablet = 768px

style:
  .container @mobile:
    padding 12px
    flex direction column
```

---

## React Compilation (NEW)

Compile HJX directly to React components:

```bash
hjx build counter.hjx --target react
```

### Generated Output
- `Counter.tsx` — React functional component with `useState` hooks
- `Counter.module.css` — Scoped CSS modules
- Full event handlers and state management

### With Backend
```bash
hjx build todo-app.hjx --target react --backend
```

Generates:
- `TodoApp.tsx` — React component
- `TodoApp.module.css` — CSS modules
- `api/routes.ts` — Express.js routes
- `api/handlers.ts` — API handler functions

---

## REST API Integration (NEW)

Define API endpoints directly in HJX:

```hjx
api:
  GET /api/todos -> fetchTodos:
    query:
      page = 1
      limit = 10

  POST /api/todos -> createTodo:
    body:
      text = string
      done = boolean

  PUT /api/todos/:id -> updateTodo:
    params:
      id = number
    body:
      done = boolean

  DELETE /api/todos/:id -> deleteTodo:
    params:
      id = number
```

Use in handlers:
```hjx
handlers:
  loadData:
    fetch fetchTodos -> todos
    set items = todos

  addItem:
    fetch createTodo with { text: newItem, done: false } -> result
    set items = [...items, result]
```

---

## Project Structure

```
hjx/
├── src/
│   ├── cli.ts                  # CLI entry point (parse, build, dev, flow)
│   ├── parser.ts               # HJX source → AST (v0.2)
│   ├── types.ts                # TypeScript type definitions
│   ├── runtime.ts              # Client-side reactive runtime
│   ├── server_session.ts       # Server-driven state manager
│   ├── devserver.ts            # Dev server with HMR + WebSocket
│   ├── compiler/
│   │   ├── vanilla.ts          # AST → Vanilla JS compilation
│   │   ├── react.ts            # AST → React components (NEW)
│   │   ├── nl_css.ts           # Natural language CSS → CSS (NEW)
│   │   ├── server_driven.ts    # AST → Server-driven compilation
│   │   └── ...
│   ├── nlp/
│   │   ├── flow/               # Flow-State Engine (NEW)
│   │   │   ├── flow_engine.ts  # Pattern matching & generation
│   │   │   ├── grammar_loader.ts # YAML grammar loader
│   │   │   └── cli.ts          # Flow CLI interface
│   │   ├── tokenizer/          # Custom HJX tokenizer
│   │   ├── parser/             # Enhanced parser with source ranges
│   │   ├── intent/             # Intent classification
│   │   ├── entities/           # Entity extraction
│   │   ├── features/           # Feature extraction & embeddings
│   │   ├── completion/         # Code completion & semantic search
│   │   ├── generation/         # Template-based code generation
│   │   └── errors/             # Error detection & correction
│   └── lovable/                # AI code generation integration
├── examples/
│   ├── counter.hjx             # Simple counter (original)
│   ├── counter_v2.hjx          # Counter with natural language CSS
│   ├── todo-app.hjx            # Todo with API integration
│   ├── dashboard_v2.hjx        # Dashboard with grid layouts
│   └── components/             # Reusable components
├── grammar.yml                 # User-editable grammar rules (NEW)
├── packages/
│   └── vite-plugin-hjx/        # First-party Vite plugin
├── extensions/
│   └── vscode/                 # VS Code language extension
├── docs/                       # VitePress documentation
├── scripts/
│   └── benchmark.ts            # Benchmarking scripts
├── dist/                       # Compiled TypeScript output
└── package.json
```

---

## Development Conventions

### TypeScript Configuration
- **Target:** ES2022
- **Module:** ES2022
- **Module Resolution:** Bundler
- **Strict mode:** Enabled
- **Source:** `src/` → **Output:** `dist/`

### Testing
- **Framework:** Vitest
- **Coverage:** Vitest with V8 coverage
- **Environment:** JSDOM for runtime tests
- Test files located in `tests/**/*.ts`

### Grammar System
- `grammar.yml` defines all language patterns
- Users can add/modify/remove rules without touching code
- Pattern syntax: `"make a {{1}} widget"` → `{{1}}` is capture group
- Filters: `{{1|capitalize}}`, `{{1|lowercase}}`, `{{1|nospace}}`, etc.

### HJX Syntax Conventions
- 2-space indentation recommended
- One component per file
- State variables use reactive assignment (`set x = ...`)
- CSS classes support Tailwind-style naming (`md:flex`, `hover:bg-blue`)

---

## AI & NLP Integration

### Flow-State Engine
The primary interface for AI-powered code generation:
- **Pattern-based:** Matches natural language to HJX templates
- **Hybrid:** Mix English and code seamlessly
- **Extensible:** Custom grammar rules via `grammar.yml`
- **Confidence scoring:** Reports match confidence (0-1)

### Existing NLP Engine
Comprehensive NLP infrastructure (19 files):
- **Tokenizer:** 23 token types, HJX keyword recognition
- **Parser:** Enhanced AST with source ranges, symbol tables
- **Intent Classifier:** 13 categories (rule-based regex)
- **Entity Extractor:** 13 entity types
- **Template Generator:** 10 templates for common patterns
- **Error Detector:** 17 diagnostic codes with quick fixes
- **Code Completion:** Context-aware completions
- **Semantic Search:** Hybrid keyword + embedding search

### LLM Integration (Planned)
`src/lovable/` directory prepared for:
- Groq (Llama-3.3-70B) — Fastest
- OpenRouter (200+ models) — Best quality
- Ollama (local) — Free, private

---

## Performance Benchmarks

### Parser
- Parse 100 state variables: **~2ms**
- Parse 5,000 state variables: **~11ms**
- Parse 5,000 static nodes: **~17ms**

### Compiler
- Compile 5,000 nodes → Vanilla JS: **~13ms**
- Scope 5,000 CSS rules: **~13ms**

### Runtime (JSDOM)
- Static render 1,000 items: **~135ms**
- List update 1,000 items: **~217ms**
- Conditional update 1,000 items: **~14ms**
- Input binding update 1,000 items: **~7ms**

*Key insight: Updates are extremely fast (sub-3ms for 100 items) thanks to targeted DOM patching.*

---

## Dependencies

### Runtime
- `chokidar` — File watching for dev mode
- `ws` — WebSocket support for server-driven mode
- `uuid` — Unique ID generation
- `jimp` — Image processing

### Development
- `typescript` — Language
- `vitest` — Testing framework
- `jsdom` — Browser environment simulation
- `tsx` — TypeScript execution
- `vitepress` — Documentation site

---

## Quick HJX Examples

### Counter with Natural Language CSS
```hjx
component Counter

state:
  count = 0

layout:
  view#root.card:
    text.title: "Count: {{count}}"
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

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
```

### Flow-State (Natural English)
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
    ...
```

---

## Related Documentation
- `README.md` — Main project readme with usage examples
- `SPEC.md` — Formal HJX v0.2 language specification
- `skills.md` — HJX language skills and patterns reference
- `Benchmark.md` — Detailed performance benchmarks
- `AGENTS.md` — AI integration setup guide
- `grammar.yml` — User-editable language grammar
- `docs/` — VitePress documentation site
