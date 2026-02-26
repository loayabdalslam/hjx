# Component Declaration

The `component` keyword declares the component name. Each `.hjx` file must have exactly one component declaration.

## Syntax

```hjx
component <Name>
```

- `<Name>` must be **PascalCase** (e.g., `MyComponent`, `UserProfile`)
- Must start with an uppercase letter
- One component per file

## Examples

```hjx
component Counter
```

```hjx
component UserProfile
```

```hjx
component ShoppingCart
```

## Naming Rules

| Valid | Invalid |
|-------|---------|
| `Counter` | `counter` |
| `MyComponent` | `my-component` |
| `User123` | `123User` |
| `Button` | `button` (reserved) |

## Usage

The component name is used for:

1. **CSS scoping** - Generated unique scope attribute
2. **Module exports** - When imported by other components
3. **Debugging** - Shown in browser DevTools

## Example with Full Context

```hjx
component Counter

state:
  count = 0

layout:
  view: "Count: {{count}}"

style:
  view { padding: 16px; }

handlers:
  increment:
    set count = count + 1
```

This compiles to a component with scoped styles and reactive state.

## Best Practices

1. **Use descriptive names** - `UserProfile` > `UP`
2. **Follow PascalCase** - `MyButton` not `myButton`
3. **One component per file** - Split complex UIs into multiple files
