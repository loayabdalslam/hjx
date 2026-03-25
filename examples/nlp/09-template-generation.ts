// =============================================================================
// NLP Example 09: Template-Based Code Generation
// =============================================================================
// Generate HJX code using templates with slot filling and scoring.
// Demonstrates all built-in templates and custom template creation.
//
// Run: npx tsx examples/nlp/09-template-generation.ts
// =============================================================================

import {
  TemplateGenerator,
  classifyIntent,
  extractEntities,
  Intent,
} from "../../src/nlp/index.js";

// ─── All Built-in Templates ──────────────────────────────────────────────────

console.log("=== All Built-in Templates ===\n");

const gen = new TemplateGenerator();
const templates = gen.getTemplates();

for (const template of templates) {
  console.log(`--- ${template.name} (${template.id}) ---`);
  console.log(`Description: ${template.description}`);
  console.log(`Intents: ${template.intents.join(", ")}`);
  console.log(`Slots:`);
  for (const slot of template.slots) {
    console.log(`  - ${slot.name}: ${slot.type} (default: "${slot.default}", required: ${slot.required})`);
  }
  console.log();
}

// ─── Generate Each Template ──────────────────────────────────────────────────

console.log("=== Generate Each Template ===\n");

const generateQueries = [
  { text: "create a counter", template: "counter" },
  { text: "create a form with email", template: "form" },
  { text: "create a todo list", template: "list" },
  { text: "create a modal dialog", template: "modal" },
  { text: "create a dashboard", template: "dashboard" },
];

for (const { text } of generateQueries) {
  const intent = classifyIntent(text);
  const entities = extractEntities(text);
  const result = gen.generate(intent, entities);

  console.log(`--- "${text}" → template: ${result.templateId} ---`);
  console.log(result.hjx);
}

// ─── Custom Template ─────────────────────────────────────────────────────────

console.log("=== Custom Template: Login Form ===\n");

gen.addTemplate({
  id: "login-form",
  name: "Login Form",
  description: "A login form with email and password",
  intents: [Intent.CREATE_COMPONENT],
  slots: [
    { name: "componentName", type: "string", default: "LoginForm", required: true },
    { name: "hasRemember", type: "boolean", default: "true", required: false },
  ],
  generate: (p) => `component ${p.componentName}

state:
  email = ""
  password = ""
  rememberMe = false
  errorMessage = ""

layout:
  view.login-container:
    text.title: "Sign In"
    if (errorMessage):
      view.error-banner: "{{errorMessage}}"
    view.form:
      input.email-input (type="email" placeholder="Email" bind value <-> email)
      input.password-input (type="password" placeholder="Password" bind value <-> password)
      if (${p.hasRemember === "true"}):
        view.remember-row:
          input.checkbox (type="checkbox" bind value <-> rememberMe)
          text: "Remember me"
      button.submit-btn (on click -> login): "Sign In"

style:
  .login-container { max-width: 400px; margin: 80px auto; padding: 32px; }
  .title { font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 24px; }
  .error-banner { background: #fee2e2; color: #dc2626; padding: 12px; border-radius: 8px; margin-bottom: 16px; }
  .form { display: flex; flex-direction: column; gap: 16px; }
  .email-input, .password-input { padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }
  .remember-row { display: flex; align-items: center; gap: 8px; font-size: 14px; }
  .submit-btn { padding: 14px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }

handlers:
  login:
    set errorMessage = ""
    log "Login attempted for {{email}}"
`,
});

const loginResult = gen.generate(
  classifyIntent("create a login form"),
  extractEntities("create a login form")
);

console.log(`Template: ${loginResult.templateId}`);
console.log(loginResult.hjx);

// ─── Template Scoring Comparison ─────────────────────────────────────────────

console.log("=== Template Scoring ===\n");

const scoreTests = [
  "create a counter",
  "create a counter component",
  "make a counter",
  "I need a counter that counts",
  "build a simple counter app",
];

for (const text of scoreTests) {
  const intent = classifyIntent(text);
  const entities = extractEntities(text);
  const result = gen.generate(intent, entities);

  console.log(`"${text}"`);
  console.log(`  → ${result.templateId} (confidence: ${(result.confidence * 100).toFixed(0)}%)`);
  if (result.warnings.length > 0) {
    console.log(`  warnings: ${result.warnings.join(", ")}`);
  }
}

// ─── Slot Filling Demo ───────────────────────────────────────────────────────

console.log("\n=== Slot Filling ===\n");

const slotTests = [
  "create a counter called MyCounter",
  "create a form with name and email fields",
  "create a todo list with items",
  "create a counter starting at 100",
];

for (const text of slotTests) {
  const intent = classifyIntent(text);
  const entities = extractEntities(text);
  const result = gen.generate(intent, entities);

  console.log(`"${text}"`);
  console.log(`  template: ${result.templateId}`);
  console.log(`  entities: ${JSON.stringify(entities.map(e => `${e.type}:${e.value}`))}`);
  console.log();
}
