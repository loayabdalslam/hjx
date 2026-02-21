# Installation

## Prerequisites

- Node.js 18+
- npm or yarn

## From Source

```bash
git clone https://github.com/loayabdalslam/hjx.git
cd hjx
npm install
npm run build
```

The CLI will be available at `dist/cli.js`.

## Usage

After building, you can use the CLI:

```bash
# Parse a .hjx file
node dist/cli.js parse examples/counter.hjx

# Build to static files
node dist/cli.js build examples/counter.hjx --out dist-app

# Start development server
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5173
```

## Development

To modify HJX itself:

```bash
npm run build  # Build TypeScript
npm run dev    # Start dev server with an example
```

---

**Next:** [Getting Started →](/guide/getting-started)
```