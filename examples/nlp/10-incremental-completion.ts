// =============================================================================
// NLP Example 10: Incremental Code Completion
// =============================================================================
// Simulate an IDE-like completion experience at various cursor positions.
// Shows how the completion engine provides context-aware suggestions.
//
// Run: npx tsx examples/nlp/10-incremental-completion.ts
// =============================================================================

import {
  getCompletions,
  IncrementalGenerator,
  CompletionContext,
  CompletionKind,
} from "../../src/nlp/index.js";

const gen = new IncrementalGenerator();

function showCompletions(label: string, ctx: CompletionContext, maxItems = 8) {
  const items = gen.getCompletions(ctx);
  console.log(`\n=== ${label} ===`);
  console.log(`Cursor: line ${ctx.cursorLine}, col ${ctx.cursorColumn}`);
  console.log("Completions:");
  for (const item of items.slice(0, maxItems)) {
    console.log(`  ${item.score.toFixed(2)} [${item.kind.padEnd(14)}] ${item.label.padEnd(24)} → ${item.insertText.replace(/\n/g, "\\n").slice(0, 50)}`);
  }
}

// ─── Scenario 1: Starting a new component ────────────────────────────────────

showCompletions("New File - Empty", {
  source: "",
  cursorLine: 1,
  cursorColumn: 1,
});

showCompletions("After 'component'", {
  source: "component ",
  cursorLine: 1,
  cursorColumn: 11,
});

showCompletions("After 'component MyApp'", {
  source: "component MyApp\n",
  cursorLine: 2,
  cursorColumn: 1,
});

// ─── Scenario 2: Inside state block ──────────────────────────────────────────

showCompletions("Inside empty state block", {
  source: `component MyApp

state:
  `,
  cursorLine: 4,
  cursorColumn: 3,
});

showCompletions("After existing state var", {
  source: `component MyApp

state:
  count = 0
  `,
  cursorLine: 5,
  cursorColumn: 3,
});

// ─── Scenario 3: Inside layout block ─────────────────────────────────────────

showCompletions("Empty layout block", {
  source: `component MyApp

state:
  count = 0

layout:
  `,
  cursorLine: 7,
  cursorColumn: 3,
});

showCompletions("Inside view.container", {
  source: `component MyApp

state:
  count = 0
  items = []

layout:
  view.container:
    `,
  cursorLine: 9,
  cursorColumn: 5,
});

showCompletions("After button element", {
  source: `component MyApp

state:
  count = 0

layout:
  view.container:
    text: "Count: {{count}}"
    `,
  cursorLine: 9,
  cursorColumn: 5,
});

// ─── Scenario 4: Inside handlers block ───────────────────────────────────────

showCompletions("Empty handlers block", {
  source: `component MyApp

state:
  count = 0

layout:
  button (on click -> inc): "+"

handlers:
  `,
  cursorLine: 10,
  cursorColumn: 3,
});

showCompletions("Inside handler body", {
  source: `component MyApp

state:
  count = 0
  name = ""

layout:
  button (on click -> inc): "+"

handlers:
  inc:
    `,
  cursorLine: 12,
  cursorColumn: 5,
});

showCompletions("After handler statement", {
  source: `component MyApp

state:
  count = 0

layout:
  button (on click -> inc): "+"

handlers:
  inc:
    set count = count + 1
    `,
  cursorLine: 12,
  cursorColumn: 5,
});

// ─── Scenario 5: Inside style block ──────────────────────────────────────────

showCompletions("Empty style block", {
  source: `component MyApp

layout:
  view.card:
    text: "Hello"

style:
  `,
  cursorLine: 8,
  cursorColumn: 3,
});

showCompletions("After CSS class", {
  source: `component MyApp

layout:
  view.card:
    text: "Hello"

style:
  .card { padding: 16px; }
  `,
  cursorLine: 9,
  cursorColumn: 3,
});

// ─── Scenario 6: Rich context with imports ───────────────────────────────────

showCompletions("Layout with imports available", {
  source: `component Dashboard

imports:
  Card from "./components/Card.hjx"
  Button from "./components/Button.hjx"

state:
  uptime = 0
  status = "OK"
  alerts = []

layout:
  `,
  cursorLine: 11,
  cursorColumn: 3,
});

// ─── Scenario 7: Computed block ──────────────────────────────────────────────

showCompletions("Inside computed block", {
  source: `component Cart

state:
  items = []
  tax = 0.08

computed:
  `,
  cursorLine: 7,
  cursorColumn: 3,
});

// ─── Scenario 8: Nested control flow ─────────────────────────────────────────

showCompletions("Inside if block", {
  source: `component App

state:
  isLoggedIn = false

layout:
  if (isLoggedIn):
    `,
  cursorLine: 7,
  cursorColumn: 5,
});

showCompletions("Inside for loop", {
  source: `component List

state:
  items = ["a", "b", "c"]

layout:
  for (item in items):
    `,
  cursorLine: 7,
  cursorColumn: 5,
});

// ─── Scenario 9: Import block ────────────────────────────────────────────────

showCompletions("Inside imports block", {
  source: `component App

imports:
  `,
  cursorLine: 4,
  cursorColumn: 3,
});

// ─── Scenario 10: Complex component mid-edit ─────────────────────────────────

showCompletions("Mid-edit complex component", {
  source: `component UserDashboard

imports:
  Card from "./Card.hjx"
  Button from "./Button.hjx"

state:
  username = "Alice"
  isLoggedIn = true
  followerCount = 150
  posts = []
  showMenu = false

layout:
  view.dashboard:
    text.greeting: "Welcome {{username}}"
    if (isLoggedIn):
      view.stats:
        Card (title="Followers"):
          text: "{{followerCount}}"
        `,
  cursorLine: 19,
  cursorColumn: 9,
});
