# NLP Engine

HJX includes a built-in NLP engine that understands natural language and can generate, analyze, and complete HJX code.

## Overview

The NLP engine enables:

- **Intent Classification** — Understand what the user wants (create component, add handler, etc.)
- **Entity Extraction** — Extract component names, state variables, event types from text
- **Code Generation** — Generate HJX code from natural language descriptions
- **Error Detection** — Find and fix syntax/semantic errors automatically
- **Code Completion** — Context-aware suggestions while typing
- **Semantic Search** — Find similar components using natural language

## Quick Start

```typescript
import { HJXNLPEngine } from './src/nlp/index.js';

const engine = new HJXNLPEngine();

// Classify intent
const intent = engine.classifyIntent('create a counter with increment button');
// → { primaryIntent: 'CREATE_COMPONENT', confidence: 0.85, ... }

// Extract entities
const entities = engine.extractEntities('add a count variable initialized to 0');
// → [{ type: 'STATE_VARIABLE', value: 'count' }, ...]

// Generate code
const result = await engine.generateCode('create a login form');
console.log(result.code);
// → component LoginForm
//    state:
//      email = ""
//      password = ""
//    ...

// Detect errors
const errors = engine.detectErrors('component Test\nstate\n  x = 0');
// → [{ code: 'MISSING_COLON', message: 'Missing colon after state' }]

// Auto-correct
const corrected = engine.correctCode('componet Test\nstate\n  x = 0');
// → { corrected: 'component Test\nstate:\n  x = 0', success: true }
```

## Architecture

```
┌────────────────────────────────────────────────────┐
│                   HJX NLP Engine                   │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │  Tokenizer   │→│  Enhanced    │→│  Feature  │  │
│  │  (HJX syntax)│  │  Parser      │  │  Extractor│  │
│  └─────────────┘  └──────────────┘  └──────────┘  │
│         ↓                ↓                ↓        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │  Intent      │  │  Entity      │  │  Code    │  │
│  │  Classifier  │  │  Extractor   │  │  Generator│  │
│  └─────────────┘  └──────────────┘  └──────────┘  │
│         ↓                ↓                ↓        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │  Error       │  │  Code        │  │  Semantic│  │
│  │  Detector    │  │  Completion  │  │  Search  │  │
│  └─────────────┘  └──────────────┘  └──────────┘  │
│                                                    │
└────────────────────────────────────────────────────┘
```

## Modules

| Module | File | Description |
|--------|------|-------------|
| Tokenizer | `src/nlp/tokenizer/tokenizer.ts` | Custom HJX tokenizer with INDENT/DEDENT |
| Enhanced Parser | `src/nlp/parser/enhanced-parser.ts` | AST with positions, symbols, semantics |
| Error Recovery | `src/nlp/parser/error-recovery.ts` | Parse with error recovery and quick fixes |
| Canonical Formatter | `src/nlp/parser/canonical-formatter.ts` | Normalize HJX code formatting |
| Feature Extractor | `src/nlp/features/extractor.ts` | Structural/lexical/semantic features |
| Embeddings | `src/nlp/features/embeddings.ts` | Code similarity using vector embeddings |
| Feature Store | `src/nlp/features/store.ts` | Store and search component features |
| Intent Classifier | `src/nlp/intent/classifier.ts` | Classify natural language to HJX intents |
| Entity Extractor | `src/nlp/entities/extractor.ts` | Extract HJX entities from text |
| Relation Extractor | `src/nlp/entities/relations.ts` | Find relationships between entities |
| Template Generator | `src/nlp/generation/template-generator.ts` | Template-based HJX generation |
| Neural Generator | `src/nlp/generation/neural-generator.ts` | AI-powered code generation |
| Incremental Generator | `src/nlp/generation/incremental-generator.ts` | Code completion engine |
| Error Detector | `src/nlp/errors/detector.ts` | Detect 17 types of HJX errors |
| Error Corrector | `src/nlp/errors/corrector.ts` | Auto-fix common errors |
| Semantic Search | `src/nlp/completion/search.ts` | Search components by meaning |

## Intent Categories

The classifier recognizes 13 intent categories:

| Intent | Example Input |
|--------|---------------|
| `CREATE_COMPONENT` | "create a login form" |
| `ADD_STATE` | "add a count variable" |
| `ADD_HANDLER` | "add a click handler" |
| `ADD_STYLE` | "make the background blue" |
| `ADD_CONDITIONAL` | "show if logged in" |
| `ADD_LOOP` | "iterate over items" |
| `BIND_DATA` | "bind input to variable" |
| `ADD_IMPORT` | "import Button component" |
| `FIX_ERROR` | "fix the syntax error" |
| `EXPLAIN_CODE` | "explain what this does" |
| `REFACTOR` | "optimize performance" |
| `ADD_COMPUTED` | "add computed total" |
| `ADD_SCRIPT` | "add background task" |

## Code Generation Templates

Built-in templates for common patterns:

- **Counter** — Increment/decrement with buttons
- **Form** — Multi-field form with validation
- **List** — Todo/list with add/remove
- **Modal** — Dialog with open/close
- **Dashboard** — Stats grid with cards
- **Conditional** — Show/hide blocks
- **Loop** — Iterate and render items

```typescript
import { generateCode } from './src/nlp/generation/template-generator.js';

// Generates a full counter component
const code = generateCode('create a counter');

// Generates a form with email field
const code = generateCode('create a form with email field');
```
