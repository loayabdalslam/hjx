// =============================================================================
// NLP Example 14: Feature Store Operations
// =============================================================================
// CRUD operations, search, and batch processing with the feature store.
//
// Run: npx tsx examples/nlp/14-feature-store.ts
// =============================================================================

import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  FeatureStore,
  extractFeatures,
  getEmbedding,
} from "../../src/nlp/index.js";

// ─── Create Store ────────────────────────────────────────────────────────────

const store = new FeatureStore();

// ─── Add Components ──────────────────────────────────────────────────────────

console.log("=== Add Components ===\n");

const examplesDir = resolve(process.cwd(), "examples");
const files: { path: string; source: string }[] = [];

function walkDir(dir: string) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "nlp" && entry.name !== "projects") {
      walkDir(fullPath);
    } else if (entry.name.endsWith(".hjx")) {
      files.push({
        path: fullPath,
        source: readFileSync(fullPath, "utf-8"),
      });
    }
  }
}
walkDir(examplesDir);

// Add individually with labels
const labels: Record<string, string[]> = {
  "counter": ["interactive", "simple"],
  "form": ["form", "input-binding"],
  "list": ["loop", "crud"],
  "dashboard": ["complex", "server-driven", "imports"],
  "conditional": ["conditional", "control-flow"],
  "composition_demo": ["composition", "imports"],
};

for (const file of files) {
  const name = file.path.split(/[/\\]/).pop()?.replace(".hjx", "") ?? "unknown";
  const features = extractFeatures(file.source, name);
  const fileLabels = labels[name] || [];
  const id = store.addComponent(file.path, file.source, features, fileLabels);
  console.log(`Added: ${name} → ${id} (labels: ${fileLabels.join(", ") || "none"})`);
}

// ─── Get Component ───────────────────────────────────────────────────────────

console.log("\n=== Get Component ===\n");

const allComponents = store.getAllComponents();
const firstId = allComponents[0].id;

const retrieved = store.getComponent(firstId);
if (retrieved) {
  console.log(`ID: ${retrieved.id}`);
  console.log(`Name: ${retrieved.name}`);
  console.log(`Path: ${retrieved.filePath}`);
  console.log(`Labels: ${retrieved.labels.join(", ")}`);
  console.log(`Version: ${retrieved.version}`);
  console.log(`LOC: ${retrieved.features.structural.linesOfCode}`);
  console.log(`Handlers: ${retrieved.features.structural.handlerCount}`);
}

// ─── Get By Path ─────────────────────────────────────────────────────────────

console.log("\n=== Get By Path ===\n");

if (files.length > 0) {
  const byPath = store.getComponentByPath(files[0].path);
  console.log(`Path lookup: ${byPath?.name ?? "not found"}`);
}

// ─── Update Features ─────────────────────────────────────────────────────────

console.log("\n=== Update Features ===\n");

const updated = store.updateFeatures(firstId, {
  summary: { customScore: 42 },
});
console.log(`Updated: ${updated}`);

const afterUpdate = store.getComponent(firstId);
console.log(`After update version: ${afterUpdate?.version}`);

// ─── Search by Features ──────────────────────────────────────────────────────

console.log("\n=== Search by Features ===\n");

const searchResults = store.search({
  featureFilter: { handlerCount: 2 },
  limit: 5,
});

console.log("Components with ~2 handlers:");
for (const result of searchResults) {
  console.log(`  ${result.component.name} (score: ${result.score.toFixed(3)})`);
}

// ─── Search by Label ─────────────────────────────────────────────────────────

console.log("\n=== Search by Label ===\n");

const labelResults = store.search({
  labelFilter: ["interactive"],
  limit: 5,
});

console.log("Components with 'interactive' label:");
for (const result of labelResults) {
  console.log(`  ${result.component.name} (score: ${result.score.toFixed(3)})`);
}

// ─── Search by Text ──────────────────────────────────────────────────────────

console.log("\n=== Search by Text ===\n");

const textResults = store.search({
  textFilter: "button",
  limit: 5,
});

console.log("Components matching 'button':");
for (const result of textResults) {
  console.log(`  ${result.component.name} (score: ${result.score.toFixed(3)}, match: ${result.matchType})`);
}

// ─── Search by Embedding ─────────────────────────────────────────────────────

console.log("\n=== Search by Embedding ===\n");

const queryEmbedding = getEmbedding(files[0].source);
const embeddingResults = store.search({
  vector: queryEmbedding,
  limit: 5,
});

console.log(`Similar to ${files[0].path.split(/[/\\]/).pop()}:`);
for (const result of embeddingResults) {
  console.log(`  ${result.component.name} (similarity: ${result.score.toFixed(3)})`);
}

// ─── Combined Search ─────────────────────────────────────────────────────────

console.log("\n=== Combined Search ===\n");

const combinedResults = store.search({
  vector: getEmbedding(files[0].source),
  textFilter: "counter",
  limit: 5,
});

console.log("Combined (embedding + text):");
for (const result of combinedResults) {
  console.log(`  ${result.component.name} (score: ${result.score.toFixed(3)}, match: ${result.matchType})`);
}

// ─── Store Statistics ─────────────────────────────────────────────────────────

console.log("\n=== Store Statistics ===\n");

const stats = store.getStats();
console.log(`Total components: ${stats.totalComponents}`);
console.log(`Total labels: ${stats.totalLabels}`);
console.log("Average features:");
for (const [key, value] of Object.entries(stats.avgFeatures)) {
  console.log(`  ${key}: ${value.toFixed(2)}`);
}

// ─── Batch Processing ────────────────────────────────────────────────────────

console.log("\n=== Batch Processing ===\n");

const store2 = new FeatureStore();
const fileContents = new Map<string, string>();
const featuresMap = new Map<string, any>();

for (const file of files) {
  const name = file.path.split(/[/\\]/).pop()?.replace(".hjx", "") ?? "unknown";
  fileContents.set(file.path, file.source);
  featuresMap.set(file.path, extractFeatures(file.source, name));
}

const count = store2.processDirectory(fileContents, featuresMap);
console.log(`Batch indexed: ${count} components`);

// ─── Delete Component ────────────────────────────────────────────────────────

console.log("\n=== Delete Component ===\n");

const allBefore = store.getAllComponents().length;
const deleted = store.deleteComponent(firstId);
const allAfter = store.getAllComponents().length;

console.log(`Before: ${allBefore}, After: ${allAfter}, Deleted: ${deleted}`);
