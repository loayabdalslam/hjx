# Build Command

The `build` command compiles HJX files to static HTML, CSS, and JavaScript.

## Basic Usage

```bash
node dist/cli.js build <input.hjx> --out <output-dir>
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--out, -o` | Output directory | `dist-app` |
| `--target` | Compilation target | `vanilla` |
| `--minify` | Minify output | `true` |
| `--sourcemap` | Generate sourcemaps | `false` |

## Targets

### Vanilla Target

Generates client-side reactive code:

```bash
node dist/cli.js build app.hjx --out dist-app --target vanilla
```

Output:
- `index.html` - HTML page
- `app.css` - Scoped CSS
- `app.js` - Runtime + component code

### Server-Driven Target

Generates code with WebSocket sync:

```bash
node dist/cli.js build dashboard.hjx --out dist-app --target server
```

Output includes:
- Server-side state handling
- WebSocket client code

## Examples

### Basic Build

```bash
node dist/cli.js build examples/counter.hjx --out dist-app
```

Creates:
```
dist-app/
├── index.html
├── app.css
└── app.js
```

### With Options

```bash
node dist/cli.js build app.hjx \
  --out dist-prod \
  --target vanilla \
  --minify \
  --sourcemap
```

### Programmatic Usage

```javascript
import { build } from './dist/compiler/vanilla.js';

const result = build('./app.hjx', {
  outDir: './dist',
  minify: true,
  target: 'vanilla'
});

console.log('Build complete!');
```

## Output Structure

### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <link rel="stylesheet" href="app.css">
</head>
<body>
  <div id="root" data-hjx-app></div>
  <script type="module" src="app.js"></script>
</body>
</html>
```

### app.js Structure

1. Runtime initialization
2. Component registration
3. Event handlers
4. Reactive updates

### app.css Structure

1. Scoped styles with data attributes
2. Original CSS preserved

## Performance

Build times (typical):
- Single component: < 50ms
- 10 components: < 200ms
- 100 components: < 2s

Output size:
- Runtime: ~5kb minified
- Per component: ~1-2kb
- CSS: As written
