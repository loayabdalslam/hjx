
import { parseHJX } from "./src/parser.js";

const code = `
component App

imports:
  Counter from "./counter.hjx"

state:
  x = 1

script:
  console.log("Hello from script");
  import { v4 } from "uuid";

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
