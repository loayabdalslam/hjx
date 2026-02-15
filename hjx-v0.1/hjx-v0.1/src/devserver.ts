import http from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, extname } from "node:path";
import chokidar from "chokidar";
import { parseHJX } from "./parser.js";
import { buildVanilla } from "./compiler/vanilla.js";
import { emitRuntime } from "./compiler/emit.js";

function contentType(path: string): string {
  const ext = extname(path);
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  return "application/octet-stream";
}

function buildOnce(inputPath: string, outDir: string) {
  const src = readFileSync(inputPath, "utf-8");
  const ast = parseHJX(src, inputPath);
  const bundle = buildVanilla(ast);
  writeFileSync(resolve(outDir, "index.html"), bundle.html, "utf-8");
  writeFileSync(resolve(outDir, "app.css"), bundle.css, "utf-8");
  writeFileSync(resolve(outDir, "app.js"), bundle.js, "utf-8");
  emitRuntime(outDir);
}

export async function serveDev(opts: { inputPath: string; outDir: string; port: number }) {
  const { inputPath, outDir, port } = opts;
  buildOnce(inputPath, outDir);

  const watcher = chokidar.watch([inputPath], { ignoreInitial: true });
  watcher.on("all", () => {
    try {
      buildOnce(inputPath, outDir);
      console.log("Rebuilt.");
    } catch (e: any) {
      console.error("Build error:", e?.message ?? e);
    }
  });

  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = resolve(outDir, "." + pathname);
    try {
      const data = readFileSync(filePath);
      res.writeHead(200, { "Content-Type": contentType(filePath), "Cache-Control": "no-store" });
      res.end(data);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
    }
  });

  await new Promise<void>((resolvePromise) => {
    server.listen(port, () => {
      console.log(`Dev server: http://localhost:${port}`);
      resolvePromise();
    });
  });
}
