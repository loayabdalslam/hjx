import { parseHJX } from "../../dist/parser.js";
import { buildVanilla } from "../../dist/compiler/vanilla.js";

/**
 * @returns {import('vite').Plugin}
 */
export default function vitePluginHJX() {
  return {
    name: 'vite-plugin-hjx',

    transform(code, id) {
      if (!id.endsWith('.hjx')) return null;

      try {
        const ast = parseHJX(code, id);
        const { html, css, js } = buildVanilla(ast);

        // For Vite, we want to export a component or a mount function.
        // We also want to inject the CSS.

        // Simpler approach for v0.1:
        // We inject the CSS into the document head and export a mountApp function.

        const transformedCode = `
const css = ${JSON.stringify(css)};
if (typeof document !== 'undefined') {
  const styleId = "hjx-style-" + ${JSON.stringify(ast.component.name)};
  let style = document.getElementById(styleId);
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    document.head.appendChild(style);
  }
  style.textContent = css;
}

${js.replace('export function mountApp()', 'export function mountApp(root)')
            .replace('const root = document.getElementById("app");', 'if (!root) throw new Error("Missing root element");')
            .replace('root.setAttribute("data-hjx-scope", SCOPE);', 'root.setAttribute("data-hjx-scope", SCOPE); root.innerHTML = "";')
            .replace('mountApp();', '')}

export default {
  mount: (el) => mountApp(el || document.getElementById('app'))
};

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      // For v0.1: simple re-mount. In better version, we'd diff the state.
      const root = document.querySelector('[data-hjx-scope="' + SCOPE + '"]');
      if (root) newModule.default.mount(root);
    }
  });
}
`;

        return {
          code: transformedCode,
          map: null // TODO: Add source maps
        };
      } catch (err) {
        this.error(err.message);
      }
    }
  };
}
