#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { parseHJX } from "./parser.js";
import { buildVanilla } from "./compiler/vanilla.js";
import { emitRuntime } from "./compiler/emit.js";
import { serveDev } from "./devserver.js";

type Args = Record<string, string | boolean>;

function parseArgs(argv: string[]): { cmd: string; file?: string; args: Args } {
  const [cmd, file, ...rest] = argv;
  const args: Args = {};
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = rest[i + 1];
      if (!next || next.startsWith("--")) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    }
  }
  return { cmd: cmd ?? "help", file, args };
}

function help() {
  console.log(`HJX v0.1
Usage:
  hjx parse <file.hjx>
  hjx build <file.hjx> --out <dir>
  hjx dev <file.hjx> --out <dir> --port <n>

Examples:
  hjx parse examples/counter.hjx
  hjx build examples/counter.hjx --out dist-app
  hjx dev examples/counter.hjx --out dist-app --port 5173
`);
}

async function main() {
  const { cmd, file, args } = parseArgs(process.argv.slice(2));
  if (cmd === "help" || !cmd) return help();
  if (!file && cmd !== "help") {
    console.error("Missing <file.hjx>");
    process.exit(1);
  }
  const inputPath = resolve(file!);
  const outDir = resolve(String(args["out"] ?? "dist-app"));
  const port = Number(args["port"] ?? "5173");

  const src = readFileSync(inputPath, "utf-8");
  const ast = parseHJX(src, inputPath);

  if (cmd === "parse") {
    console.log(JSON.stringify(ast, null, 2));
    return;
  }

  if (cmd === "build") {
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    const bundle = buildVanilla(ast);
    writeFileSync(resolve(outDir, "index.html"), bundle.html, "utf-8");
    writeFileSync(resolve(outDir, "app.css"), bundle.css, "utf-8");
    writeFileSync(resolve(outDir, "app.js"), bundle.js, "utf-8");
    emitRuntime(outDir);
    console.log(`Built to: ${outDir}`);
    return;
  }

  if (cmd === "dev") {
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
    await serveDev({ inputPath, outDir, port });
    return;
  }

  console.error(`Unknown command: ${cmd}`);
  help();
  process.exit(1);
}

main().catch((e) => {
  console.error(e?.stack ?? String(e));
  process.exit(1);
});
