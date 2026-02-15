import http from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, extname, dirname } from "node:path";
import { WebSocketServer } from "ws";
import chokidar from "chokidar";
import { parseHJX } from "./parser.js";
import { loadComponentTree, LoadedComponent } from "./loader.js";
import { buildServerDriven, runtimeModuleSource } from "./compiler/server_driven.js";
import { ServerSession } from "./server_session.js";
import { HJXAst } from "./types.js";

function contentType(path: string): string {
  const ext = extname(path);
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  return "application/octet-stream";
}

let currentTree: LoadedComponent | null = null;

function buildOnce(inputPath: string, outDir: string) {
  try {
    currentTree = loadComponentTree(inputPath);
    // TODO: buildServerDriven needs to handle the tree
    // For now we pass the root AST, but we need to update it to support the tree
    const bundle = buildServerDriven(currentTree);
    writeFileSync(resolve(outDir, "index.html"), bundle.html, "utf-8");
    writeFileSync(resolve(outDir, "app.css"), bundle.css, "utf-8");
    writeFileSync(resolve(outDir, "app.js"), bundle.js, "utf-8");
    writeFileSync(resolve(outDir, "runtime.js"), runtimeModuleSource(), "utf-8");
  } catch (e) {
    console.error("Build error during load:", e);
    throw e;
  }
}

export async function serveDev(opts: { inputPath: string; outDir: string; port: number }) {
  const { inputPath, outDir, port } = opts;
  buildOnce(inputPath, outDir);

  const watcher = chokidar.watch([dirname(inputPath)], { ignoreInitial: true });
  watcher.on("all", (event, path) => {
    if (path.endsWith(".hjx")) {
        try {
            // Simplified rebuild: just rebuild everything if any hjx changes in dir
            // A better way would be to track dependencies in loader
            buildOnce(inputPath, outDir);
            console.log("Rebuilt.");
        } catch (e: any) {
            console.error("Build error:", e?.message ?? e);
        }
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

  const wss = new WebSocketServer({ server, path: "/hjx" });

  wss.on("connection", async (ws) => {
    if (!currentTree) {
      ws.close();
      return;
    }

    // Use outDir as workDir for sessions
    const session = new ServerSession(currentTree, outDir);
    await session.ready();

    // Send initial state
    ws.send(JSON.stringify({ type: "state", payload: session.getState() }));

    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === "event") {
            try {
                const patch = session.runHandler(msg.name);
                if (patch) {
                    ws.send(JSON.stringify({ type: "patch", payload: patch }));
                }
            } catch (err: any) {
                console.error("Handler error:", err);
            }
        } else if (msg.type === "state_update") {
            session.updateState(msg.payload);
        }
      } catch (e) {
        console.error("WS Message error", e);
      }
    });

    ws.on("close", () => {
      session.cleanup();
    });
  });

  await new Promise<void>((resolvePromise) => {
    server.listen(port, () => {
      console.log(`Dev server: http://localhost:${port}`);
      resolvePromise();
    });
  });
}
