// =============================================================================
// NLP Example 06: Semantic Code Search
// =============================================================================
// Search HJX components by natural language, find similar code, and
// locate usages of identifiers across a codebase.
//
// Run: npx tsx examples/nlp/06-semantic-search.ts
// =============================================================================

import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  SemanticCodeSearch,
  getEmbedding,
  findSimilar,
  clusterComponents,
} from "../../src/nlp/index.js";

// ─── Load Example Components ─────────────────────────────────────────────────

const examplesDir = resolve(process.cwd(), "examples");
const exampleFiles: { path: string; source: string }[] = [];

function walkDir(dir: string) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "nlp" && entry.name !== "projects") {
      walkDir(fullPath);
    } else if (entry.name.endsWith(".hjx")) {
      exampleFiles.push({
        path: fullPath,
        source: readFileSync(fullPath, "utf-8"),
      });
    }
  }
}
walkDir(examplesDir);

console.log(`Loaded ${exampleFiles.length} HJX components\n`);

// ─── Build Search Index ──────────────────────────────────────────────────────

const search = new SemanticCodeSearch();

for (const file of exampleFiles) {
  const name = file.path.split(/[/\\]/).pop()?.replace(".hjx", "") ?? "unknown";
  search.addToIndex(name, file.path, file.source);
}

console.log("=== Natural Language Search ===\n");

const queries = [
  "counter with increment and decrement",
  "form with input binding",
  "list with loop and add remove",
  "conditional show hide",
  "dashboard with stats cards",
  "button click handler",
  "input two-way binding",
  "server driven real time",
];

for (const query of queries) {
  const results = search.search(query, 3);
  console.log(`Query: "${query}"`);
  for (const result of results) {
    console.log(`  ${result.entry.componentName} (score: ${result.score.toFixed(3)}, ${result.matchType})`);
    if (result.highlights.length > 0) {
      console.log(`    highlights: ${result.highlights.slice(0, 5).join(", ")}`);
    }
  }
  console.log();
}

// ─── Similar Code Search ─────────────────────────────────────────────────────

console.log("=== Find Similar Components ===\n");

const referenceCode = exampleFiles[0].source;
const referenceName = exampleFiles[0].path.split(/[/\\]/).pop() ?? "unknown";

console.log(`Reference: ${referenceName}\n`);

const similar = search.searchSimilar(referenceCode, 5);
for (const result of similar) {
  console.log(`  ${result.entry.componentName} (similarity: ${result.score.toFixed(3)})`);
}

// ─── Embedding Similarity ────────────────────────────────────────────────────

console.log("\n=== Embedding Similarity (Direct) ===\n");

const corpus = exampleFiles.map(f => ({
  code: f.source,
  label: f.path.split(/[/\\]/).pop()?.replace(".hjx", "") ?? "unknown",
}));

const queryCode = exampleFiles.find(f => f.path.includes("counter"))?.source ?? "";
const similarByEmbedding = findSimilar(queryCode, corpus, 5);

console.log(`Query: counter component\n`);
for (const result of similarByEmbedding) {
  console.log(`  ${result.source} (similarity: ${result.similarity.toFixed(3)})`);
}

// ─── Component Clustering ────────────────────────────────────────────────────

console.log("\n=== Component Clustering ===\n");

const codes = exampleFiles.map(f => f.source);
const clusters = clusterComponents(codes, 3);

for (let i = 0; i < clusters.length; i++) {
  const cluster = clusters[i];
  console.log(`Cluster ${i + 1} (${cluster.members.length} components):`);
  for (const member of cluster.members) {
    const name = exampleFiles.find(f => f.source === member)?.path.split(/[/\\]/).pop() ?? "?";
    console.log(`  - ${name}`);
  }
  console.log();
}

// ─── Find Usages ─────────────────────────────────────────────────────────────

console.log("=== Find Usages ===\n");

const sources = new Map<string, string>();
for (const file of exampleFiles) {
  sources.set(file.path, file.source);
}

const identifiers = ["count", "click", "items", "isLoggedIn"];

for (const identifier of identifiers) {
  const usages = search.findUsages(identifier, sources);
  console.log(`"${identifier}" used in ${usages.length} locations:`);
  for (const usage of usages.slice(0, 5)) {
    const name = usage.file.split(/[/\\]/).pop() ?? "?";
    console.log(`  ${name}:${usage.line} — ${usage.context.slice(0, 60)}`);
  }
  console.log();
}

// ─── Index Statistics ────────────────────────────────────────────────────────

console.log("=== Search Index Stats ===\n");

const allComponents = exampleFiles.map(f => {
  const name = f.path.split(/[/\\]/).pop()?.replace(".hjx", "") ?? "unknown";
  return name;
});

console.log(`Total indexed: ${allComponents.length}`);
console.log(`Components: ${allComponents.join(", ")}`);
