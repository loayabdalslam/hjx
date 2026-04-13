# HJX Project Context

## Project Overview

**HJX** is a compiled UI language that unifies structure (HTML), style (CSS), and logic (JavaScript) into a single `.hjx` file. It compiles to clean, dependency-free vanilla HTML/CSS/JS — no virtual DOM, no runtime overhead, no framework lock-in.

**Version:** 0.1.0
**License:** MIT
**Repository:** https://github.com/loayabdalslam/hjx

### Key Features
- **Indentation-based syntax** — Clean, whitespace-sensitive UI tree (similar to Python/Pug)
- **Reactive state** — Automatic DOM updates when state changes
- **Scoped CSS** — Styles are automatically scoped via `[data-hjx-scope]` attribute selectors
- **Two compilation targets:**
  - **Vanilla** — Pure client-side HTML/CSS/JS with custom reactive runtime
  - **Server-Driven** — WebSocket-based state sync for real-time applications
- **Component composition** — Import and reuse `.hjx` components
- **Fast performance** — Parses 5,000 nodes in ~17ms, compiles in ~13ms

### HJX File Structure
```
component <Name>        ← Component declaration
imports:                ← Optional: import other .hjx components
state:                  ← Reactive variables
script:                 ← Optional: server-side initialization code
layout:                 ← UI tree (indentation-based)
style:                  ← Scoped CSS
handlers:               ← Event logic
```

### Supported UI Nodes
| Node | Description |
|------|-------------|
| `view` | Generic container (`<div>`) |
| `text` | Inline text (`<span>`) |
| `button` | Button element |
| `input` | Input element |
| `if` | Conditional rendering |
| `for` | Loop/list rendering |

### Handler Statements
- `set <var> = <expr>` — Update reactive state
- `log "<message>"` — Debug logging

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

# Run tests with coverage
npm run coverage

# Run benchmarks
npm run benchmark

# Build documentation
npm run docs:build
npm run docs:preview
```

### CLI Usage

```bash
# Parse a .hjx file and print AST (JSON)
node dist/cli.js parse examples/counter.hjx

# Compile to HTML/CSS/JS
node dist/cli.js build examples/counter.hjx --out dist-app

# Start dev server with hot reload
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173
```

### Compilation Output
- `index.html` — Minimal page with scoped styles
- `app.css` — Scoped component styles
- `app.js` — Runtime + compiled component logic

---

## Project Structure

```
hjx/
├── src/
│   ├── cli.ts                  # CLI entry point (parse, build, dev)
│   ├── parser.ts               # HJX source → AST
│   ├── types.ts                # TypeScript type definitions
│   ├── index.ts                # Public API exports
│   ├── loader.ts               # File loading utilities
│   ├── runtime.ts              # Client-side reactive runtime
│   ├── server_session.ts       # Server-driven state manager
│   ├── devserver.ts            # Dev server with HMR + WebSocket
│   ├── compiler/
│   │   ├── vanilla.ts          # AST → Vanilla JS compilation
│   │   ├── server_driven.ts    # AST → Server-driven compilation
│   │   ├── emit.ts             # Runtime file emission
│   │   ├── runtime_source.ts   # Runtime JS source templates
│   │   ├── vanilla_handlers.ts # Handler code generation
│   │   ├── vanilla_scope_css.ts # CSS scoping logic
│   │   ├── signal_codegen.ts   # Signal-based code generation
│   │   ├── dependency_tracker.ts # Dependency tracking
│   │   └── types.ts            # Compiler-specific types
│   ├── lovable/                # AI code generation integration
│   │   ├── prompt_builder.ts   # HJX prompt engineering for LLMs
│   │   └── config/             # AI provider configurations
│   └── nlp/                    # Natural language processing utilities
├── examples/
│   ├── counter.hjx             # Simple counter example
│   ├── form.hjx                # Two-way form binding
│   ├── list.hjx                # Todo list with loops
│   ├── conditional.hjx         # Conditional rendering
│   ├── dashboard.hjx           # Server-driven dashboard
│   ├── composition_demo.hjx    # Component composition
│   └── components/
│       ├── Button.hjx
│       ├── Card.hjx
│       └── Input.hjx
├── packages/
│   └── vite-plugin-hjx/        # First-party Vite plugin
├── extensions/
│   └── vscode/                 # VS Code language extension
├── docs/                       # VitePress documentation
├── tests/                      # Test suite (vitest)
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

### Code Style
- TypeScript with strict mode enabled
- ES modules (`"type": "module"` in package.json)
- Force consistent casing in file names
- 2-space indentation in HJX source files

### HJX Syntax Conventions
- 2-space indentation recommended
- One component per file
- State variables use reactive assignment (`set x = ...`)
- CSS classes support Tailwind-style naming (`md:flex`, `hover:bg-blue`)

---

## AI Integration (HJX-Lovable)

The project includes an AI-powered code generation subsystem (`src/lovable/`) that can generate HJX code from natural language descriptions.

### Supported AI Providers
| Provider | Model | Speed | Best For |
|----------|-------|-------|----------|
| Groq | Llama-3.3-70B | ~150 tok/s | Real-time generation |
| Ollama (local) | Llama-3.3-70b | ~60 tok/s | Free, private dev |
| OpenRouter | Claude-3.5 | ~40 tok/s | Quality output |

### API Endpoints (when implemented)
- `POST /api/generate` — Generate HJX from natural language
- `POST /api/compile` — Compile existing HJX to HTML/CSS/JS
- `GET /api/preview/:id` — Get preview of generated project

### Environment Variables
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PROVIDER` | No | groq | AI provider to use |
| `GROQ_API_KEY` | For Groq | - | Groq API key |
| `OPENROUTER_API_KEY` | For OpenRouter | - | OpenRouter API key |
| `OLLAMA_HOST` | For Ollama | localhost:11434 | Ollama server |
| `PORT` | No | 3000 | Server port |

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

## Quick HJX Example

```hjx
component Counter

state:
  count = 0

layout:
  view#root.card:
    text.title: "Count: {{count}}"
    button.primary (on click -> inc): "Increase"
    button.ghost (on click -> dec): "Decrease"

style:
  .card { padding: 16px; border: 1px solid #ddd; border-radius: 12px; }
  .primary { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 0; }
  .ghost { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 1px solid #ddd; background: transparent; }

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
```

---

## Related Documentation
- `README.md` — Main project readme with usage examples
- `SPEC.md` — Formal HJX language specification
- `skills.md` — HJX language skills and patterns reference
- `Benchmark.md` — Detailed performance benchmarks
- `AGENTS.md` — AI integration setup guide
- `HJX_v0.1_README.md` — Version-specific documentation
- `HJX_WITH_AI.md` — AI-powered generation guide
