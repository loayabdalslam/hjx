import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { parseHJX } from "./parser.js";
import { parseWithNLP } from "./nlp/advanced-nlp-engine.js";
export async function loadComponentTree(filePath) {
    const src = readFileSync(filePath, "utf-8");
    let ast;
    try {
        // Try strict indentation-based parsing first
        ast = parseHJX(src, filePath);
    }
    catch (e) {
        // If strict parsing fails, it might be plain English
        // We only try NLP if it doesn't look like a completely different file type
        if (src.toLowerCase().includes("component") || src.toLowerCase().includes("display") || src.toLowerCase().includes("show")) {
            console.log(`[Loader] Strict parse failed for ${filePath}, attempting natural language parse...`);
            ast = await parseWithNLP(src);
        }
        else {
            throw e;
        }
    }
    const imports = {};
    const dir = dirname(filePath);
    for (const [alias, importPath] of Object.entries(ast.imports)) {
        const absPath = resolve(dir, importPath);
        // Use .hjx extension if not provided
        const targetPath = absPath.endsWith(".hjx") ? absPath : absPath + ".hjx";
        imports[alias] = await loadComponentTree(targetPath);
    }
    return { ast, path: filePath, imports };
}
