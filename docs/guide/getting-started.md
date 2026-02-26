# Getting Started

Welcome to HJX! This guide will walk you through setting up HJX and building your first component.

## Prerequisites

Before you begin, make sure you have:

- **Node.js** v18 or higher
- **npm** v9 or higher (or yarn/pnpm)

You can verify your Node.js version by running:

```bash
node --version
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/loayabdalslam/hjx.git
cd hjx
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Compiler

```bash
npm run build
```

This compiles the TypeScript source to JavaScript. The CLI will be available at `dist/cli.js`.

## Your First Component

Create a file called `hello.hjx`:

```hjx
component Hello

state:
  name = "World"

layout:
  view.card:
    text.title: "Hello {{name}}!"
    input (bind value <-> name)

style:
  .card {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: system-ui, sans-serif;
  }
  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 12px;
  }
```

## Build and Run

### Build to Static Files

```bash
node dist/cli.js build hello.hjx --out dist-app
```

This generates:
- `dist-app/index.html` - The HTML page
- `dist-app/app.css` - Scoped CSS styles
- `dist-app/app.js` - JavaScript runtime and component

### Start Development Server

```bash
node dist/cli.js dev hello.hjx --out dist-app --port 5173
```

Open http://localhost:5173 in your browser!

The dev server includes:
- **Hot Module Replacement (HMR)** - Changes reload instantly
- **Live reload** - Browser refreshes on file changes
- **Error overlay** - Shows compilation errors in the browser

## Parse and Inspect AST

To see how HJX parses your component into an Abstract Syntax Tree:

```bash
node dist/cli.js parse hello.hjx
```

This is useful for debugging and understanding how the compiler works.

## Project Structure

A typical HJX project looks like:

```
my-project/
├── components/
│   ├── Button.hjx
│   ├── Card.hjx
│   └── Input.hjx
├── pages/
│   ├── home.hjx
│   └── about.hjx
├── dist-app/          # Compiled output
└── hjx.config.js     # Optional config
```

## What Just Happened?

Let's break down what each part of the `.hjx` file does:

| Block | Purpose |
|-------|---------|
| `component` | Declares the component name |
| `state` | Defines reactive variables |
| `layout` | Defines the UI structure |
| `style` | Defines scoped CSS |
| `handlers` | Defines event handlers |

## Next Steps

Now that you have HJX running, explore these topics:

- [State Management](/guide/state) - Learn about reactive state
- [Event Handling](/guide/events) - Handle user interactions
- [Styling](/guide/styling) - Write scoped CSS
- [Control Flow](/language/conditionals) - Conditionals and loops
- [Server-Driven Mode](/guide/server-driven) - Real-time updates from server

## Need Help?

- Found a bug? [Open an issue](https://github.com/loayabdalslam/hjx/issues)
- Have questions? [Join our Discord](https://discord.gg/hjx)
- Want to contribute? [Check out the repo](https://github.com/loayabdalslam/hjx)
