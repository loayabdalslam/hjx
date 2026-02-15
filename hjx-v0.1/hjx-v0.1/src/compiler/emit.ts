import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { RUNTIME_SOURCE } from "./runtime_source.js";

export function emitRuntime(outDir: string) {
  writeFileSync(resolve(outDir, "runtime.js"), RUNTIME_SOURCE, "utf-8");
}
