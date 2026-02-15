# Getting Started

## Installation

First, clone the repository and install dependencies:

```bash
git clone https://github.com/loayabdalslam/hjx.git
cd hjx
npm install
npm run build
```

## Your First Component

Create a file called `hello.hjx`:

```hjx
component Hello

state:
  name = "World"

layout:
  view.card:
    text: "Hello {{name}}!"
    input (bind value <-> name)

style:
  .card {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: system-ui, sans-serif;
  }
```

## Build and Run

Build your component:

```bash
node dist/cli.js build hello.hjx --out dist-app
```

Start the development server:

```bash
node dist/cli.js dev hello.hjx --out dist-app --port 5173
```

Open http://localhost:5173 in your browser!

## CLI Commands

- `hjx parse <file.hjx>` - Parse and show AST
- `hjx build <file.hjx> --out <dir>` - Build to static files
- `hjx dev <file.hjx> --out <dir> --port <n>` - Start dev server