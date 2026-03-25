// =============================================================================
// NLP Example 01: Intent Classification
// =============================================================================
// Classify natural language input into HJX development intents.
// The classifier uses pattern matching with confidence scoring.
//
// Run: npx tsx examples/nlp/01-intent-classification.ts
// =============================================================================

import {
  classifyIntent,
  IntentClassifier,
  Intent,
  generateTrainingData,
} from "../../src/nlp/index.js";

// ─── Basic Classification ────────────────────────────────────────────────────

console.log("=== Basic Intent Classification ===\n");

const testInputs = [
  // CREATE_COMPONENT
  "create a login form with email and password",
  "make a counter component",
  "build a todo list app",
  "I need a dashboard page",
  "generate a button component with variants",

  // ADD_STATE
  "add a count variable initialized to 0",
  "create a title state with default hello world",
  "I need a boolean flag called isLoading",
  "define an items array",
  "store the user email",

  // ADD_HANDLER
  "add a click handler that increments the counter",
  "when the button is clicked show an alert",
  "handle form submission",
  "create a toggle function for the menu",
  "implement a save function",

  // ADD_STYLE
  "make the background blue",
  "add padding of 16px to the card",
  "make the button rounded with border radius",
  "set the font size to 18px",
  "add dark mode support",

  // ADD_CONDITIONAL
  "show the login button only if not logged in",
  "hide the loading spinner when data is ready",
  "display error message if there is an error",

  // ADD_LOOP
  "iterate over the items array and display each one",
  "render a list of todo items",
  "for each product in the catalog show a card",

  // BIND_DATA
  "bind the input value to the email state",
  "create a two-way binding for the search field",

  // FIX_ERROR
  "fix the syntax error in my component",
  "why is my component not compiling",
  "the button click handler doesn't work",

  // EXPLAIN_CODE
  "explain what this component does",
  "how does the event handler work",

  // REFACTOR
  "optimize the performance of this component",
  "extract the header into its own component",

  // ADD_COMPUTED
  "add a computed property for the total price",
  "calculate the average score",
];

for (const input of testInputs) {
  const result = classifyIntent(input);
  const confidence = (result.confidence * 100).toFixed(0);
  console.log(`"${input}"`);
  console.log(`  → ${result.primaryIntent} (${confidence}%)`);
  if (result.secondaryIntents.length > 0) {
    console.log(`    secondary: ${result.secondaryIntents.join(", ")}`);
  }
  if (Object.keys(result.entities).length > 0) {
    console.log(`    entities: ${JSON.stringify(result.entities)}`);
  }
  console.log();
}

// ─── Batch Classification ────────────────────────────────────────────────────

console.log("=== Batch Classification ===\n");

const classifier = new IntentClassifier();

const batchInputs = [
  "create a modal dialog",
  "add a click handler",
  "make the text red",
  "show if user is admin",
  "fix the indentation error",
];

const batchResults = classifier.classifyBatch(batchInputs);
for (const result of batchResults) {
  console.log(`"${result.text}" → ${result.primaryIntent}`);
}

// ─── Custom Pattern Training ─────────────────────────────────────────────────

console.log("\n=== Training with Custom Examples ===\n");

const trainingExamples = [
  { text: "scaffold a new page", intent: Intent.CREATE_COMPONENT },
  { text: "wire up the submit button", intent: Intent.ADD_HANDLER },
  { text: "theme the navbar", intent: Intent.ADD_STYLE },
  { text: "persist the user preferences", intent: Intent.ADD_STATE },
  { text: "guard the admin route", intent: Intent.ADD_CONDITIONAL },
];

classifier.train(trainingExamples);

const afterTraining = [
  "scaffold a new about page",
  "wire up the cancel button",
  "theme the sidebar",
];

for (const input of afterTraining) {
  const result = classifier.classify(input);
  console.log(`"${input}" → ${result.primaryIntent} (${(result.confidence * 100).toFixed(0)}%)`);
}

// ─── Training Data Generation ────────────────────────────────────────────────

console.log("\n=== Generated Training Data ===\n");

const trainingData = generateTrainingData();
console.log(`Total training examples: ${trainingData.length}`);

// Count by intent
const intentCounts: Record<string, number> = {};
for (const example of trainingData) {
  intentCounts[example.primary_intent] = (intentCounts[example.primary_intent] || 0) + 1;
}
console.log("\nExamples per intent:");
for (const [intent, count] of Object.entries(intentCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${intent}: ${count}`);
}

// Show a few examples
console.log("\nSample training examples:");
for (const example of trainingData.slice(0, 5)) {
  console.log(`  "${example.input}" → ${example.primary_intent}`);
  console.log(`    entities: ${JSON.stringify(example.entities)}`);
}
