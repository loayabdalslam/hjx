// =============================================================================
// NLP Example 08: Relation Extraction
// =============================================================================
// Extract relationships between entities in natural language descriptions.
// Build knowledge graphs of HJX component dependencies.
//
// Run: npx tsx examples/nlp/08-relation-extraction.ts
// =============================================================================

import {
  extractEntities,
  extractRelations,
  RelationExtractor,
  RelationType,
  EntityType,
} from "../../src/nlp/index.js";

// ─── Basic Relation Extraction ───────────────────────────────────────────────

console.log("=== Basic Relation Extraction ===\n");

const descriptions = [
  "when the user clicks the button, increment the counter",
  "bind the input value to the email state variable",
  "add a count variable and set it when the save handler is called",
  "show the modal if isVisible is true",
  "loop over the items array and display each todo",
  "import the Button component and use it in the layout",
  "when submit is clicked, update the formData and show success message",
];

for (const desc of descriptions) {
  const entities = extractEntities(desc);
  const relations = extractRelations(desc, entities);

  console.log(`"${desc}"`);
  if (relations.length === 0) {
    console.log("  No relations found");
  }
  for (const rel of relations) {
    console.log(`  [${rel.type}] ${rel.source} → ${rel.target} (${(rel.confidence * 100).toFixed(0)}%)`);
    console.log(`    evidence: "${rel.evidence}"`);
  }
  console.log();
}

// ─── Relation Types ──────────────────────────────────────────────────────────

console.log("=== Relation Types ===\n");

const extractor = new RelationExtractor();

const typeExamples: Record<string, string> = {
  TRIGGERS: "when click should increment counter",
  BINDS_TO: "bind input to email variable",
  HAS_STATE: "add a count variable",
  USES_VARIABLE: "set count = count + 1",
  LOOPS_OVER: "for each item in items list",
  CONDITIONED_ON: "show if isLoggedIn is true",
};

for (const [type, text] of Object.entries(typeExamples)) {
  const entities = extractEntities(text);
  const relations = extractor.extractRelations(text, entities);
  const matching = relations.filter(r => r.type === type);

  console.log(`${type}: "${text}"`);
  if (matching.length > 0) {
    for (const rel of matching) {
      console.log(`  ✓ ${rel.source} → ${rel.target}`);
    }
  } else {
    console.log(`  (no ${type} relations found)`);
  }
  console.log();
}

// ─── Relation Graph ──────────────────────────────────────────────────────────

console.log("=== Relation Graph ===\n");

const complexDesc = "when the user clicks the submit button, validate the email input and set the isLoading flag, then update the formData and show the success message if isValid is true";
const entities = extractEntities(complexDesc);
const relations = extractRelations(complexDesc, entities);
const graph = extractor.buildRelationGraph(relations);

console.log(`Description: "${complexDesc}"\n`);
console.log("Graph nodes:");
for (const [id, node] of graph.nodes) {
  console.log(`  ${id} [${node.type}] (${node.relations.length} relations)`);
}

console.log("\nGraph edges:");
for (const edge of graph.edges) {
  console.log(`  ${edge.source} --[${edge.type}]--> ${edge.target}`);
}

console.log("\nNeighbors of 'submit':");
const neighbors = graph.getNeighbors("submit");
console.log(`  ${neighbors.join(", ")}`);

console.log("\nAll TRIGGER relations:");
const triggers = graph.getByType(RelationType.TRIGGERS);
for (const t of triggers) {
  console.log(`  ${t.source} → ${t.target}`);
}

// ─── Co-occurrence Analysis ──────────────────────────────────────────────────

console.log("\n=== Co-occurrence Analysis ===\n");

const cooccurText = "add a click handler that increments the count variable and toggles the showMenu flag when the button is pressed";
const cooccurEntities = extractEntities(cooccurText);
const cooccurRelations = extractRelations(cooccurText, cooccurEntities);

console.log(`"${cooccurText}"\n`);
console.log("Extracted entities:");
for (const e of cooccurEntities) {
  console.log(`  [${e.type}] "${e.value}"`);
}
console.log("\nExtracted relations:");
for (const r of cooccurRelations) {
  console.log(`  [${r.type}] ${r.source} → ${r.target} (confidence: ${(r.confidence * 100).toFixed(0)}%)`);
}

// ─── Full Pipeline ───────────────────────────────────────────────────────────

console.log("\n=== Full Extraction Pipeline ===\n");

const pipeline = [
  "create a TodoApp component with items state and newItem input",
  "when addItem is clicked, append newItem to items array and clear the input",
  "for each item in items, show a delete button that calls removeItem handler",
  "if items.length is 0, display an empty state message",
];

for (const text of pipeline) {
  const ents = extractEntities(text);
  const rels = extractRelations(text, ents);

  console.log(`"${text}"`);
  console.log(`  Entities (${ents.length}): ${ents.map(e => `${e.type}:${e.value}`).join(", ")}`);
  console.log(`  Relations (${rels.length}): ${rels.map(r => `${r.type}(${r.source}→${r.target})`).join(", ")}`);
  console.log();
}
