# HJX Documentation

This directory contains the official HJX documentation built with **Docusaurus**.

## Quick Start

```bash
cd docs
npm install
npm start
```

Open `http://localhost:3000` to view the docs locally.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start local dev server with hot reload |
| `npm run build` | Build static site for production |
| `npm run serve` | Serve the built production build locally |
| `npm run deploy` | Deploy to GitHub Pages |
| `npm run clear` | Clear build cache |

## Directory Structure

```
docs/
├── docs/                    # Documentation markdown files
│   ├── intro.md            # Introduction page
│   ├── installation.md     # Installation guide
│   ├── quick-start.md      # Quick start guide
│   ├── flow-state.md       # Flow-State Engine docs
│   ├── nl-css.md           # Natural Language CSS docs
│   ├── grammar-system.md   # Dynamic Grammar docs
│   ├── react-compilation.md # React Compilation docs
│   ├── api-integration.md  # REST API docs
│   ├── benchmarks/         # Benchmarks documentation
│   │   └── index.md
│   └── ...                 # Additional docs
├── src/
│   ├── css/
│   │   └── custom.css      # Custom styles
│   ├── components/         # React components
│   └── pages/              # Custom pages
├── static/
│   └── img/                # Static images
│       └── logo.svg
├── docusaurus.config.js    # Docusaurus configuration
├── sidebars.js             # Sidebar navigation
└── package.json
```

## Deploy to GitHub Pages

### Automatic (GitHub Actions)

Push to `main` branch and the workflow at `.github/workflows/deploy-docs.yml` will automatically build and deploy.

### Manual

```bash
cd docs
GIT_USER=loayabdalslam npm run deploy
```

## Writing Documentation

### Adding New Pages

1. Create a `.md` file in `docs/`
2. Add frontmatter:
   ```markdown
   ---
   sidebar_label: Page Name
   ---
   ```
3. Add the page to `sidebars.js`

### Code Blocks

Use `hjx` for HJX code blocks:

````markdown
```hjx
component Counter
state:
  count = 0
```
````

### Images

Place images in `static/img/` and reference them with:

```markdown
![Alt text](/img/image.png)
```

## Customizing

### Theme

Edit `src/css/custom.css` for custom styles.

### Configuration

Edit `docusaurus.config.js` for:
- Site title and tagline
- Navigation bar items
- Footer links
- GitHub Pages URL

### Sidebar

Edit `sidebars.js` to reorganize navigation.
