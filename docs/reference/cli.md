# CLI Reference

The HJX command-line interface provides tools for parsing, building, and developing HJX components.

## Commands

### `hjx parse <file.hjx>`

Parses a `.hjx` file and outputs the AST as JSON.

**Example:**
```bash
hjx parse examples/counter.hjx
```

**Output:** JSON representation of the parsed component.

### `hjx build <file.hjx> --out <directory>`

Builds a `.hjx` file into static HTML/CSS/JS files.

**Options:**
- `--out <dir>`: Output directory (required)

**Example:**
```bash
hjx build examples/counter.hjx --out dist-app
```

**Output Files:**
- `index.html`: Main HTML page
- `app.css`: Component styles
- `app.js`: Component logic
- `runtime.js`: HJX runtime

### `hjx dev <file.hjx> --out <directory> --port <number>`

Starts a development server with hot reload.

**Options:**
- `--out <dir>`: Output directory (required)
- `--port <n>`: Server port (default: 5173)

**Example:**
```bash
hjx dev examples/counter.hjx --out dist-app --port 5173
```

**Features:**
- File watching for automatic rebuilds
- WebSocket-based hot reload
- Serves static files from output directory

## Help

Run without arguments or with the `help` command to see usage information:

```bash
node dist/cli.js help
```

## Exit Codes

- `0`: Success
- `1`: Error (parsing, compilation, etc.)