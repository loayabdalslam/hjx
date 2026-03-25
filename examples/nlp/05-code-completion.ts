// =============================================================================
// NLP Example 05: Code Completion
// =============================================================================
// Context-aware code completion for HJX. Provides keyword, snippet,
// variable, handler, and property suggestions based on cursor position.
//
// Run: npx tsx examples/nlp/05-code-completion.ts
// =============================================================================

import {
  getCompletions,
  IncrementalGenerator,
  CompletionKind,
  CompletionContext,
} from "../../src/nlp/index.js";

const gen = new IncrementalGenerator();

// ─── Top-Level Completions ───────────────────────────────────────────────────

console.log("=== Top-Level Completions ===\n");

const topLevelCtx: CompletionContext = {
  source: "component MyApp\n",
  cursorLine: 2,
  cursorColumn: 1,
};

const topItems = gen.getCompletions(topLevelCtx);
console.log("After 'component MyApp', pressing Tab:");
for (const item of topItems.slice(0, 8)) {
  console.log(`  [${item.kind}] ${item.label} → ${item.detail}`);
}

// ─── State Block Completions ─────────────────────────────────────────────────

console.log("\n=== State Block Completions ===\n");

const stateCtx: CompletionContext = {
  source: `component MyApp

state:
  `,
  cursorLine: 4,
  cursorColumn: 3,
};

const stateItems = gen.getCompletions(stateCtx);
console.log("Inside 'state:' block:");
for (const item of stateItems.slice(0, 10)) {
  console.log(`  [${item.kind}] ${item.label} → ${item.detail}`);
  console.log(`    insert: "${item.insertText.replace(/\n/g, "\\n")}"`);
}

// ─── Layout Completions ──────────────────────────────────────────────────────

console.log("\n=== Layout Block Completions ===\n");

const layoutCtx: CompletionContext = {
  source: `component Counter

state:
  count = 0
  showMenu = false

layout:
  `,
  cursorLine: 7,
  cursorColumn: 3,
};

const layoutItems = gen.getCompletions(layoutCtx);
console.log("Inside 'layout:' block with state vars [count, showMenu]:");
for (const item of layoutItems.slice(0, 12)) {
  console.log(`  [${item.kind}] ${item.label} → ${item.detail}`);
}

// ─── Handler Completions ─────────────────────────────────────────────────────

console.log("\n=== Handler Block Completions ===\n");

const handlerCtx: CompletionContext = {
  source: `component Counter

state:
  count = 0

layout:
  button (on click -> inc): "+"

handlers:
  `,
  cursorLine: 10,
  cursorColumn: 3,
};

const handlerItems = gen.getCompletions(handlerCtx);
console.log("Inside 'handlers:' block:");
for (const item of handlerItems.slice(0, 8)) {
  console.log(`  [${item.kind}] ${item.label} → ${item.detail}`);
  console.log(`    insert: "${item.insertText.replace(/\n/g, "\\n")}"`);
}

// ─── Style Completions ───────────────────────────────────────────────────────

console.log("\n=== Style Block Completions ===\n");

const styleCtx: CompletionContext = {
  source: `component Card

state:
  title = "Card"

layout:
  view.card:
    text: "{{title}}"

style:
  `,
  cursorLine: 10,
  cursorColumn: 3,
};

const styleItems = gen.getCompletions(styleCtx);
console.log("Inside 'style:' block:");
for (const item of styleItems.slice(0, 10)) {
  console.log(`  [${item.kind}] ${item.label} → ${item.detail}`);
}

// ─── Completions with Existing Context ───────────────────────────────────────

console.log("\n=== Completions with Rich Context ===\n");

const richCtx: CompletionContext = {
  source: `component Dashboard

imports:
  Card from "./components/Card.hjx"
  Button from "./components/Button.hjx"

state:
  uptime = 0
  status = "Operational"
  alerts = ["Alert 1", "Alert 2"]
  showNotice = false

layout:
  `,
  cursorLine: 13,
  cursorColumn: 3,
};

const richItems = gen.getCompletions(richCtx);
console.log("Layout with imports [Card, Button] and state [uptime, status, alerts, showNotice]:");
for (const item of richItems.slice(0, 15)) {
  console.log(`  [${item.kind}] ${item.label} → ${item.detail}`);
}

// ─── Completions Inside Nested Blocks ────────────────────────────────────────

console.log("\n=== Nested Block Completions ===\n");

const nestedCtx: CompletionContext = {
  source: `component List

state:
  items = ["a", "b", "c"]
  newItem = ""

layout:
  view.container:
    `,
  cursorLine: 8,
  cursorColumn: 5,
};

const nestedItems = gen.getCompletions(nestedCtx);
console.log("Inside layout > view.container:");
for (const item of nestedItems.slice(0, 10)) {
  console.log(`  [${item.kind}] ${item.label} → ${item.detail}`);
}

// ─── Completion Scoring ──────────────────────────────────────────────────────

console.log("\n=== Completion Scoring ===\n");

const scoreCtx: CompletionContext = {
  source: `component Test

state:
  count = 0

layout:
  `,
  cursorLine: 6,
  cursorColumn: 3,
};

const scored = gen.getCompletions(scoreCtx);
console.log("Items sorted by score:");
for (const item of scored.slice(0, 8)) {
  console.log(`  ${item.score.toFixed(2)} [${item.kind}] ${item.label}`);
}
