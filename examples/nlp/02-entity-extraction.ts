// =============================================================================
// NLP Example 02: Entity Extraction
// =============================================================================
// Extract HJX-specific entities from natural language text.
// Recognizes: component names, state variables, events, CSS properties,
//             layout elements, data types, actions, and more.
//
// Run: npx tsx examples/nlp/02-entity-extraction.ts
// =============================================================================

import {
  extractEntities,
  EntityExtractor,
  EntityType,
} from "../../src/nlp/index.js";

// ─── Basic Entity Extraction ─────────────────────────────────────────────────

console.log("=== Basic Entity Extraction ===\n");

const testTexts = [
  "create a button component called ActionButton",
  "add a count variable of type number initialized to 0",
  "when the user clicks the submit button, increment the counter",
  "make the background blue with padding 16px and border radius 12px",
  "show a text element with font size 18px",
  "iterate over items and display each in a view container",
  "bind the input value to the email state variable",
  "import the Card component from ./components/Card.hjx",
  "if isLoggedIn is true, show the dashboard",
  "set the color to white and background to dark",
];

for (const text of testTexts) {
  const entities = extractEntities(text);
  console.log(`"${text}"`);
  for (const entity of entities) {
    console.log(`  [${entity.type}] "${entity.value}" (confidence: ${(entity.confidence * 100).toFixed(0)}%)`);
  }
  console.log();
}

// ─── Entity Types Breakdown ──────────────────────────────────────────────────

console.log("=== Entity Types ===\n");

const extractor = new EntityExtractor();

const descriptions = [
  "add a UserProfile component with name state and click handler",
  "create a form with email input, password field, and submit button",
  "style the card with padding 16px, background white, and shadow",
  "loop over products array and render each product card",
  "if showMenu is true, display the navigation sidebar",
];

for (const desc of descriptions) {
  const entities = extractor.extractEntities(desc);

  console.log(`"${desc}"`);

  const byType: Record<string, string[]> = {};
  for (const e of entities) {
    if (!byType[e.type]) byType[e.type] = [];
    byType[e.type].push(e.value);
  }

  for (const [type, values] of Object.entries(byType)) {
    console.log(`  ${type}: ${values.join(", ")}`);
  }
  console.log();
}

// ─── Context-Aware Resolution ────────────────────────────────────────────────

console.log("=== Context-Aware Entity Resolution ===\n");

const text = "increment the count variable and toggle the showMenu flag";
const entities = extractor.extractEntities(text);

// Provide known context
const context = {
  stateVars: ["count", "showMenu", "items", "email"],
  handlers: ["increment", "toggle", "submit"],
  imports: ["Button", "Card"],
};

const resolved = extractor.resolveReferences(entities, context);

console.log(`"${text}"\n`);
for (const entity of resolved) {
  const status = entity.resolved ? "✓ resolved" : "? unknown";
  console.log(`  [${entity.type}] "${entity.value}" → scope: ${entity.scope} (${status})`);
}

// ─── Entity Linking ──────────────────────────────────────────────────────────

console.log("\n=== Entity Linking ===\n");

const knownComponents = ["Button", "Card", "Input", "Modal", "UserProfile"];
const linkText = "use the Button and Card components with a Modal dialog";
const linkedEntities = extractor.extractEntities(linkText);

const linked = extractor.entityLinking(linkedEntities, knownComponents);

console.log(`"${linkText}"\n`);
for (const entity of linked) {
  const known = knownComponents.includes(entity.value) ? "✓ known" : "";
  console.log(`  [${entity.type}] "${entity.value}" ${known} (confidence: ${(entity.confidence * 100).toFixed(0)}%)`);
}

// ─── Custom Entity Patterns ──────────────────────────────────────────────────

console.log("\n=== Custom Entity Patterns ===\n");

const customExtractor = new EntityExtractor();

// Add custom pattern for Tailwind classes
customExtractor.addCustomPattern(
  EntityType.CSS_CLASS,
  /\b(bg|text|border|p|m|w|h|rounded|shadow|flex|grid|gap)-[\w-]+/gi
);

const tailwindText = "style with bg-blue-500 text-white rounded-lg p-4 shadow-md flex gap-2";
const tailwindEntities = customExtractor.extractEntities(tailwindText);

console.log(`"${tailwindText}"\n`);
for (const entity of tailwindEntities) {
  console.log(`  [${entity.type}] "${entity.value}"`);
}

// ─── Batch Extraction ────────────────────────────────────────────────────────

console.log("\n=== Batch Entity Extraction ===\n");

const batchTexts = [
  "create a Counter component",
  "add click handler",
  "style with blue background",
  "show if authenticated",
  "loop over users array",
];

const batchResults = batchTexts.map(text => ({
  text,
  entities: extractEntities(text),
}));

console.log("Batch results:");
for (const result of batchResults) {
  const entitySummary = result.entities.map(e => `${e.type}:${e.value}`).join(", ");
  console.log(`  "${result.text}" → [${entitySummary}]`);
}
