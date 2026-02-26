import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/hjx/',
  title: 'HJX',
  description: 'A compiled UI language that unifies structure, style, and logic into a single .hjx file',
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'HJX',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Syntax', link: '/guide/syntax' },
      { text: 'Examples', link: '/examples/' },
      { text: 'API', link: '/reference/api' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Your First Component', link: '/guide/first-component' }
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Syntax', link: '/guide/syntax' },
            { text: 'State Management', link: '/guide/state' },
            { text: 'Components', link: '/guide/components' },
            { text: 'Styling', link: '/guide/styling' },
            { text: 'Handlers', link: '/guide/handlers' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Server-Driven Mode', link: '/guide/server-driven' },
            { text: 'CLI Commands', link: '/guide/cli' }
          ]
        }
      ],
      '/reference/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Runtime API', link: '/reference/api' },
            { text: 'Compiler API', link: '/reference/compiler' },
            { text: 'TypeScript Types', link: '/reference/types' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Counter', link: '/examples/counter' },
            { text: 'Conditional Rendering', link: '/examples/conditional' },
            { text: 'Forms', link: '/examples/form' },
            { text: 'Lists', link: '/examples/list' },
            { text: 'Composition', link: '/examples/composition' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/anomalyco/hjx' }
    ],
    footer: {
      message: 'Released under the MIT License',
      copyright: 'Copyright © 2026-present HJX'
    },
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3]
    }
  },
  markdown: {
    lineNumbers: true
  }
})
