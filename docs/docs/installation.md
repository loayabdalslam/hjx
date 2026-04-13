---
sidebar_label: Installation
---

# Installation

Get HJX running in under 2 minutes.

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher (comes with Node.js)

## Install

```bash
# Clone the repository
git clone https://github.com/loayabdalslam/hjx.git
cd hjx

# Install dependencies
npm install

# Build the compiler
npm run build
```

That's it! You're ready to go.

## Verify Installation

```bash
# Check the CLI works
node dist/cli.js help

# Run a test
node dist/cli.js flow "create a counter"
```

You should see generated HJX code.

## Optional: Global Install

```bash
# Create a symlink (optional)
npm link

# Now you can use hjx globally
hjx flow "create a form"
hjx build examples/counter.hjx --out dist-app
```

## Project Structure

```
hjx/
├── src/              # TypeScript source
│   ├── cli.ts        # CLI entry point
│   ├── parser.ts     # HJX parser
│   ├── compiler/     # Compilation targets
│   └── nlp/          # NLP & Flow-State engine
├── examples/         # Example .hjx files
├── grammar.yml       # User-editable grammar
├── docs/             # This documentation
└── package.json
```

## Next

- [Quick Start](./quick-start) — Build your first HJX app
- [CLI Reference](./cli-reference) — All commands explained
