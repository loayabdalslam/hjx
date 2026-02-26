# Production Build

Learn how to build your HJX app for production deployment.

## Build Command

```bash
node dist/cli.js build examples/counter.hjx --out dist-app
```

This generates optimized static files in `dist-app/`:

```
dist-app/
├── index.html    # HTML page
├── app.css       # Bundled CSS
└── app.js        # Bundled JS
```

## Output Files

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

### app.css

Scoped CSS with unique data attributes:

```css
.card[data-hjx-scope="counter-abc123"] {
  padding: 16px;
}
```

### app.js

Includes:
- HJX runtime (~5kb minified)
- Compiled component logic
- Event handlers

## Build Options

```bash
node dist/cli.js build <input.hjx> --out <output-dir> [options]
```

| Option | Description |
|--------|-------------|
| `--out` | Output directory (required) |
| `--minify` | Minify output (default: true) |
| `--sourcemap` | Generate sourcemaps |

## Deployment

### Static Hosting

Deploy to any static host:

```bash
# Netlify
npm install -g netlify-cli
netlify deploy --prod --dir dist-app

# Vercel
npm install -g vercel
vercel deploy --prod dist-app

# GitHub Pages
# Use GitHub Actions or push dist-app folder
```

### Custom Server

Serve the `dist-app` folder with any web server:

```bash
# Node.js
npx serve dist-app

# Python
python -m http.server 8000 -d dist-app

# PHP
php -S localhost:8000 -t dist-app
```

## Optimization Tips

1. **Keep components small** - Faster builds
2. **Use CSS containment** - Reduce style recalcs
3. **Lazy load routes** - (Future feature)

## Environment Variables

For server-driven mode, set the WebSocket URL:

```html
<script>
  window.HJX_WS_URL = 'wss://your-server.com/ws';
</script>
```

## Performance

HJX production builds are optimized for:

| Metric | Size |
|--------|------|
| Runtime | ~5kb minified |
| Per component | ~1-2kb |
| CSS | As written |

No virtual DOM overhead. Direct DOM manipulation.

## Example: Full Build Pipeline

```bash
# Install
npm install

# Build
npm run build

# Preview locally
npx serve dist-app

# Deploy
netlify deploy --prod --dir dist-app
```

## Next Steps

- [CLI Reference](/cli/commands) - All commands
- [API Reference](/api/overview) - Programmatic API
