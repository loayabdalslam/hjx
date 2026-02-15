
import { parseHJX } from "./src/parser.js";

const code = `
component TestAttrs

layout:
  view:
    button (disabled class="btn" on click -> handleClick): "Click me"
    input (type="text" placeholder="Enter name" bind value <-> name)
`;

try {
  const ast = parseHJX(code);
  console.log(JSON.stringify(ast.layout, null, 2));
} catch (e) {
  console.error(e);
}
