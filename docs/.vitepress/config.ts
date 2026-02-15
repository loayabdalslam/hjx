import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'HJX',
  description: 'Unified UI Language',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Reference', link: '/reference/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is HJX?', link: '/guide/' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' }
          ]
        }
      ],
      '/examples/': [
        { text: 'Counter', link: '/examples/counter' },
        { text: 'Form', link: '/examples/form' },
        { text: 'Composition', link: '/examples/composition' }
      ],
      '/reference/': [
        { text: 'Language Spec', link: '/reference/spec' },
        { text: 'CLI', link: '/reference/cli' },
        { text: 'API', link: '/reference/api' }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/loayabdalslam/hjx' }
    ]
  }
})