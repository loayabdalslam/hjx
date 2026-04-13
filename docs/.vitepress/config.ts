import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'HJX',
  description: 'The Unified UI Language — One file. HTML + CSS + JS. Zero config. Write in English or code.',

  // GitHub Pages deployment
  base: process.env.GITHUB_PAGES ? '/hjx/' : '/',

  ignoreDeadLinks: true,
  cleanUrls: true,

  head: [
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
    ['meta', { property: 'og:title', content: 'HJX — Unified UI Language' }],
    ['meta', { property: 'og:description', content: 'Build web UIs from a single .hjx file. Compiles to vanilla HTML/CSS/JS.' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Reference', link: '/reference/spec' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Flow-State', link: '/guide/flow-state' },
      { text: 'NLP Engine', link: '/guide/nlp-engine' },
      { text: 'GitHub', link: 'https://github.com/loayabdalslam/hjx' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is HJX?', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Getting Started', link: '/guide/getting-started' },
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Syntax', link: '/guide/syntax' },
            { text: 'State', link: '/guide/state' },
            { text: 'Components', link: '/guide/components' },
            { text: 'Styling', link: '/guide/styling' },
            { text: 'Handlers', link: '/guide/handlers' },
            { text: 'Control Flow', link: '/guide/control-flow' },
          ]
        },
        {
          text: 'v0.2 New Features',
          items: [
            { text: 'Flow-State Engine', link: '/guide/flow-state' },
            { text: 'Natural Language CSS', link: '/guide/nl-css' },
            { text: 'React Compilation', link: '/guide/react-compilation' },
            { text: 'REST API Integration', link: '/guide/api-integration' },
            { text: 'Dynamic Grammar (grammar.yml)', link: '/guide/grammar-system' },
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Server-Driven Mode', link: '/guide/server-driven' },
            { text: 'CLI', link: '/guide/cli' },
            { text: 'NLP Engine', link: '/guide/nlp-engine' },
            { text: 'Benchmarks', link: '/guide/benchmarks' },
          ]
        },
        {
          text: 'Ecosystem',
          items: [
            { text: 'Ecosystem & Tools', link: '/guide/ecosystem' },
          ]
        }
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Language Spec', link: '/reference/spec' },
            { text: 'CLI Commands', link: '/reference/cli' },
            { text: 'API', link: '/reference/api' },
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Counter', link: '/examples/counter' },
            { text: 'Form', link: '/examples/form' },
            { text: 'Todo List', link: '/examples/list' },
            { text: 'Conditional', link: '/examples/conditional' },
            { text: 'Composition', link: '/examples/composition' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/loayabdalslam/hjx' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: '© 2026 Loay Abdalslam'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/loayabdalslam/hjx/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Last updated'
    }
  },

  // Apply v-pre to all code blocks to prevent Vue interpolation
  vite: {
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => false
        }
      }
    }
  }
})
