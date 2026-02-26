# Dev Server

The `dev` command starts a development server with hot module replacement (HMR).

## Basic Usage

```bash
node dist/cli.js dev <file.hjx> --out <output-dir> --port <port>
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--out, -o` | Output directory | `dist-app` |
| `--port, -p` | Server port | `5173` |
| `--target` | Compilation target | `vanilla` |
| `--verbose, -v` | Verbose logging | `false` |
| `--open` | Open browser | `false` |

## Examples

### Basic Dev Server

```bash
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173
```

### Server-Driven Mode

```bash
node dist/cli.js dev examples/dashboard.hjx --out dist-app --port 5173 --target server
```

### With Browser Auto-Open

```bash
node dist/cli.js dev app.hjx --out dist-app --open
```

## Features

### Hot Module Replacement

Changes to `.hjx` files trigger:
1. Incremental recompilation
2. WebSocket push to browser
3. Module replacement without full reload
4. State preservation where possible

### Live Reload

CSS changes are injected without page refresh.

### Error Overlay

Compilation errors display in the browser with:
- Error message
- File and line number
- Fix suggestions

### Source Maps

Enable for debugging:

```bash
node dist/cli.js dev app.hjx --out dist-app --sourcemap
```

## File Watching

The dev server watches:
- The main `.hjx` file
- Imported components
- Files in the same directory

## Troubleshooting

### Port Already in Use

```bash
# Use different port
node dist/cli.js dev app.hjx --out dist-app --port 5174
```

### Changes Not Reloading

1. Check terminal for errors
2. Clear browser cache
3. Restart dev server

### Slow Performance

- Reduce component file size
- Avoid deep nesting
- Use production build for benchmarks

## Production vs Development

| Feature | Dev | Production |
|---------|-----|------------|
| HMR | Yes | No |
| Minification | No | Yes |
| Source maps | Optional | Optional |
| Error overlay | Yes | No |
| Watching | Yes | No |

## NPM Script

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173",
    "dev:server": "node dist/cli.js dev examples/dashboard.hjx --out dist-app --port 5173 --target server"
  }
}
```

Then run:

```bash
npm run dev
```
