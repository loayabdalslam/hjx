# HJX Documentation - VitePress

## Quick Start

```bash
cd docs
npm install
npm run docs:dev
```

Open http://localhost:5173

## Build

```bash
npm run docs:build
```

Output: `.vitepress/dist/`

## Deploy to GitHub Pages

### Option 1: GitHub Actions (Automatic)
Push to `main` branch → Auto-deploys

### Option 2: Manual Deploy

```bash
# Install gh-pages
npm install -g gh-pages

# Build and deploy
cd docs
npm run docs:build
npx gh-pages -d .vitepress/dist
```

## Configuration

**Base URL**: `/hjx/` (set in `.vitepress/config.ts`)

**GitHub Pages URL**: `https://loayabdalslam.github.io/hjx/`

## File Structure

```
docs/
├── .vitepress/          # VitePress config
│   └── config.ts        # Main config file
├── guide/               # User guide
├── reference/           # API reference
├── examples/            # Code examples
└── index.md             # Homepage
```

## Troubleshooting

### 404 on GitHub Pages
- Check `base: '/hjx/'` in config.ts matches repo name
- Ensure GitHub Pages is enabled in repo settings
- Check GitHub Actions workflow ran successfully

### Broken Links
- Use absolute paths: `/guide/getting-started`
- Or relative: `./getting-started.md`

### Build Fails
- Node version >= 18 required
- Run `npm install` in docs folder
- Check for MDX syntax errors
