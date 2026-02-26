# CLI Commands

HJX provides a command-line interface for parsing, building, and serving your components.

## Installation

After building the project:

```bash
npm run build
```

## Commands

### parse

Parse an HJX file and output the AST (Abstract Syntax Tree):

```bash
node dist/cli.js parse <file.hjx>
```

**Example:**

```bash
node dist/cli.js parse examples/counter.hjx
```

**Output:** JSON representation of the parsed component.

### build

Compile an HJX file to HTML, CSS, and JavaScript:

```bash
node dist/cli.js build <file.hjx> --out <directory>
```

**Options:**

- `--out` or `-o`: Output directory (default: `dist-app`)

**Example:**

```bash
node dist/cli.js build examples/counter.hjx --out dist-app
```

**Output:**
- `index.html` - The compiled HTML
- `app.css` - The compiled CSS
- `app.js` - The compiled JavaScript
- `runtime.js` - The runtime library

### dev

Start a development server with hot reload:

```bash
node dist/cli.js dev <file.hjx> --out <directory> --port <port>
```

**Options:**

- `--out` or `-o`: Output directory (default: `dist-app`)
- `--port` or `-p`: Port number (default: `5173`)

**Example:**

```bash
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5172
```

**Features:**
- Automatic recompilation on file changes
- WebSocket for server-driven mode
- Hot module replacement

## Usage Examples

### Basic Workflow

```bash
# Parse and inspect AST
node dist/cli.js parse examples/counter.hjx

# Build for production
node dist/cli.js build examples/counter.hjx --out dist-app

# Start development server
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173
```

### Multiple Files

```bash
# Build multiple components
node dist/cli.js build component1.hjx --out dist
node dist/cli.js build component2.hjx --out dist
```

## Output Files

After building, you'll have:

```
dist-app/
├── index.html    # Main HTML file
├── app.css      # Compiled styles
├── app.js       # Compiled JavaScript
└── runtime.js   # Runtime library
```

## Watching Files

For automatic rebuilding, use the dev server which watches for changes:

```bash
node dist/cli.js dev examples/conditional.hjx --out dist-app
```

Any changes to `.hjx` files in the same directory will trigger a rebuild.

## Error Handling

The CLI reports errors with line numbers:

```
Error: component.hjx:10: Invalid state line. Expected: name = value
```

## Help

Show available commands:

```bash
node dist/cli.js help
```

Or with no arguments:

```bash
node dist/cli.js
```

## NPM Scripts

The `package.json` includes convenient scripts:

```bash
# Build
npm run build

# Development server
npm run dev

# Parse a file
npm run parse -- examples/counter.hjx
```
