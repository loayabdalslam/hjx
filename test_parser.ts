
import { parseHJX } from "./src/parser.js";

const code = `
component App

imports:
  Counter from "./counter.hjx"

state:
  x = 1

layout:
  view:
    Counter: "hello"
`;

try {
  const ast = parseHJX(code);
  console.log(JSON.stringify(ast, null, 2));
} catch (e) {
  console.error(e);
}
