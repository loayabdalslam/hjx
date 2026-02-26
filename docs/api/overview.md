# API Overview

This section documents the HJX APIs for programmatic usage.

## Modules

| Module | Description |
|--------|-------------|
| `parser` | HJX → AST |
| `compiler/vanilla` | AST → Vanilla JS |
| `compiler/server` | AST → Server-driven JS |
| `runtime` | Client-side reactivity |
| `server_session` | WebSocket server |

## Quick Start

```javascript
import { parse } from './dist/parser.js';
import { build } from './dist/compiler/vanilla.js';
import { runtime } from './dist/runtime.js';

// Parse
const ast = parse(hjxCode);

// Build
const output = build(ast, { minify: true });

// Runtime
runtime.mount(document.getElementById('root'), output);
```

## TypeScript

All APIs are written in TypeScript and include type definitions.

```typescript
import { parse, AST } from './dist/parser.js';
import { build, Output } from './dist/compiler/vanilla.js';

const ast: AST = parse(code);
const output: Output = build(ast);
```

## Next Steps

- [Parser API](/api/parser) - Parsing HJX files
- [Compiler API](/api/compiler) - Compiling to output
- [Runtime API](/api/runtime) - Client-side reactivity
- [Server Session API](/api/server-session) - WebSocket server
