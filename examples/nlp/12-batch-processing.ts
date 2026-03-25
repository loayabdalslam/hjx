// =============================================================================
// NLP Example 12: Batch Processing
// =============================================================================
// Process multiple HJX files: extract features, detect errors, generate
// embeddings, and build a searchable index.
//
// Run: npx tsx examples/nlp/12-batch-processing.ts
// =============================================================================

import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  extractFeatures,
  getEmbedding,
  detectErrors,
  correctCode,
  formatHJX,
  classifyIntent,
  FeatureStore,
  SemanticCodeSearch,
} from "../../src/nlp/index.js";

// ─── Load All Examples ───────────────────────────────────────────────────────

const examplesDir = resolve(process.cwd(), "examples");
const files: { path: string; name: string; source: string }[] = [];

function walkDir(dir: string) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "nlp" && entry.name !== "projects") {
      walkDir(fullPath);
    } else if (entry.name.endsWith(".hjx")) {
      try {
        const source = readFileSync(fullPath, "utf-8");
        // Skip files with array/object state (parser limitation)
        if (!source.match(/state:\s*\n\s*\w+\s*=\s*[\[{]/)) {
          files.push({
            path: fullPath,
            name: entry.name.replace(".hjx", ""),
            source: source,
          });
        }
      } catch (error) {
        console.warn(`Skipping ${fullPath}: ${(error as Error).message}`);
      }
    }
  }
}
walkDir(examplesDir);

console.log(`Loaded ${files.length} HJX files\n`);

// ─── Batch Feature Extraction ────────────────────────────────────────────────

console.log("=== Batch Feature Extraction ===\n");

const featureResults = files.map(file => {
  try {
    const features = extractFeatures(file.source, file.name);
    return {
      name: file.name,
      loc: features.structural.linesOfCode,
      handlers: features.structural.handlerCount,
      stateVars: features.lexical.stateVariableCount,
      events: features.lexical.eventHandlerCount,
      complexity: features.structural.complexity,
      elements: Object.keys(features.lexical.elementCounts).length,
      embedding: getEmbedding(file.source),
    };
  } catch (error) {
    console.warn(`Error processing ${file.name}: ${(error as Error).message}`);
    return null;
  }
}).filter(r => r !== null);

console.log("Component".padEnd(20) + "LOC".padStart(5) + "Handlers".padStart(10) + "State".padStart(8) + "Events".padStart(8) + "Cmplx".padStart(8));
console.log("─".repeat(59));
for (const r of featureResults) {
  console.log(
    r.name.padEnd(20) +
    String(r.loc).padStart(5) +
    String(r.handlers).padStart(10) +
    String(r.stateVars).padStart(8) +
    String(r.events).padStart(8) +
    String(r.complexity).padStart(8)
  );
}

// ─── Batch Error Detection ───────────────────────────────────────────────────

console.log("\n=== Batch Error Detection ===\n");

let totalErrors = 0;
let totalWarnings = 0;
let cleanFiles = 0;

for (const file of files) {
  const errors = detectErrors(file.source);
  const errs = errors.filter(e => e.severity === "ERROR").length;
  const warns = errors.filter(e => e.severity === "WARNING").length;

  totalErrors += errs;
  totalWarnings += warns;
  if (errs === 0) cleanFiles++;

  if (errs > 0 || warns > 0) {
    console.log(`${file.name}: ${errs} errors, ${warns} warnings`);
    for (const err of errors) {
      console.log(`  [${err.severity}] ${err.message}`);
    }
  }
}

console.log(`\nSummary: ${cleanFiles}/${files.length} clean, ${totalErrors} total errors, ${totalWarnings} total warnings`);

// ─── Batch Formatting ────────────────────────────────────────────────────────

console.log("\n=== Batch Canonical Formatting ===\n");

for (const file of files.slice(0, 3)) {
  const formatted = formatHJX(file.source);
  const original = file.source;
  const changed = formatted !== original;

  console.log(`${file.name}: ${changed ? "reformatted" : "already clean"}`);
  if (changed) {
    const origLines = original.split("\n").length;
    const fmtLines = formatted.split("\n").length;
    console.log(`  lines: ${origLines} → ${fmtLines}`);
  }
}

// ─── Batch Embedding Generation ──────────────────────────────────────────────

console.log("\n=== Batch Embedding Generation ===\n");

const startTime = Date.now();
const embeddings = files.map(f => ({
  name: f.name,
  embedding: getEmbedding(f.source),
}));
const elapsed = Date.now() - startTime;

console.log(`Generated ${embeddings.length} embeddings in ${elapsed}ms`);
console.log(`Average: ${(elapsed / embeddings.length).toFixed(2)}ms per embedding`);
console.log(`Dimensions: ${embeddings[0].embedding.length}`);

// ─── Build Feature Store ─────────────────────────────────────────────────────

console.log("\n=== Feature Store Batch Indexing ===\n");

const store = new FeatureStore();
const fileContents = new Map<string, string>();
const featuresMap = new Map<string, any>();

for (const file of files) {
  try {
    fileContents.set(file.path, file.source);
    featuresMap.set(file.path, extractFeatures(file.source, file.name));
  } catch (error) {
    console.warn(`Skipping ${file.name}: ${(error as Error).message}`);
  }
}

const indexed = store.processDirectory(fileContents, featuresMap);
const stats = store.getStats();

console.log(`Indexed: ${indexed} components`);
console.log(`Total in store: ${stats.totalComponents}`);
console.log(`Avg LOC: ${stats.avgFeatures.linesOfCode?.toFixed(1)}`);
console.log(`Avg complexity: ${stats.avgFeatures.complexity?.toFixed(1)}`);

// ─── Batch Search ────────────────────────────────────────────────────────────

console.log("\n=== Batch Search ===\n");

const search = new SemanticCodeSearch();
for (const file of files) {
  search.addToIndex(file.name, file.path, file.source);
}

const searchQueries = ["counter increment", "form input binding", "list loop items", "conditional show hide"];
for (const query of searchQueries) {
  const results = search.search(query, 2);
  console.log(`"${query}" → ${results.map(r => r.entry.componentName).join(", ")}`);
}

// ─── Batch Intent Classification ─────────────────────────────────────────────

console.log("\n=== Batch Intent Classification ===\n");

const descriptions = files.map(f => `create a ${f.name} component`);
const intentCounts: Record<string, number> = {};

for (const desc of descriptions) {
  const intent = classifyIntent(desc);
  intentCounts[intent.primaryIntent] = (intentCounts[intent.primaryIntent] || 0) + 1;
}

console.log("Intent distribution:");
for (const [intent, count] of Object.entries(intentCounts)) {
  console.log(`  ${intent}: ${count}`);
}
