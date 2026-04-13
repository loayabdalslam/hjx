#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { parseHJX } from "./parser.js";
import { buildVanilla } from "./compiler/vanilla.js";
import { buildReact } from "./compiler/react.js";
import { emitRuntime } from "./compiler/emit.js";
import { serveDev } from "./devserver.js";
import { runFlow } from "./nlp/flow/cli.js";

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
  console.log(`HJX v0.2 — Flow-State Enabled
Usage:
  hjx parse <file.hjx>
  hjx build <file.hjx> --out <dir> [--target react] [--backend]
  hjx dev <file.hjx> --out <dir> --port <n>
  hjx flow "natural language description"

Flow Commands:
  hjx flow "create a counter component"
  hjx flow --file input.txt
  hjx flow --grammar custom.yml "make a todo app"
  hjx flow --compile "create a form"

Options:
  --target <name>   Compilation target: vanilla (default) or react
  --backend         Generate Express.js backend routes (requires --target react)

Examples:
  hjx parse examples/counter.hjx
  hjx build examples/counter.hjx --out dist-app
  hjx build examples/todo-app.hjx --out dist-app --target react --backend
  hjx dev examples/counter.hjx --out dist-app --port 5173
  hjx flow "create a dashboard with stats and charts"
`);
}

async function main() {
  const { cmd, file, args } = parseArgs(process.argv.slice(2));

  // Handle flow command separately
  if (cmd === "flow") {
    await runFlow(process.argv.slice(3));
    return;
  }

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
    const target = String(args["target"] ?? "vanilla");
    const withBackend = args["backend"] === true;

    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

    if (target === "react") {
      // React compilation target
      const bundle = buildReact(ast, { backend: withBackend });

      // Determine component name for file naming
      const compName = ast.component.name;

      writeFileSync(resolve(outDir, `${compName}.tsx`), bundle.component, "utf-8");
      writeFileSync(resolve(outDir, `${compName}.module.css`), bundle.styles, "utf-8");

      if (bundle.apiRoutes && bundle.apiHandlers) {
        const apiDir = resolve(outDir, "api");
        if (!existsSync(apiDir)) mkdirSync(apiDir, { recursive: true });
        writeFileSync(resolve(apiDir, "routes.ts"), bundle.apiRoutes, "utf-8");
        writeFileSync(resolve(apiDir, "handlers.ts"), bundle.apiHandlers, "utf-8");
        console.log(`Built React component + API to: ${outDir}`);
      } else {
        console.log(`Built React component to: ${outDir}`);
      }
    } else {
      // Vanilla compilation (default)
      const bundle = buildVanilla(ast);
      writeFileSync(resolve(outDir, "index.html"), bundle.html, "utf-8");
      writeFileSync(resolve(outDir, "app.css"), bundle.css, "utf-8");
      writeFileSync(resolve(outDir, "app.js"), bundle.js, "utf-8");
      emitRuntime(outDir);
      console.log(`Built to: ${outDir}`);
    }
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
