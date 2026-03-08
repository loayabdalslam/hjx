import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { parseHJX } from "./parser.js";
export function loadComponentTree(filePath) {
    const src = readFileSync(filePath, "utf-8");
    const ast = parseHJX(src, filePath);
    const imports = {};
    const dir = dirname(filePath);
    for (const [alias, importPath] of Object.entries(ast.imports)) {
        const absPath = resolve(dir, importPath);
        imports[alias] = loadComponentTree(absPath);
    }
    return { ast, path: filePath, imports };
}
