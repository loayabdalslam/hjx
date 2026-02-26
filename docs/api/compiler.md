# Compiler API

The compiler transforms the AST into executable HTML, CSS, and JavaScript.

## Usage

```javascript
import { parse } from './dist/parser.js';
import { build } from './dist/compiler/vanilla.js';

// Parse
const ast = parse(hjxCode);

// Build
const output = build(ast, {
  outDir: './dist',
  minify: true
});

console.log(output.html);
console.log(output.css);
console.log.output.js;
```

## Functions

### build(ast: AST, options?: BuildOptions): Output

Compile an AST to output files.

```javascript
const output = build(ast, { minify: true });
```

### compile(ast: AST): CompiledComponent

Compile without writing files.

```javascript
const compiled = compile(ast);
console.log(compiled.html);
console.log(compiled.js);
```

## Build Options

```typescript
interface BuildOptions {
  outDir?: string;        // Output directory
  minify?: boolean;       // Minify output
  target?: 'vanilla' | 'server';
  sourcemap?: boolean;    // Generate sourcemaps
  filename?: string;      // Output filename
}
```

## Output

```typescript
interface Output {
  html: string;
  css: string;
  js: string;
  files?: string[];       // Written files
}
```

## Vanilla Compiler

```javascript
import { build } from './dist/compiler/vanilla.js';

const output = build(ast, {
  target: 'vanilla',
  minify: true
});
```

Output:
- **html** - HTML markup
- **css** - Scoped CSS
- **js** - Client-side JavaScript

## Server-Driven Compiler

```javascript
import { build } from './dist/compiler/server_driven.js';

const output = build(ast, {
  target: 'server',
  minify: true
});
```

Output:
- **html** - HTML markup
- **css** - Scoped CSS
- **js** - Client + server communication code

## CSS Scoping

The compiler adds scoped data attributes:

```css
.card[data-hjx-scope="counter-abc123"] {
  padding: 16px;
}
```

## Handler Compilation

Handlers compile to JavaScript functions:

```hjx
handlers:
  increment:
    set count = count + 1
```

Compiles to:

```javascript
function increment() {
  state.count = state.count + 1;
  update();
}
```

## Error Handling

```javascript
try {
  const output = build(ast, { outDir: './dist' });
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('Output directory not found');
  }
  throw error;
}
```

## Examples

### Basic Build

```javascript
import { parse } from './dist/parser.js';
import { build } from './dist/compiler/vanilla.js';
import * as fs from 'fs';

const ast = parse(fs.readFileSync('./Counter.hjx', 'utf8'));
const output = build(ast, { outDir: './dist-app' });

fs.writeFileSync('./dist-app/index.html', output.html);
fs.writeFileSync('./dist-app/app.css', output.css);
fs.writeFileSync('./dist-app/app.js', output.js);
```

### Programmatic Use

```javascript
import { parse } from './dist/parser.js';
import { compile } from './dist/compiler/vanilla.js';

const ast = parse(`
  component Demo
  state:
    count = 0
  layout:
    view: "Count: {{count}}"
`);

const { html, css, js } = compile(ast);

// Use in your own app
document.getElementById('app').innerHTML = html;
eval(js);
```

### Custom Output

```javascript
const output = build(ast, {
  outDir: './build',
  minify: false,
  sourcemap: true,
  filename: 'my-app'
});
```
