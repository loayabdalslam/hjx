# CLI Reference

## Commands

### hjx parse

Parse a `.hjx` file and output the AST as JSON:

```bash
node dist/cli.js parse <file.hjx>
```

**Example:**
```bash
node dist/cli.js parse examples/counter.hjx
```

**Output:**
```json
{
  "kind": "HJXAst",
  "version": "0.1",
  "component": { "name": "Counter" },
  "state": { "count": 0 },
  "layout": { ... },
  "style": "...",
  "handlers": { ... }
}
```

### hjx build

Compile a `.hjx` file to vanilla HTML/CSS/JS:

```bash
node dist/cli.js build <file.hjx> --out <dir>
```

**Options:**
| Flag | Default | Description |
|------|---------|-------------|
| `--out` | `dist-app` | Output directory |

**Output files:**
- `index.html` — HTML page
- `app.css` — Scoped styles
- `app.js` — Compiled JavaScript

### hjx dev

Start a development server with hot reload:

```bash
node dist/cli.js dev <file.hjx> --out <dir> --port <n>
```

**Options:**
| Flag | Default | Description |
|------|---------|-------------|
| `--out` | `dist-app` | Output directory |
| `--port` | `5173` | Server port |

**Features:**
- Watches `.hjx` file for changes
- Auto-recompiles on save
- WebSocket-based hot reload
- Serves compiled output on localhost

**Example:**
```bash
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5172
# → Open http://localhost:5172
```

## NPM Scripts

From the root `package.json`:

```bash
npm run build         # Compile TypeScript
npm run dev           # Run dashboard example
npm run docs:dev      # Start docs dev server
npm run docs:build    # Build docs for deployment
npm run test          # Run tests with vitest
```
