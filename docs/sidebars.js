// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: ['installation', 'quick-start', 'cli-reference'],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: ['syntax', 'state', 'layout', 'handlers', 'styling', 'control-flow', 'components'],
    },
    {
      type: 'category',
      label: 'v0.2 Features',
      items: [
        'flow-state',
        'nl-css',
        'grammar-system',
        'react-compilation',
        'api-integration',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: ['server-driven', 'vite-plugin', 'ecosystem'],
    },
    {
      type: 'category',
      label: 'Reference',
      items: ['spec', 'api-reference'],
    },
    'benchmarks/index',
  ],
};

module.exports = sidebars;
