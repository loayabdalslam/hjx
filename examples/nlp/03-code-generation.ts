// =============================================================================
// NLP Example 03: Code Generation from Natural Language
// =============================================================================
// Generate HJX code from natural language descriptions.
// Supports template-based generation, neural generation, and partial updates.
//
// Run: npx tsx examples/nlp/03-code-generation.ts
// =============================================================================

import {
  generateCode,
  TemplateGenerator,
  NeuralCodeGenerator,
  classifyIntent,
  extractEntities,
} from "../../src/nlp/index.js";

// ─── Simple Generation ───────────────────────────────────────────────────────

console.log("=== Generate Complete Components ===\n");

const descriptions = [
  "create a counter",
  "create a form with email field",
  "create a todo list",
];

for (const desc of descriptions) {
  console.log(`--- "${desc}" ---`);
  const code = generateCode(desc);
  console.log(code);
}

// ─── Template-Based Generation ───────────────────────────────────────────────

console.log("=== Template-Based Generation ===\n");

const gen = new TemplateGenerator();

const templateDescriptions = [
  { desc: "create a counter", expect: ["component", "state:", "handlers:"] },
  { desc: "create a form with email field", expect: ["input", "bind value"] },
  { desc: "create a todo list", expect: ["for", "items"] },
  { desc: "create a modal dialog", expect: ["isOpen", "overlay"] },
  { desc: "create a dashboard", expect: ["stats", "for"] },
];

for (const { desc, expect } of templateDescriptions) {
  const intent = classifyIntent(desc);
  const entities = extractEntities(desc);
  const result = gen.generate(intent, entities);

  console.log(`"${desc}"`);
  console.log(`  template: ${result.templateId}`);
  console.log(`  confidence: ${(result.confidence * 100).toFixed(0)}%`);

  const allPresent = expect.every(e => result.hjx.includes(e));
  console.log(`  contains expected: ${allPresent ? "✓" : "✗"}`);
  console.log();
}

// ─── Neural Code Generation ──────────────────────────────────────────────────

console.log("=== Neural Code Generation ===\n");

const neuralGen = new NeuralCodeGenerator();

async function demoNeuralGeneration() {
  // Generate from description
  const result1 = await neuralGen.generate("create a button component with variants");
  console.log("--- Neural: button with variants ---");
  console.log(`Method: ${result1.method}`);
  console.log(`Valid syntax: ${result1.validSyntax}`);
  console.log(`Candidates: ${result1.candidates.length}`);
  console.log(result1.code.slice(0, 200) + "...\n");

  // Generate with existing context
  const existingCode = `component MyApp

state:
  count = 0

layout:
  view.container:
    text: "Count: {{count}}"
`;

  const result2 = await neuralGen.generate("add an increment button", existingCode);
  console.log("--- Neural: add to existing component ---");
  console.log(result2.code.slice(0, 300) + "...\n");
}

await demoNeuralGeneration();

// ─── Partial Code Generation ─────────────────────────────────────────────────

console.log("=== Partial Code Generation ===\n");

async function demoPartialGeneration() {
  const baseCode = `component UserProfile

state:
  username = "Alice"
  isLoggedIn = true

layout:
  view.profile:
    text.greeting: "Welcome {{username}}"
`;

  // Add state
  const withState = await neuralGen.generatePartial(baseCode, "add a followerCount variable");
  console.log("--- Add state variable ---");
  console.log(withState);

  // Add handler
  const withHandler = await neuralGen.generatePartial(baseCode, "add a logout handler");
  console.log("--- Add handler ---");
  console.log(withHandler);

  // Add style
  const withStyle = await neuralGen.generatePartial(baseCode, "add padding and background color");
  console.log("--- Add style ---");
  console.log(withStyle);

  // Add conditional
  const withConditional = await neuralGen.generatePartial(baseCode, "show premium badge if isPremium");
  console.log("--- Add conditional ---");
  console.log(withConditional);
}

await demoPartialGeneration();

// ─── Available Templates ─────────────────────────────────────────────────────

console.log("=== Available Templates ===\n");

const templates = gen.getTemplates();
for (const template of templates) {
  console.log(`${template.id}: ${template.name}`);
  console.log(`  description: ${template.description}`);
  console.log(`  intents: ${template.intents.join(", ")}`);
  console.log(`  slots: ${template.slots.map(s => `${s.name}${s.required ? "*" : ""}`).join(", ")}`);
  console.log();
}

// ─── Generation with Different Phrasings ─────────────────────────────────────

console.log("=== Same Intent, Different Phrasings ===\n");

const phrasings = [
  "create a counter",
  "make a counter component",
  "build me a counter",
  "I need a counter",
  "generate a counter app",
  "scaffold a new counter",
];

for (const phrase of phrasings) {
  const intent = classifyIntent(phrase);
  console.log(`"${phrase}" → ${intent.primaryIntent} (${(intent.confidence * 100).toFixed(0)}%)`);
}
