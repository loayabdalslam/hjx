# What is HJX?

HJX is a unified UI language that lets you build web user interfaces using a single `.hjx` file. It compiles down to standard HTML, CSS, and JavaScript, giving you the power of component-based development without framework lock-in.

## Why HJX?

- **Unified Syntax**: Structure, styling, and behavior in one place
- **Reactive**: Built-in state management and data binding
- **Vanilla Output**: No runtime dependencies or framework overhead
- **Developer Experience**: Clean, readable syntax with hot reload development server

## How It Works

HJX files contain blocks that define different aspects of your component:

- `component`: The component name
- `state`: Reactive variables
- `layout`: The UI structure
- `style`: CSS rules (automatically scoped)
- `handlers`: Event handler logic

The HJX compiler processes these blocks and generates vanilla web code that runs in any browser.

---

**Next:** [Installation →](/guide/installation)