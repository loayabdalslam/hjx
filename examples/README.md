# HJX Examples

## Structure
- `plain-english/`: Plain English text inputs for the HJX NLP Flow-State Engine
- `semi-hjx/`: Files mixing English descriptions and HJX code (hybrid syntax)
- `react/`: HJX files designed to compile to React components
- `01-beginner-counter.hjx` through `05-advanced-ecommerce.hjx`: Standard HJX examples

## Example Types

### Plain English NLP Examples
Natural language inputs that get converted to HJX via the Flow-State Engine:
```bash
hjx flow "$(cat plain-english/01-counter.txt)"
```

### Semi-HJX Examples
Mix of English comments and HJX code:
```bash
hjx parse semi-hjx/01-counter.hjx
```

### React Integration Examples
HJX files that compile to full React TypeScript components:
```bash
hjx build react/01-counter.hjx --target react --out dist-react
```

## Running Examples
```bash
# Parse any example
hjx parse examples/react/01-counter.hjx

# Build to React
hjx build examples/react/01-counter.hjx --target react --out dist

# Use NLP engine
hjx flow "create a counter component"
```
