// @ts-check
const {themes} = require('prism-react-renderer');

const lightTheme = themes.github;
const darkTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'HJX',
  tagline: 'The Unified UI Language — One file. HTML + CSS + JS. Zero config.',
  favicon: 'img/favicon.ico',
  url: 'https://loayabdalslam.github.io',
  baseUrl: '/hjx/',
  organizationName: 'loayabdalslam',
  projectName: 'hjx',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/loayabdalslam/hjx/tree/main/docs/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/loayabdalslam/hjx/tree/main/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/hjx-social-card.png',
      navbar: {
        title: 'HJX',
        logo: {
          alt: 'HJX Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            type: 'doc',
            docId: 'benchmarks/index',
            position: 'left',
            label: 'Benchmarks',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/loayabdalslam/hjx',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {label: 'Getting Started', to: '/docs/intro'},
              {label: 'Flow-State Engine', to: '/docs/flow-state'},
              {label: 'Natural Language CSS', to: '/docs/nl-css'},
              {label: 'React Compilation', to: '/docs/react-compilation'},
              {label: 'REST API Integration', to: '/docs/api-integration'},
              {label: 'Benchmarks', to: '/docs/benchmarks'},
            ],
          },
          {
            title: 'Community',
            items: [
              {label: 'GitHub Discussions', href: 'https://github.com/loayabdalslam/hjx/discussions'},
            ],
          },
          {
            title: 'More',
            items: [
              {label: 'Blog', to: '/blog'},
              {label: 'GitHub', href: 'https://github.com/loayabdalslam/hjx'},
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Loay Abdalslam. Built with Docusaurus.`,
      },
      prism: {
        theme: lightTheme,
        darkTheme: darkTheme,
        additionalLanguages: ['javascript', 'typescript', 'bash', 'json', 'yaml', 'css'],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

module.exports = config;
