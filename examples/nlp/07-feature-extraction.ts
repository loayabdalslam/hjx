// =============================================================================
// NLP Example 07: Feature Extraction & Code Embeddings
// =============================================================================
// Extract structural, lexical, and semantic features from HJX code.
// Generate vector embeddings for similarity search and clustering.
//
// Run: npx tsx examples/nlp/07-feature-extraction.ts
// =============================================================================

import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  extractFeatures,
  getEmbedding,
  findSimilar,
  clusterComponents,
  clearEmbeddingCache,
} from "../../src/nlp/index.js";

// ─── Load Examples ───────────────────────────────────────────────────────────

const examplesDir = resolve(process.cwd(), "examples");
const components: { name: string; source: string }[] = [];

function walkDir(dir: string) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "nlp" && entry.name !== "projects") {
      walkDir(fullDir);
    } else if (entry.name.endsWith(".hjx")) {
      components.push({
        name: entry.name.replace(".hjx", ""),
        source: readFileSync(fullPath, "utf-8"),
      });
    }
  }
}
walkDir(examplesDir);

// ─── Structural Features ─────────────────────────────────────────────────────

console.log("=== Structural Features ===\n");

for (const comp of components) {
  const features = extractFeatures(comp.source, comp.name);
  const s = features.structural;
  console.log(`${comp.name}:`);
  console.log(`  Lines of code: ${s.linesOfCode}`);
  console.log(`  Tokens: ${s.tokenCount}`);
  console.log(`  Max nesting depth: ${s.maxNestingDepth}`);
  console.log(`  Avg nesting depth: ${s.avgNestingDepth}`);
  console.log(`  Layout tree size: ${s.layoutTreeSize}`);
  console.log(`  Layout tree depth: ${s.layoutTreeDepth}`);
  console.log(`  Handlers: ${s.handlerCount}`);
  console.log(`  Imports: ${s.importCount}`);
  console.log(`  Complexity: ${s.complexity}`);
  console.log(`  Blocks: state=${s.blockCount.state} layout=${s.blockCount.layout} style=${s.blockCount.style} handlers=${s.blockCount.handlers}`);
  console.log();
}

// ─── Lexical Features ────────────────────────────────────────────────────────

console.log("=== Lexical Features ===\n");

for (const comp of components.slice(0, 3)) {
  const features = extractFeatures(comp.source, comp.name);
  const l = features.lexical;
  console.log(`${comp.name}:`);
  console.log(`  Elements: ${JSON.stringify(l.elementCounts)}`);
  console.log(`  CSS classes: ${l.cssClassCount}`);
  console.log(`  CSS IDs: ${l.cssIdCount}`);
  console.log(`  Event handlers: ${l.eventHandlerCount}`);
  console.log(`  State variables: ${l.stateVariableCount}`);
  console.log(`  Control flow: if=${l.controlFlowCount.ifCount} for=${l.controlFlowCount.forCount} else=${l.controlFlowCount.elseCount}`);
  console.log(`  Unique tokens: ${l.uniqueTokens}`);
  console.log();
}

// ─── Semantic Features ───────────────────────────────────────────────────────

console.log("=== Semantic Features ===\n");

for (const comp of components.slice(0, 3)) {
  const features = extractFeatures(comp.source, comp.name);
  const sem = features.semantic;
  console.log(`${comp.name}:`);
  console.log(`  State vars: [${sem.stateVariableNames.join(", ")}]`);
  console.log(`  Handlers: [${sem.handlerNames.join(", ")}]`);
  console.log(`  Dependencies: [${sem.componentDependencies.join(", ")}]`);
  console.log(`  Data flow edges: ${sem.dataFlowEdges.length}`);
  for (const edge of sem.dataFlowEdges.slice(0, 5)) {
    console.log(`    ${edge.from} --[${edge.type}]--> ${edge.to}`);
  }
  console.log();
}

// ─── Feature Vectors ─────────────────────────────────────────────────────────

console.log("=== Feature Vectors (Summary) ===\n");

for (const comp of components) {
  const features = extractFeatures(comp.source, comp.name);
  console.log(`${comp.name}:`);
  console.log(`  Summary: ${JSON.stringify(features.summary)}`);
  console.log(`  Vector: [${features.vector.map(v => v.toFixed(1)).join(", ")}]`);
  console.log();
}

// ─── Code Embeddings ─────────────────────────────────────────────────────────

console.log("=== Code Embeddings ===\n");

for (const comp of components.slice(0, 3)) {
  const embedding = getEmbedding(comp.source);
  console.log(`${comp.name}:`);
  console.log(`  Dimensions: ${embedding.length}`);
  console.log(`  First 10: [${embedding.slice(0, 10).map(v => v.toFixed(4)).join(", ")}]`);
  console.log(`  Norm: ${Math.sqrt(embedding.reduce((s, v) => s + v * v, 0)).toFixed(4)}`);
  console.log();
}

// ─── Embedding Consistency ───────────────────────────────────────────────────

console.log("=== Embedding Consistency ===\n");

const emb1 = getEmbedding(components[0].source);
const emb2 = getEmbedding(components[0].source);
const identical = emb1.every((v, i) => v === emb2[i]);
console.log(`Same input produces identical embedding: ${identical}`);

clearEmbeddingCache();
const emb3 = getEmbedding(components[0].source);
const identicalAfterClear = emb1.every((v, i) => v === emb3[i]);
console.log(`Same input after cache clear: ${identicalAfterClear}`);

// ─── Similarity Matrix ───────────────────────────────────────────────────────

console.log("\n=== Similarity Matrix ===\n");

const embeddings = components.map(c => ({
  name: c.name,
  emb: getEmbedding(c.source),
}));

function cosineSim(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

console.log("     ", embeddings.map(e => e.name.slice(0, 8).padEnd(8)).join(" "));
for (let i = 0; i < embeddings.length; i++) {
  const row = embeddings.map(ej => cosineSim(embeddings[i].emb, ej.emb).toFixed(2).padStart(8)).join(" ");
  console.log(`${embeddings[i].name.slice(0, 8).padEnd(8)} ${row}`);
}

// ─── Clustering ──────────────────────────────────────────────────────────────

console.log("\n=== K-Means Clustering ===\n");

const codes = components.map(c => c.source);
const k = Math.min(3, Math.floor(codes.length / 2));
const clusters = clusterComponents(codes, k);

for (let i = 0; i < clusters.length; i++) {
  console.log(`Cluster ${i + 1} (${clusters[i].members.length} members):`);
  for (const member of clusters[i].members) {
    const name = components.find(c => c.source === member)?.name ?? "?";
    console.log(`  - ${name}`);
  }
  console.log();
}
