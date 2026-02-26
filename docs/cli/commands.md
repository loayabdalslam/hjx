# CLI Commands

The HJX CLI provides commands for building, developing, and parsing HJX files.

## Installation

After building the project:

```bash
npm run build
```

The CLI is available at `dist/cli.js`.

## Global Installation

```bash
# Link globally
npm link

# Or use npx
npx hjx <command>
```

## Commands Overview

| Command | Description |
|---------|-------------|
| `parse` | Parse and show AST |
| `build` | Build to static files |
| `dev` | Start development server |

## Parse Command

Parse an HJX file and output the Abstract Syntax Tree (AST):

```bash
node dist/cli.js parse <file.hjx>
```

### Options

```bash
node dist/cli.js parse examples/counter.hjx
node dist/cli.js parse app.hjx --pretty    # Pretty print JSON
```

### Output

```json
{
  "type": "Component",
  "name": "Counter",
  "state": [...],
  "layout": [...],
  "style": [...],
  "handlers": [...]
}
```

## Build Command

Compile HJX files to static output:

```bash
node dist/cli.js build <input.hjx> --out <output-dir>
```

### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--out` | `-o` | Output directory | `dist-app` |
| `--target` | `-t` | Target: `vanilla` or `server` | `vanilla` |
| `--minify` | | Minify output | `true` |
| `--sourcemap` | | Generate sourcemaps | `false` |

### Examples

```bash
# Basic build
node dist/cli.js build examples/counter.hjx --out dist-app

# Server-driven build
node dist/cli.js build examples/dashboard.hjx --out dist-app --target server

# With sourcemaps
node dist/cli.js build app.hjx --out dist-app --sourcemap
```

## Dev Command

Start a development server with hot reload:

```bash
node dist/cli.js dev <file.hjx> --out <output-dir> --port <port>
```

### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--out` | `-o` | Output directory | `dist-app` |
| `--port` | `-p` | Server port | `5173` |
| `--target` | `-t` | Target: `vanilla` or `server` | `vanilla` |
| `--verbose` | `-v` | Verbose logging | `false` |
| `--open` | | Open browser automatically | `false` |

### Examples

```bash
# Basic dev server
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173

# Server-driven mode
node dist/cli.js dev examples/dashboard.hjx --out dist-app --port 5173 --target server

# Verbose logging
node dist/cli.js dev app.hjx --out dist-app --verbose
```

## Common Usage

```bash
# Development
npm run dev

# Production build
npm run build

# Parse for debugging
node dist/cli.js parse examples/counter.hjx
```

## Environment Variables

Set these in your shell:

```bash
# Custom dist path
export HJX_DIST=./custom-dist

# Custom examples path  
export HJX_EXAMPLES=./my-examples
```

## Troubleshooting

### Port Already in Use

```bash
# Use different port
node dist/cli.js dev app.hjx --out dist-app --port 5174
```

### Build Errors

Run with verbose flag:

```bash
node dist/cli.js build app.hjx --out dist-app --verbose
```

### File Not Found

Ensure you're in the project root and the file path is correct.
