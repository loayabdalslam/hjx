# Hot Reload

The HJX development server provides instant hot module replacement (HMR) for fast development.

## Starting the Dev Server

```bash
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173
```

This starts a local server with:
- File watching
- Hot module replacement
- Error overlay
- Live reload

## How It Works

1. **File Watcher** - Monitors `.hjx` files for changes
2. **Incremental Build** - Only recompiles changed files
3. **WebSocket** - Pushes updates to browser
4. **HMR** - Replaces modules without full reload

## Behavior by File Type

### `.hjx` Files
- Full recompilation
- Browser refreshes automatically

### `.css` in Style Block
- Injected without page refresh
- State preserved

### JavaScript Changes
- Module replaced, state preserved when possible

## Error Handling

Compilation errors show in:

1. **Terminal** - Full error message with line numbers
2. **Browser Overlay** - Visual error display

```bash
[HJX] Error: Parse error at line 5
  4 | layout:
  5 |   view: missing colon
         ^
```

## Manual Refresh

If HMR fails, manually refresh the browser or restart the server.

## Tips

1. **Keep the terminal visible** - See build errors
2. **Check browser console** - JavaScript errors appear there
3. **Use --verbose for debugging** - More detailed output

## Configuration

The dev server options:

```bash
node dist/cli.js dev <file> --out <dir> --port <port> --verbose
```

| Option | Description | Default |
|--------|-------------|---------|
| `--out` | Output directory | `dist-app` |
| `--port` | Server port | `5173` |
| `--verbose` | Verbose logging | `false` |

## Troubleshooting

### Changes Not Loading?

1. Check terminal for errors
2. Clear browser cache
3. Restart dev server

### Port Already in Use?

```bash
# Use a different port
node dist/cli.js dev app.hjx --out dist-app --port 5174
```

### Slow Rebuilds?

- Use smaller component files
- Avoid deeply nested structures

## Next Steps

- [Production Build](/guide/production) - Build for deployment
- [CLI Reference](/cli/commands) - All CLI options
