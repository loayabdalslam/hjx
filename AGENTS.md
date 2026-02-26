# AGENTS.md

## Project Overview

HJX is a compiled UI language that unifies structure, style, and logic into a single `.hjx` file. It compiles to clean, dependency-free HTML + CSS + JavaScript.

## Tech Stack

- **Language**: TypeScript
- **Testing**: Vitest
- **Build**: TypeScript compiler (`tsc`)
- **Documentation**: VitePress
- **Package Manager**: npm

## Commands

```bash
# Install dependencies
npm install

# Build the compiler
npm run build

# Run tests
npm test

# Run coverage
npm run coverage

# Build docs
npm run docs:build

# Dev server for docs
npm run docs:dev

# Run benchmarks
npm run benchmark
```

## Project Structure

```
src/
├── parser.ts              # HJX → AST
├── runtime.ts             # Client-side reactivity
├── server_session.ts      # Server-driven state manager
├── devserver.ts           # Dev server with HMR
├── loader.ts              # Module loader
├── types.ts               # TypeScript types
├── cli.ts                 # CLI entry point
└── compiler/
    ├── vanilla.ts         # Vanilla JS target compiler
    ├── server_driven.ts   # Server-driven mode compiler
    ├── vanilla_handlers.ts# Handler code generation
    ├── vanilla_scope_css.ts# CSS scoping
    ├── runtime_source.ts  # Runtime code emission
    └── emit.ts            # Code emission utilities
```

## Running the Compiler

```bash
# Build an HJX file
node dist/cli.js build examples/counter.hjx --out dist-app

# Dev server with hot reload
node dist/cli.js dev examples/conditional.hjx --out dist-app --port 5172

# Parse and print AST
node dist/cli.js parse examples/counter.hjx
```

## Key Files to Know

- `src/parser.ts` - Tokenizer and parser for HJX syntax
- `src/compiler/vanilla.ts` - Main compiler from AST to HTML/CSS/JS
- `src/runtime.ts` - Client-side runtime for reactivity
- `src/server_session.ts` - WebSocket server for server-driven mode
- `examples/` - Example HJX components

## Testing

Tests are located alongside source files. Run with `npm test`.
