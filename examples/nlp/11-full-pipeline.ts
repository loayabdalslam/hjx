// =============================================================================
// NLP Example 11: Full NLP Pipeline
// =============================================================================
// End-to-end pipeline: text → intent → entities → relations → code → validate
// Shows how all NLP components work together.
//
// Run: npx tsx examples/nlp/11-full-pipeline.ts
// =============================================================================

import {
  HJXNLPEngine,
  classifyIntent,
  extractEntities,
  extractRelations,
  detectErrors,
  correctCode,
  extractFeatures,
  getEmbedding,
  Intent,
} from "../../src/nlp/index.js";

// ─── Pipeline: Natural Language → HJX Code ───────────────────────────────────

console.log("=== Full Pipeline: NL → HJX ===\n");

async function fullPipeline(userRequest: string) {
  console.log(`User: "${userRequest}"`);
  console.log("─".repeat(60));

  // Step 1: Intent Classification
  const intent = classifyIntent(userRequest);
  console.log(`\n1. Intent: ${intent.primaryIntent} (${(intent.confidence * 100).toFixed(0)}%)`);
  if (intent.secondaryIntents.length > 0) {
    console.log(`   Secondary: ${intent.secondaryIntents.join(", ")}`);
  }

  // Step 2: Entity Extraction
  const entities = extractEntities(userRequest);
  console.log(`\n2. Entities (${entities.length}):`);
  for (const e of entities) {
    console.log(`   [${e.type}] "${e.value}" (${(e.confidence * 100).toFixed(0)}%)`);
  }

  // Step 3: Relation Extraction
  const relations = extractRelations(userRequest, entities);
  console.log(`\n3. Relations (${relations.length}):`);
  for (const r of relations) {
    console.log(`   [${r.type}] ${r.source} → ${r.target}`);
  }

  // Step 4: Code Generation
  const engine = new HJXNLPEngine();
  const genResult = await engine.generateCode(userRequest);
  console.log(`\n4. Generated Code (${genResult.method}, confidence: ${(genResult.confidence * 100).toFixed(0)}%):`);
  console.log("─".repeat(40));
  console.log(genResult.code);
  console.log("─".repeat(40));

  // Step 5: Error Detection
  const errors = detectErrors(genResult.code);
  console.log(`\n5. Errors detected: ${errors.length}`);
  for (const err of errors) {
    console.log(`   [${err.severity}] ${err.message}`);
  }

  // Step 6: Auto-correct if needed
  if (errors.length > 0) {
    const corrected = correctCode(genResult.code);
    console.log(`\n6. Auto-corrected: ${corrected.success ? "✓" : "✗"} (${corrected.changes.length} changes)`);
    for (const change of corrected.changes) {
      console.log(`   - ${change.description}`);
    }
  }

  // Step 7: Feature Extraction
  const features = extractFeatures(genResult.code);
  console.log(`\n7. Features:`);
  console.log(`   LOC: ${features.structural.linesOfCode}, Handlers: ${features.structural.handlerCount}`);
  console.log(`   State vars: ${features.lexical.stateVariableCount}, Complexity: ${features.structural.complexity}`);

  // Step 8: Embedding
  const embedding = getEmbedding(genResult.code);
  console.log(`\n8. Embedding: ${embedding.length} dimensions`);

  console.log("\n" + "═".repeat(60) + "\n");
}

// Run the pipeline on several examples
const requests = [
  "create a counter with increment and decrement buttons",
  "build a login form with email and password fields",
  "make a todo list where I can add and remove items",
  "create a modal that opens when I click a button",
  "build a dashboard with user stats and alerts",
];

async function runAll() {
  for (const req of requests) {
    await fullPipeline(req);
  }
}

await runAll();

// ─── Pipeline: Analyze Existing Code ─────────────────────────────────────────

console.log("=== Pipeline: Analyze Existing Code ===\n");

const existingCode = `component UserProfile

state:
  username = "Alice"
  isLoggedIn = true
  followerCount = 150

layout:
  view.profile:
    text.greeting: "Welcome {{username}}"
    if (isLoggedIn):
      view.stats:
        text: "Followers: {{followerCount}}"
        button.logout (on click -> logout): "Logout"
    if (!isLoggedIn):
      button.login (on click -> login): "Login"

handlers:
  logout:
    set isLoggedIn = false
  login:
    set isLoggedIn = true
`;

const engine = new HJXNLPEngine();
const analysis = engine.analyzeComponent(existingCode, "UserProfile.hjx");

console.log("Component: UserProfile\n");
console.log("Features:");
console.log(`  Lines: ${analysis.features.structural.linesOfCode}`);
console.log(`  Handlers: ${analysis.features.structural.handlerCount}`);
console.log(`  State vars: ${analysis.features.lexical.stateVariableCount}`);
console.log(`  Events: ${analysis.features.lexical.eventHandlerCount}`);

console.log("\nEntities:");
for (const e of analysis.entities) {
  console.log(`  [${e.type}] "${e.value}"`);
}

console.log("\nErrors:");
for (const err of analysis.errors) {
  console.log(`  [${err.severity}] ${err.message}`);
}

console.log("\nRelations:");
for (const r of analysis.relations) {
  console.log(`  [${r.type}] ${r.source} → ${r.target}`);
}
