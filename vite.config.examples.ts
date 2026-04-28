import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: '/examples-showcase.html',
    middlewareMode: false,
  },
  build: {
    outDir: 'dist-examples',
    emptyOutDir: true,
  },
  plugins: [
    {
      name: 'hjx-loader',
      resolveId(id) {
        if (id.endsWith('.hjx')) {
          return id
        }
      },
      load(id) {
        if (id.endsWith('.hjx')) {
          const content = fs.readFileSync(id, 'utf-8')
          return `export default ${JSON.stringify(content)}`
        }
      },
    },
  ],
})
