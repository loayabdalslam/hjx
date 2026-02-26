# Parser API

The parser converts HJX source code into an Abstract Syntax Tree (AST).

## Usage

```javascript
import { parse } from './dist/parser.js';

const ast = parse(`
  component Counter
  state:
    count = 0
  layout:
    view: "Count: {{count}}"
`);

console.log(ast);
```

## Functions

### parse(source: string): AST

Parse HJX source code and return an AST.

```javascript
const ast = parse(hjxSourceCode);
```

### parseFile(path: string): AST

Parse an HJX file directly.

```javascript
import { parseFile } from './dist/parser.js';

const ast = parseFile('./components/Counter.hjx');
```

## AST Types

### Component

```typescript
interface Component {
  type: 'Component';
  name: string;
  imports?: Import[];
  state?: StateVariable[];
  script?: Script;
  layout?: Element;
  style?: StyleRule[];
  handlers?: Handler[];
}
```

### Element

```typescript
interface Element {
  type: 'Element';
  tag: string;
  id?: string;
  classes?: string[];
  attributes?: Attribute[];
  children?: Node[];
}
```

### StateVariable

```typescript
interface StateVariable {
  name: string;
  value: Expression;
}
```

### Handler

```typescript
interface Handler {
  name: string;
  statements: Statement[];
}
```

### Statement

```typescript
type Statement = SetStatement | LogStatement | IfStatement;
```

## Error Handling

```javascript
import { parse, ParseError } from './dist/parser.js';

try {
  const ast = parse(source);
} catch (error) {
  if (error instanceof ParseError) {
    console.error(`Parse error at line ${error.line}: ${error.message}`);
  }
}
```

## Options

```javascript
const ast = parse(source, {
  filename: 'Counter.hjx',
  sourceMap: true
});
```

## Validation

The parser performs syntax validation:

```javascript
const result = parse(source);
// Throws on invalid syntax
```

## Examples

### Simple Component

```javascript
const ast = parse(`
  component Counter
  state:
    count = 0
  layout:
    view: "Count: {{count}}"
`);

console.log(ast.name); // 'Counter'
console.log(ast.state[0].name); // 'count'
console.log(ast.state[0].value.value); // 0
```

### With Imports

```javascript
const ast = parse(`
  component App
  imports:
    Button from "./Button.hjx"
  state:
    label = "Click me"
  layout:
    Button: "{{label}}"
`);
```

### With Handlers

```javascript
const ast = parse(`
  component Counter
  state:
    count = 0
  layout:
    button (on click -> increment): "+"
  handlers:
    increment:
      set count = count + 1
`);

console.log(ast.handlers[0].name); // 'increment'
console.log(ast.handlers[0].statements[0].type); // 'SetStatement'
```
