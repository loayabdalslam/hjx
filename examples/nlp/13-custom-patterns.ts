// =============================================================================
// NLP Example 13: Custom Patterns
// =============================================================================
// Extend the NLP engine with custom intent patterns, entity types,
// and templates for domain-specific use cases.
//
// Run: npx tsx examples/nlp/13-custom-patterns.ts
// =============================================================================

import {
  IntentClassifier,
  Intent,
  EntityExtractor,
  EntityType,
  TemplateGenerator,
  classifyIntent,
  extractEntities,
} from "../../src/nlp/index.js";

// ─── Custom Intent Patterns ──────────────────────────────────────────────────

console.log("=== Custom Intent Patterns ===\n");

const classifier = new IntentClassifier();

// Before custom patterns
console.log("Before training:");
const testPhrases = [
  "scaffold a new page",
  "wire up the button",
  "hook the API",
  "theme the sidebar",
  "stub the service",
];

for (const phrase of testPhrases) {
  const result = classifier.classify(phrase);
  console.log(`  "${phrase}" → ${result.primaryIntent} (${(result.confidence * 100).toFixed(0)}%)`);
}

// Train with custom examples
console.log("\nTraining with custom patterns...");
classifier.train([
  { text: "scaffold a new page", intent: Intent.CREATE_COMPONENT },
  { text: "scaffold a new component", intent: Intent.CREATE_COMPONENT },
  { text: "wire up the submit button", intent: Intent.ADD_HANDLER },
  { text: "wire up the click handler", intent: Intent.ADD_HANDLER },
  { text: "hook the API endpoint", intent: Intent.ADD_SCRIPT },
  { text: "theme the sidebar with dark colors", intent: Intent.ADD_STYLE },
  { text: "stub the authentication service", intent: Intent.ADD_SCRIPT },
  { text: "guard the admin route", intent: Intent.ADD_CONDITIONAL },
  { text: "hydrate the form data", intent: Intent.ADD_STATE },
  { text: "paginate the results list", intent: Intent.ADD_LOOP },
]);

// After training
console.log("\nAfter training:");
for (const phrase of testPhrases) {
  const result = classifier.classify(phrase);
  console.log(`  "${phrase}" → ${result.primaryIntent} (${(result.confidence * 100).toFixed(0)}%)`);
}

// ─── Custom Entity Types ─────────────────────────────────────────────────────

console.log("\n=== Custom Entity Types ===\n");

const extractor = new EntityExtractor();

// Add Tailwind-specific patterns
extractor.addCustomPattern(
  EntityType.CSS_CLASS,
  /\b(bg|text|border|p|px|py|m|mx|my|w|h|min|max|rounded|shadow|flex|grid|gap|items|justify|space|font)-[\w\[\]\/\.:-]+/gi
);

// Add API-specific patterns
extractor.addCustomPattern(
  EntityType.PROPERTY,
  /\b(POST|GET|PUT|DELETE|PATCH)\s+\/api\/[\w\/]+/gi
);

// Add framework-specific patterns
extractor.addCustomPattern(
  EntityType.LAYOUT_ELEMENT,
  /\b(DataTable|Chart|Calendar|DatePicker|TimeLine|TreeView|FileUpload|Avatar|Tooltip|Popover|Breadcrumb|Tabs|Accordion|Carousel)\b/gi
);

const customTexts = [
  "style with bg-blue-500 text-white rounded-lg p-4 shadow-md flex gap-2",
  "call GET /api/users and POST /api/orders",
  "add a DataTable with Chart and Calendar components",
  "use flex items-center justify-between space-x-4",
  "add font-bold text-2xl tracking-tight",
];

for (const text of customTexts) {
  const entities = extractor.extractEntities(text);
  console.log(`"${text}"`);
  for (const e of entities) {
    console.log(`  [${e.type}] "${e.value}"`);
  }
  console.log();
}

// ─── Custom Templates ────────────────────────────────────────────────────────

console.log("=== Custom Templates ===\n");

const gen = new TemplateGenerator();

// E-Commerce Product Card
gen.addTemplate({
  id: "product-card",
  name: "Product Card",
  description: "E-commerce product card with image, price, and add-to-cart",
  intents: [Intent.CREATE_COMPONENT],
  slots: [
    { name: "componentName", type: "string", default: "ProductCard", required: true },
    { name: "productName", type: "string", default: "Product", required: false },
  ],
  generate: (p) => `component ${p.componentName}

state:
  isHovered = false
  quantity = 1

layout:
  view.product-card(class="hovered-{{isHovered}}" on mouseenter -> onHover on mouseleave -> onLeave):
    view.image-area:
      text: "Product Image"
    view.info:
      text.product-name: "${p.productName}"
      text.product-price: "$99.99"
      view.rating:
        text: "★★★★☆ (4.5)"
    view.actions:
      button.add-btn (on click -> addToCart): "Add to Cart"

style:
  .product-card { border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; transition: all 0.2s; }
  .product-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
  .image-area { aspect-ratio: 4/3; background: #f3f4f6; display: flex; align-items: center; justify-content: center; }
  .info { padding: 16px; }
  .product-name { font-weight: 600; font-size: 16px; }
  .product-price { font-weight: 700; font-size: 20px; color: #059669; margin-top: 4px; }
  .rating { color: #f59e0b; margin-top: 4px; }
  .actions { padding: 0 16px 16px; }
  .add-btn { width: 100%; padding: 10px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }

handlers:
  onHover:
    set isHovered = true
  onLeave:
    set isHovered = false
  addToCart:
    log "Added to cart"
`,
});

// Data Table
gen.addTemplate({
  id: "data-table",
  name: "Data Table",
  description: "Sortable data table with pagination",
  intents: [Intent.CREATE_COMPONENT],
  slots: [
    { name: "componentName", type: "string", default: "DataTable", required: true },
  ],
  generate: (p) => `component ${p.componentName}

state:
  data = [
    { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob", email: "bob@example.com", role: "User" },
    { id: 3, name: "Carol", email: "carol@example.com", role: "User" }
  ]
  sortColumn = "name"
  sortDirection = "asc"
  currentPage = 1
  searchQuery = ""

layout:
  view.table-container:
    view.table-toolbar:
      input.search (placeholder="Search..." bind value <-> searchQuery)
    view.table-wrapper:
      view.table:
        view.thead:
          view.tr:
            view.th: "Name"
            view.th: "Email"
            view.th: "Role"
        view.tbody:
          for (row in data):
            view.tr:
              view.td: "{{row.name}}"
              view.td: "{{row.email}}"
              view.td: "{{row.role}}"
    view.table-footer:
      text: "Showing {{data.length}} entries"

style:
  .table-container { background: white; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
  .table-toolbar { padding: 16px; border-bottom: 1px solid #e5e7eb; }
  .search { padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; width: 250px; }
  .table { width: 100%; border-collapse: collapse; }
  .thead { background: #f9fafb; }
  .th { padding: 12px 16px; text-align: left; font-weight: 600; font-size: 13px; color: #6b7280; text-transform: uppercase; }
  .td { padding: 12px 16px; border-top: 1px solid #e5e7eb; font-size: 14px; }
  .tr:hover .td { background: #f9fafb; }
  .table-footer { padding: 12px 16px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280; }

handlers:
  sort:
    log "Sort by column"
`,
});

// Use the custom templates
const customQueries = [
  "create a product card",
  "create a data table",
];

for (const query of customQueries) {
  const intent = classifyIntent(query);
  const entities = extractEntities(query);
  const result = gen.generate(intent, entities);

  console.log(`"${query}" → template: ${result.templateId}`);
  console.log(result.hjx.slice(0, 200) + "...\n");
}

// ─── Domain-Specific Pipeline ────────────────────────────────────────────────

console.log("=== Domain-Specific: Dashboard Builder ===\n");

// Custom patterns for dashboard terminology
const dashClassifier = new IntentClassifier();
dashClassifier.train([
  { text: "add a metric card for total revenue", intent: Intent.CREATE_COMPONENT },
  { text: "show a bar chart of monthly sales", intent: Intent.MODIFY_LAYOUT },
  { text: "add a filter dropdown for date range", intent: Intent.ADD_STATE },
  { text: "refresh data every 30 seconds", intent: Intent.ADD_SCRIPT },
  { text: "highlight rows where revenue exceeds threshold", intent: Intent.ADD_CONDITIONAL },
]);

const dashQueries = [
  "add a metric card for total revenue",
  "show a bar chart of monthly sales",
  "add a filter dropdown for date range",
  "refresh data every 30 seconds",
  "highlight rows where revenue exceeds threshold",
];

for (const q of dashQueries) {
  const result = dashClassifier.classify(q);
  console.log(`"${q}" → ${result.primaryIntent}`);
}
