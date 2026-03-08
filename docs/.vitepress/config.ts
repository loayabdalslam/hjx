import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'HJX',
  description: 'The Unified UI Language — One file. HTML + CSS + JS. Zero config.',
  ignoreDeadLinks: true,

  head: [
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
    ['meta', { property: 'og:title', content: 'HJX — Unified UI Language' }],
    ['meta', { property: 'og:description', content: 'Build web UIs from a single .hjx file. Compiles to vanilla HTML/CSS/JS.' }],
  ],

  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Reference', link: '/reference/' },
      { text: 'Examples', link: '/examples/' },
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
            { text: 'Control Flow', link: '/guide/control-flow' },
            { text: 'Components', link: '/guide/components' },
            { text: 'Server-Driven Mode', link: '/guide/server-driven' },
          ]
        },
        {
          text: 'Ecosystem',
          items: [
            { text: 'Vite Plugin & VS Code', link: '/guide/ecosystem' },
          ]
        }
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Overview', link: '/reference/' },
            { text: 'Language Spec', link: '/reference/spec' },
            { text: 'CLI', link: '/reference/cli' },
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
    }
  }
})
