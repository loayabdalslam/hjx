# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

**Build the compiler:**
```bash
npm run build
```

**Run tests:**
```bash
npm test                    # Watch mode
npm test -- --run          # Single run
npm run coverage           # Coverage report
```

**Development:**
```bash
npm run dev                # Start dev server with hot reload (examples/dashboard.hjx on port 5172)
npm run docs:dev           # VitePress docs on port 5173
```

**CLI commands:**
```bash
node dist/cli.js parse <file.hjx>                                    # Print AST
node dist/cli.js build <file.hjx> --out <dir>                       # Compile to vanilla HTML/CSS/JS
node dist/cli.js build <file.hjx> --out <dir> --target react        # Compile to React
node dist/cli.js build <file.hjx> --out <dir> --target react --backend  # React + Express backend
node dist/cli.js dev <file.hjx> --out <dir> --port <n>              # Dev server with hot reload
node dist/cli.js flow "natural language description"                # Generate HJX from English
```

## Architecture

HJX is a compiled UI language that unifies structure, style, and logic into a single `.hjx` file. The compilation pipeline:

1. **Parser** (`src/parser.ts`) — Converts `.hjx` source to AST
   - Indentation-based syntax (2 spaces)
   - Blocks: `component`, `imports`, `state`, `api`, `layout`, `style`, `breakpoints`, `handlers`, `script`
   - Validates component names, state definitions, and handler references

2. **Compilers** (`src/compiler/`)
   - `vanilla.ts` — Generates vanilla HTML/CSS/JS with signal-based reactivity
   - `react.ts` — Generates React components with hooks
   - `nl_css.ts` — Translates natural language CSS to standard CSS
   - `server_driven.ts` — Server-driven rendering target
   - `signal_codegen.ts` — Generates signal-based reactive code
   - `dependency_tracker.ts` — Analyzes state-to-DOM dependencies for optimized updates

3. **Natural Language Processing** (`src/nlp/`)
   - `flow/` — Flow-State Engine: translates English descriptions to HJX code
   - `intent/` — Intent classification (counter, form, todo-list, etc.)
   - `entities/` — Entity extraction from natural language
   - `generation/` — Code generation from parsed intent
   - `completion/` — Code completion suggestions

4. **CLI & Dev Server** (`src/cli.ts`, `src/devserver.ts`)
   - Entry point for all commands
   - Hot reload via file watching (chokidar)
   - WebSocket-based dev server

5. **Runtime** (`src/compiler/runtime_source.ts`)
   - Signal-based reactivity (no virtual DOM)
   - DOM patching for efficient updates
   - Event binding and two-way input binding

## Key Concepts

**State & Reactivity:**
- State variables are reactive signals
- Changes trigger targeted DOM updates (not full re-renders)
- Computed values derive from state
- Dependency tracking optimizes which DOM nodes update

**Layout Syntax:**
- Indentation-based tree structure
- Nodes: `view` (div), `text` (span), `button`, `input`
- Selectors: `view#id.class1.class2:`
- Interpolation: `text: "Count: {{count}}"`
- Event binding: `button (on click -> handler): "Label"`
- Two-way binding: `input (bind value <-> stateVar)`
- Control flow: `if (condition):` and `for (item in items):`

**Natural Language CSS:**
- Shortcuts: `card`, `button primary`, `input field`, `container`
- Properties: `padding 16px`, `font size 24px`, `display flex`, `box shadow light`
- Pseudo-selectors: `.button:hover:`, `.container @mobile:`
- Breakpoints: `@mobile`, `@tablet` (customizable)

**API Integration:**
- Define endpoints: `GET /api/todos -> fetchTodos`
- Call in handlers: `fetch fetchTodos -> todos`
- Optional backend generation with `--backend` flag

## File Structure

```
src/
├── cli.ts                      # CLI entry point
├── parser.ts                   # HJX → AST parser
├── devserver.ts                # Dev server with hot reload
├── compiler/
│   ├── vanilla.ts              # Vanilla JS target
│   ├── react.ts                # React target
│   ├── nl_css.ts               # Natural language CSS → CSS
│   ├── signal_codegen.ts       # Signal-based code generation
│   ├── dependency_tracker.ts   # State-to-DOM dependency analysis
│   ├── vanilla_scope_css.ts    # CSS scoping for vanilla target
│   ├── emit.ts                 # File emission utilities
│   └── types.ts                # Compiler type definitions
├── nlp/
│   ├── flow/                   # Flow-State Engine
│   │   ├── flow_engine.ts
│   │   ├── grammar_loader.ts
│   │   └── cli.ts
│   ├── intent/                 # Intent classification
│   ├── entities/               # Entity extraction
│   ├── generation/             # Code generation
│   ├── completion/             # Code completion
│   └── errors/                 # Error detection
├── lovable/                    # AI integration
└── types.ts                    # Core type definitions

examples/
├── counter.hjx                 # Basic counter
├── counter_v2.hjx              # With natural language CSS
├── todo-app.hjx                # With API integration
└── dashboard_v2.hjx            # Grid layouts

docs/                           # VitePress documentation
grammar.yml                     # User-editable grammar rules
```

## Testing

Tests use Vitest. Key test file:
- `src/compiler/dependency_tracker.test.ts` — Dependency analysis tests

Run tests:
```bash
npm test                        # Watch mode
npm test -- --run              # Single run
npm run coverage               # Coverage report
```

## Common Tasks

**Add a new compilation target:**
1. Create `src/compiler/[target].ts` with a `build[Target](ast: HJXAst)` function
2. Export from `src/cli.ts`
3. Add case in CLI command handler

**Extend natural language CSS:**
1. Add patterns to `src/compiler/nl_css.ts` in the `nlCssToCss` function
2. Test with examples in `examples/`

**Add Flow-State patterns:**
1. Edit `grammar.yml` or create custom grammar file
2. Add pattern under `custom_rules:`
3. Test with: `node dist/cli.js flow --grammar grammar.yml "your description"`

**Debug parser issues:**
```bash
node dist/cli.js parse examples/counter.hjx | jq .
```

## Performance Notes

- Parser: ~2ms for 1000 state variables, ~2.5ms for 1000 nodes
- Compiler: ~2.8ms for 1000 nodes to vanilla JS
- Runtime updates: <3ms for 100 items (targeted DOM patching)
- CSS scoping: ~1.8ms for 1000 rules

## Documentation

- `README.md` — Feature overview and quick start
- `SPEC.md` — Language specification (v0.2)
- `docs/` — VitePress documentation (build with `npm run docs:build`)
- `grammar.yml` — Built-in and custom grammar rules
