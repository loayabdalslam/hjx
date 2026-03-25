# Installation

## Prerequisites

- Node.js 20 or later
- npm (comes with Node.js)

## Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/loayabdalslam/hjx.git
cd hjx
npm install
```

Build the compiler:

```bash
npm run build
```

## Verify Installation

```bash
# Check that the CLI works
node dist/cli.js help
```

You should see:

```
HJX v0.1
Usage:
  hjx parse <file.hjx>
  hjx build <file.hjx> --out <dir>
  hjx dev <file.hjx> --out <dir> --port <n>
```

## Project Structure

After cloning, your project looks like this:

```
hjx/
├── src/                  # Compiler source code
│   ├── parser.ts         # HJX parser
│   ├── compiler/         # Code generation
│   ├── cli.ts            # CLI entry point
│   └── nlp/              # NLP engine
├── examples/             # Example .hjx files
├── docs/                 # Documentation (VitePress)
├── dist/                 # Compiled output
└── package.json
```

## Running Examples

```bash
# Build the compiler
npm run build

# Run the counter example
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5172

# Open http://localhost:5172 in your browser
```

## NLP Engine (Optional)

The NLP engine is included in the project at `src/nlp/`. It provides:

- Intent classification (natural language → HJX intent)
- Entity extraction (extract component names, state vars, etc.)
- Code generation from natural language descriptions
- Error detection and auto-correction
- Code completion and semantic search

All NLP components are pure TypeScript with no external ML dependencies required.

```bash
# Run NLP tests
npm test -- src/nlp
```
