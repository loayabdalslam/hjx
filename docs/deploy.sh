#!/bin/bash
# Deploy HJX Docs to GitHub Pages

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
npm run docs:build

# Deploy
echo "📤 Deploying to GitHub Pages..."
npx gh-pages -d .vitepress/dist -t true

echo "✅ Deployed to GitHub Pages!"
echo "🌐 View at: https://loayabdalslam.github.io/hjx/"
