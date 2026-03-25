// =============================================================================
// NLP Example 04: Error Detection and Correction
// =============================================================================
// Detect syntax errors, semantic issues, and auto-correct common mistakes.
//
// Run: npx tsx examples/nlp/04-error-detection.ts
// =============================================================================

import {
  detectErrors,
  correctCode,
  ErrorDetector,
  ErrorCorrector,
  DiagnosticCode,
  DiagnosticSeverity,
} from "../../src/nlp/index.js";

// ─── Error Detection ─────────────────────────────────────────────────────────

console.log("=== Error Detection ===\n");

const brokenCodes = [
  {
    name: "Missing colon after state",
    code: `component Test
state
  x = 0
layout:
  text: "hello"
`,
  },
  {
    name: "Missing colon after layout",
    code: `component Test
state:
  x = 0
layout
  text: "hello"
`,
  },
  {
    name: "Invalid component name",
    code: `component 123Bad
state:
  x = 0
`,
  },
  {
    name: "Undefined variable in template",
    code: `component Test
state:
  x = 0
layout:
  text: "{{y}}"
`,
  },
  {
    name: "Undefined handler reference",
    code: `component Test
state:
  x = 0
layout:
  button (on click -> missing): "Click"
`,
  },
  {
    name: "Unused state variable",
    code: `component Test
state:
  unused = 0
  used = 1
layout:
  text: "{{used}}"
`,
  },
  {
    name: "Missing component declaration",
    code: `state:
  x = 0
layout:
  text: "hello"
`,
  },
  {
    name: "Typo in keyword",
    code: `componet Test
state:
  x = 0
`,
  },
  {
    name: "Missing colon on handlers",
    code: `component Test
state:
  x = 0
layout:
  button (on click -> inc): "+"
handlers
  inc:
    set x = x + 1
`,
  },
  {
    name: "Missing layout block",
    code: `component Test
state:
  x = 0
handlers:
  inc:
    set x = x + 1
`,
  },
];

const detector = new ErrorDetector();

for (const { name, code } of brokenCodes) {
  console.log(`--- ${name} ---`);
  const diagnostics = detector.detectErrors(code);

  if (diagnostics.length === 0) {
    console.log("  No errors detected ✓");
  } else {
    for (const diag of diagnostics) {
      const sev = diag.severity;
      const icon = sev === "ERROR" ? "✗" : sev === "WARNING" ? "⚠" : "ℹ";
      console.log(`  ${icon} [${diag.code}] ${diag.message}`);
      console.log(`    line ${diag.line}, col ${diag.column}`);
      if (diag.quickFix) {
        console.log(`    fix: ${diag.quickFix.title}`);
      }
    }
  }
  console.log();
}

// ─── Error Explanation ───────────────────────────────────────────────────────

console.log("=== Error Explanations ===\n");

const errorCodes = [
  DiagnosticCode.SYNTAX_ERROR,
  DiagnosticCode.INDENTATION_ERROR,
  DiagnosticCode.UNDEFINED_VARIABLE,
  DiagnosticCode.UNDEFINED_HANDLER,
  DiagnosticCode.UNUSED_VARIABLE,
  DiagnosticCode.MISSING_COLON,
  DiagnosticCode.MISSING_BLOCK,
];

for (const code of errorCodes) {
  const diag = {
    code,
    severity: DiagnosticSeverity.ERROR,
    message: "Example error",
    line: 1,
    column: 1,
    source: "test",
  };
  const explanation = detector.explainError(diag);
  console.log(`${code}:`);
  console.log(`  ${explanation}\n`);
}

// ─── Auto-Correction ─────────────────────────────────────────────────────────

console.log("=== Auto-Correction ===\n");

const corrector = new ErrorCorrector();

const fixableCodes = [
  {
    name: "Fix missing colon",
    code: `component Test
state
  x = 0
`,
  },
  {
    name: "Fix typo: componet → component",
    code: `componet Test
state:
  x = 0
`,
  },
  {
    name: "Fix missing component declaration",
    code: `state:
  x = 0
layout:
  text: "hello"
`,
  },
  {
    name: "Fix single quotes to double",
    code: `component Test
state:
  name = 'hello'
`,
  },
  {
    name: "Fix trailing whitespace",
    code: "component Test  \nstate:  \n  x = 0  \n",
  },
  {
    name: "Fix missing final newline",
    code: `component Test
state:
  x = 0`,
  },
];

for (const { name, code } of fixableCodes) {
  console.log(`--- ${name} ---`);
  console.log("BEFORE:");
  console.log(code);

  const result = corrector.correctCode(code);
  console.log("AFTER:");
  console.log(result.corrected);
  console.log(`Changes: ${result.changes.length}`);
  for (const change of result.changes) {
    console.log(`  - ${change.description}`);
  }
  console.log(`Success: ${result.success}`);
  console.log();
}

// ─── Fix Suggestions ─────────────────────────────────────────────────────────

console.log("=== Fix Suggestions ===\n");

const brokenCode = `componet Test
state
  x = 0
layout
  text: "{{undefined}}"
`;

const diagnostics = detector.detectErrors(brokenCode);
const suggestions = corrector.suggestFixes(diagnostics);

console.log("For broken code:");
console.log(brokenCode);
console.log("Suggestions:");
for (const suggestion of suggestions) {
  console.log(`  - ${suggestion.description} (${(suggestion.confidence * 100).toFixed(0)}%)`);
  console.log(`    preview: ${suggestion.preview}`);
}

// ─── Auto-Fix with Limit ────────────────────────────────────────────────────

console.log("\n=== Auto-Fix (Limited Changes) ===\n");

const messyCode = `componet App
state
  count = 0
  name = 'test'
layout
  text: "hello"
`;

const autoFixed = corrector.autoFix(messyCode, 3);
console.log("Original:");
console.log(messyCode);
console.log("Auto-fixed (max 3 changes):");
console.log(autoFixed.corrected);
console.log(`Applied ${autoFixed.changes.length} changes`);
for (const change of autoFixed.changes) {
  console.log(`  - ${change.description}`);
}
