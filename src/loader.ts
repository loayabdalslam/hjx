import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { parseHJX } from "./parser.js";
import { HJXAst } from "./types.js";

export type LoadedComponent = {
  ast: HJXAst;
  path: string;
  imports: Record<string, LoadedComponent>;
};

export function loadComponentTree(filePath: string): LoadedComponent {
  const src = readFileSync(filePath, "utf-8");
  const ast = parseHJX(src, filePath);

  const imports: Record<string, LoadedComponent> = {};
  const dir = dirname(filePath);

  for (const [alias, importPath] of Object.entries(ast.imports)) {
    const absPath = resolve(dir, importPath);
    imports[alias] = loadComponentTree(absPath);
  }

  return { ast, path: filePath, imports };
}
