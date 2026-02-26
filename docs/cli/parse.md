# Parse Command

The `parse` command parses an HJX file and outputs the Abstract Syntax Tree (AST).

## Basic Usage

```bash
node dist/cli.js parse <file.hjx>
```

## Options

| Option | Description |
|--------|-------------|
| `--pretty` | Pretty-print JSON output |
| `--json` | Output as JSON (default) |

## Examples

### Basic Parse

```bash
node dist/cli.js parse examples/counter.hjx
```

Output:

```json
{"type":"Component","name":"Counter","state":[{"name":"count","value":{"type":"Literal","value":0}}],"layout":{"type":"Element","tag":"view","children":[{"type":"Element","tag":"text","children":[{"type":"Text","value":"Count: "},{"type":"Interpolation","expression":"count"}]}]}}
```

### Pretty Print

```bash
node dist/cli.js parse examples/counter.hjx --pretty
```

Output:

```json
{
  "type": "Component",
  "name": "Counter",
  "state": [
    {
      "name": "count",
      "value": {
        "type": "Literal",
        "value": 0
      }
    }
  ],
  ...
}
```

## AST Structure

### Component Node

```typescript
{
  type: 'Component',
  name: string,
  imports?: Import[],
  state?: StateVariable[],
  script?: Script,
  layout?: Element,
  style?: StyleRule[],
  handlers?: Handler[]
}
```

### Element Node

```typescript
{
  type: 'Element',
  tag: string,
  id?: string,
  classes?: string[],
  attributes?: Attribute[],
  children?: Node[]
}
```

### State Variable

```typescript
{
  name: string,
  value: Expression
}
```

### Handler

```typescript
{
  name: string,
  statements: Statement[]
}
```

## Use Cases

### Debugging

See how the parser interprets your code:

```bash
node dist/cli.js parse app.hjx --pretty | head -50
```

### Learning

Understand HJX's internal representation:

```bash
node dist/cli.js parse examples/form.hjx --pretty
```

### Testing

Verify parser output in tests.

## Programmatic Usage

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

## Error Messages

If parsing fails:

```
Error: Parse error at line 5
  4 | layout:
  5 |   view missing colon
         ^
```

## Validation

The parser validates:
- Syntax correctness
- Proper indentation
- Valid element names
- Handler references

## Next Steps

After parsing, the AST is passed to the compiler for code generation.
