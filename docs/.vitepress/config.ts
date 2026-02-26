import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'HJX',
  description: 'The Unified UI Language - One file. HTML + CSS + JS. Zero config.',
  lang: 'en',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  // Set to '/' if deploying to root, or '/repo-name/' for subfolder
  base: '/',

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#6366f1' }]
  ],

  themeConfig: {
    logo: '/favicon.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Language', link: '/language/syntax' },
      { text: 'CLI', link: '/cli/commands' },
      { text: 'API', link: '/api/overview' },
      { text: 'Examples', link: '/examples/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Project Structure', link: '/guide/project-structure' }
          ]
        },
        {
          text: 'Basics',
          items: [
            { text: 'First Component', link: '/guide/first-component' },
            { text: 'State Management', link: '/guide/state' },
            { text: 'Event Handling', link: '/guide/events' },
            { text: 'Styling', link: '/guide/styling' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Server-Driven Mode', link: '/guide/server-driven' },
            { text: 'Component Composition', link: '/guide/components' },
            { text: 'Hot Reload', link: '/guide/hot-reload' },
            { text: 'Production Build', link: '/guide/production' }
          ]
        }
      ],

      '/language/': [
        {
          text: 'Language Reference',
          items: [
            { text: 'Syntax Overview', link: '/language/syntax' },
            { text: 'Component Declaration', link: '/language/component' },
            { text: 'State Block', link: '/language/state' },
            { text: 'Layout Block', link: '/language/layout' },
            { text: 'Style Block', link: '/language/style' },
            { text: 'Handlers Block', link: '/language/handlers' },
            { text: 'Imports', link: '/language/imports' },
            { text: 'Script Block', link: '/language/script' }
          ]
        },
        {
          text: 'Control Flow',
          items: [
            { text: 'Conditionals', link: '/language/conditionals' },
            { text: 'Loops', link: '/language/loops' },
            { text: 'Bindings', link: '/language/bindings' }
          ]
        }
      ],

      '/cli/': [
        {
          text: 'CLI Reference',
          items: [
            { text: 'Commands', link: '/cli/commands' },
            { text: 'Build', link: '/cli/build' },
            { text: 'Dev Server', link: '/cli/dev' },
            { text: 'Parse', link: '/cli/parse' }
          ]
        }
      ],

      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/overview' },
            { text: 'Parser', link: '/api/parser' },
            { text: 'Compiler', link: '/api/compiler' },
            { text: 'Runtime', link: '/api/runtime' },
            { text: 'Server Session', link: '/api/server-session' }
          ]
        }
      ],

      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Counter', link: '/examples/counter' },
            { text: 'Form Binding', link: '/examples/form' },
            { text: 'Todo List', link: '/examples/todo' },
            { text: 'Dashboard', link: '/examples/dashboard' },
            { text: 'Component Composition', link: '/examples/composition' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/loayabdalslam/hjx' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present Loay Abdalslam'
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: 'On this page'
    }
  },

  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
})
