# HJX Documentation

This directory contains the documentation website for HJX, built with VitePress.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

## Structure

- `docs/index.md` - Home page
- `docs/guide/` - Getting started guides
- `docs/examples/` - Code examples
- `docs/reference/` - API and language reference
- `docs/.vitepress/` - VitePress configuration

## Contributing

When adding new documentation:

1. Create or edit `.md` files in the appropriate directory
2. Follow the existing structure and formatting
3. Test locally with `npm run docs:dev`
4. Update the sidebar navigation in `docs/.vitepress/config.ts` if needed