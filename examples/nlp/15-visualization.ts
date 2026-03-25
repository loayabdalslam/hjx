// =============================================================================
// NLP Example 15: Visualization
// =============================================================================
// Generate HTML visualizations for ASTs, feature dashboards, and
// component comparisons.
//
// Run: npx tsx examples/nlp/15-visualization.ts
// Then open: dist/nlp-visual/dashboard.html
// =============================================================================

import { readFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import {
  FeatureVisualizer,
  FeatureStore,
  extractFeatures,
} from "../../src/nlp/index.js";

// ─── Setup ───────────────────────────────────────────────────────────────────

const outputDir = resolve(process.cwd(), "dist", "nlp-visual");
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Load examples
const examplesDir = resolve(process.cwd(), "examples");
const files: { path: string; name: string; source: string }[] = [];

function walkDir(dir: string) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "nlp" && entry.name !== "projects") {
      walkDir(fullPath);
    } else if (entry.name.endsWith(".hjx")) {
      files.push({
        path: fullPath,
        name: entry.name.replace(".hjx", ""),
        source: readFileSync(fullPath, "utf-8"),
      });
    }
  }
}
walkDir(examplesDir);

// ─── Build Feature Store ─────────────────────────────────────────────────────

const store = new FeatureStore();
for (const file of files) {
  const features = extractFeatures(file.source, file.name);
  store.addComponent(file.path, file.source, features);
}

const visualizer = new FeatureVisualizer(store, {
  outputPath: outputDir,
  title: "HJX Component Analysis Dashboard",
});

// ─── Generate AST Visualization ──────────────────────────────────────────────

console.log("=== AST Visualization ===\n");

for (const file of files.slice(0, 3)) {
  const filename = `ast-${file.name}.html`;
  visualizer.writeVisualization(file.source, filename);
  console.log(`Generated: ${filename}`);
}

// ─── Generate Dashboard ──────────────────────────────────────────────────────

console.log("\n=== Component Dashboard ===\n");

visualizer.writeDashboard();
console.log(`Generated: dashboard.html`);

// ─── Inline AST HTML ─────────────────────────────────────────────────────────

console.log("\n=== Inline AST (counter.hjx) ===\n");

const counterSource = files.find(f => f.name === "counter")?.source ?? "";
const astHtml = visualizer.generateASTVisualization(counterSource);
console.log("AST HTML (first 500 chars):");
console.log(astHtml.slice(0, 500) + "...");

// ─── Feature Comparison ──────────────────────────────────────────────────────

console.log("\n=== Feature Comparison ===\n");

const comparisons = files.slice(0, 5).map(file => {
  const features = extractFeatures(file.source, file.name);
  return {
    name: file.name,
    loc: features.structural.linesOfCode,
    handlers: features.structural.handlerCount,
    stateVars: features.lexical.stateVariableCount,
    complexity: features.structural.complexity,
    elements: Object.keys(features.lexical.elementCounts),
    hasStyle: features.structural.blockCount.style > 0,
    hasImports: features.structural.importCount > 0,
    hasScript: features.structural.blockCount.script > 0,
  };
});

console.log("Name".padEnd(20) + "LOC".padStart(5) + "Hndl".padStart(6) + "State".padStart(7) + "Cmplx".padStart(7) + "Style".padStart(7) + "Import".padStart(8));
console.log("─".repeat(60));
for (const c of comparisons) {
  console.log(
    c.name.padEnd(20) +
    String(c.loc).padStart(5) +
    String(c.handlers).padStart(6) +
    String(c.stateVars).padStart(7) +
    String(c.complexity).padStart(7) +
    (c.hasStyle ? "✓" : "—").padStart(7) +
    (c.hasImports ? "✓" : "—").padStart(8)
  );
}

console.log(`\nOutput directory: ${outputDir}`);
console.log("Open dashboard.html in a browser to see the visual dashboard.");
