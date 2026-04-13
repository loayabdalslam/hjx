#!/usr/bin/env bash
# Deploy HJX Documentation to GitHub Pages
# Usage: ./deploy.sh

set -e

echo "🚀 Building HJX Documentation..."

cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Build
echo "🔨 Building VitePress..."
GITHUB_PAGES=true npm run docs:build

# Deploy to GitHub Pages
echo "📤 Deploying to GitHub Pages..."

# Use npx gh-pages to deploy the built docs
npx gh-pages -d .vitepress/dist --dotfiles

echo ""
echo "✅ Deployed successfully!"
echo "🌐 View at: https://loayabdalslam.github.io/hjx/"
echo ""
echo "Note: It may take a few minutes for changes to appear."
