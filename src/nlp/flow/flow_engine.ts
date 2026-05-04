/**
 * HJX Flow-State Engine
 * 
 * Translates natural English descriptions directly into HJX code.
 * Users can write in plain English, mix with code, or use a hybrid approach.
 * 
 * Examples:
 *   "create a counter component with increment and decrement" → full HJX
 *   "add a button that saves the form" → partial HJX
 *   "make the card centered with a shadow" → style block
 */

import { HJXAst } from "../../types.js";
import { parseHJX } from "../../parser.js";
import { COMPONENT_PATTERNS } from "./component_patterns.js";

// ============================================================
// Section 1: Intent Pattern Registry
// Maps natural language patterns to HJX AST transformations
// ============================================================

export interface FlowPattern {
  id: string;
  patterns: RegExp[];
  handler: (match: RegExpMatchArray, context: FlowContext) => FlowResult;
  description: string;
}

export interface FlowContext {
  existingAst?: HJXAst;
  variables: Record<string, any>;
  components: string[];
  handlers: string[];
  stateKeys: string[];
}

export interface FlowResult {
  type: "component" | "state" | "layout" | "style" | "handler" | "api" | "mixed";
  hjx: string;
  newState?: Record<string, any>;
  newHandlers?: string[];
  confidence: number; // 0-1
}

// ============================================================
// Section 2: Pattern Definitions
// ============================================================

const FLOW_PATTERNS: FlowPattern[] = [
  ...COMPONENT_PATTERNS,
  // --- Counter Pattern (MUST be before create-component) ---
  {
    id: "counter",
    patterns: [
      /create\s+(?:a|an|the)?\s*counter(?:\s+component)?/i,
      /make\s+(?:a|an|the)?\s*counter/i,
      /i\s+need\s+(?:a|an|the)?\s*counter/i,
      /counter\s+(?:with|that|component)/i,
      /counter\s+with\s+(increment|decrement|reset)/i,
    ],
    description: "Generate a counter component with state and handlers",
    handler: (match, ctx) => {
      const hasReset = match[0].toLowerCase().includes("reset");
      return {
        type: "component",
        hjx: `component Counter

state:
  count = 0

layout:
  view#root.card:
    text.title: "Count: {{count}}"
    view.buttons:
      button.primary (on click -> inc): "Increase"
      button.secondary (on click -> dec): "Decrease"
${hasReset ? '      button.ghost (on click -> reset): "Reset"\n' : ""}
style:
  .card:
    card
    text align center
    display flex
    flex direction column
    gap 24px

  .title:
    font size 32px
    font weight bold
    color #333

  .buttons:
    display flex
    gap 12px
    justify content center

  .primary:
    button primary

  .secondary:
    button secondary

  .ghost:
    button ghost

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
${hasReset ? `  reset:\n    set count = 0\n` : ""}`,
        newState: { count: 0 },
        newHandlers: ["inc", "dec", ...(hasReset ? ["reset"] : [])],
        confidence: 0.98,
      };
    },
  },

  // --- Component Creation ---
  {
    id: "create-component",
    patterns: [
      /create\s+(?:a|an|the)\s+(\w+)\s+component/i,
      /make\s+(?:a|an|the)\s+(\w+)\s+component/i,
      /build\s+(?:a|an|the)\s+(\w+)\s+component/i,
      /i\s+want\s+(?:a|an|the)\s+(\w+)\s+component/i,
    ],
    description: "Create a new component",
    handler: (match, ctx) => ({
      type: "component",
      hjx: `component ${capitalize(match[1])}\n\nstate:\n\nlayout:\n\nstyle:\n\nhandlers:\n`,
      confidence: 0.95,
    }),
  },

  // --- Form Pattern ---
  {
    id: "form",
    patterns: [
      /create\s+(?:a|an|the)?\s*form(?:\s+component)?/i,
      /make\s+(?:a|an|the)?\s*form/i,
      /i\s+need\s+(?:a|an|the)?\s*form/i,
      /form\s+(?:with|that|for)/i,
    ],
    description: "Generate a form component with input fields",
    handler: (match, ctx) => ({
      type: "component",
      hjx: `component Form

state:
  name = ""
  email = ""
  message = "Form submitted!"

layout:
  view.card:
    text.title: "Contact Form"
    input.field (bind value <-> name):
    text.hint: "Name: {{name}}"
    input.field (bind value <-> email):
    text.hint: "Email: {{email}}"
    button.primary (on click -> submit): "Submit"
    text.note: "{{message}}"

style:
  .card:
    card
    display flex
    flex direction column
    gap 16px

  .title:
    font size 24px
    font weight bold

  .field:
    input field

  .primary:
    button primary

handlers:
  submit:
    set message = "Hello " + name + "! Email: " + email`,
      newState: { name: "", email: "", message: "Form submitted!" },
      newHandlers: ["submit"],
      confidence: 0.95,
    }),
  },

  // --- Todo List Pattern ---
  {
    id: "todo-list",
    patterns: [
      /create\s+(?:a|an|the)?\s*todo(?:\s+list)?(?:\s+component)?/i,
      /make\s+(?:a|an|the)?\s*todo/i,
      /i\s+need\s+(?:a|an|the)?\s*todo/i,
      /todo\s+(?:app|list|component)/i,
    ],
    description: "Generate a todo list component",
    handler: (match, ctx) => ({
      type: "component",
      hjx: `component TodoList

state:
  items = ["Learn HJX", "Build something awesome"]
  newItem = ""

layout:
  view.container:
    text.title: "My Todo List"
    text.count: "Total: {{items.length}}"
    view.input-section:
      input.field (bind value <-> newItem):
      button.primary (on click -> addItem): "Add"
    view.list:
      for (item in items):
        view.todo-item:
          text: "• {{item}}"

style:
  .container:
    container
    display flex
    flex direction column
    gap 20px

  .title:
    font size 28px
    font weight bold

  .count:
    color #666
    font size 14px

  .input-section:
    display flex
    gap 12px

  .field:
    input field

  .primary:
    button primary

  .list:
    display flex
    flex direction column
    gap 12px

  .todo-item:
    card
    padding 12px

handlers:
  addItem:
    set items = [...items, newItem]
    set newItem = ""`,
      newState: { items: ["Learn HJX", "Build something awesome"], newItem: "" },
      newHandlers: ["addItem"],
      confidence: 0.95,
    }),
  },

  // --- Add State ---
  {
    id: "add-state",
    patterns: [
      /add\s+(?:a\s+)?state\s+(?:called|named|variable)?\s*(\w+)/i,
      /create\s+(?:a\s+)?state\s+(?:called|named|variable)?\s*(\w+)/i,
      /make\s+(?:a\s+)?variable\s+(?:called|named)?\s*(\w+)/i,
      /let\s+(\w+)\s*=/i,
    ],
    description: "Add a state variable",
    handler: (match, ctx) => {
      const varName = match[1];
      return {
        type: "state",
        hjx: `state:\n  ${varName} = 0`,
        newState: { [varName]: 0 },
        confidence: 0.9,
      };
    },
  },

  // --- Add Handler ---
  {
    id: "add-handler",
    patterns: [
      /add\s+(?:a\s+)?handler\s+(?:called|named)?\s*(\w+)/i,
      /create\s+(?:a\s+)?handler\s+(?:called|named)?\s*(\w+)/i,
      /make\s+(?:a\s+)?function\s+(?:called|named)?\s*(\w+)/i,
      /when\s+clicked\s+(?:do|call|run)\s+(\w+)/i,
    ],
    description: "Add an event handler",
    handler: (match, ctx) => {
      const handlerName = match[1];
      return {
        type: "handler",
        hjx: `handlers:\n  ${handlerName}:\n    log "${handlerName} called"`,
        newHandlers: [handlerName],
        confidence: 0.9,
      };
    },
  },

  // --- Style Description ---
  {
    id: "style-description",
    patterns: [
      /make\s+(?:it|the)\s+(.*)\s+with\s+(.*)/i,
      /style\s+(.*)\s+to\s+(.*)/i,
      /set\s+(.*)\s+style\s+to\s+(.*)/i,
    ],
    description: "Apply style description",
    handler: (match, ctx) => {
      const element = match[1];
      const styleDesc = match[2];
      return {
        type: "style",
        hjx: `style:\n  .${element}:\n    ${styleDesc}`,
        confidence: 0.85,
      };
    },
  },

  // --- Layout Addition ---
  {
    id: "add-layout",
    patterns: [
      /add\s+(?:a\s+)?button\s+(?:called|with)?\s*["']?([^"']+)["']?/i,
      /put\s+(?:a\s+)?button\s+(?:called|with)?\s*["']?([^"']+)["']?/i,
      /add\s+(?:a\s+)?text\s+(?:called|with)?\s*["']?([^"']+)["']?/i,
    ],
    description: "Add a layout element",
    handler: (match, ctx) => {
      const label = match[1] || "Click me";
      return {
        type: "layout",
        hjx: `layout:\n  button.primary: "${label}"`,
        confidence: 0.85,
      };
    },
  },

  // --- API Endpoint ---
  {
    id: "add-api",
    patterns: [
      /add\s+(?:an?\s+)?api\s+(?:endpoint\s+)?(?:to\s+)?(\w+)/i,
      /fetch\s+from\s+([^\s]+)/i,
      /get\s+data\s+from\s+([^\s]+)/i,
    ],
    description: "Add API endpoint",
    handler: (match, ctx) => {
      const endpoint = match[1] || "/api/data";
      return {
        type: "api",
        hjx: `api:\n  GET ${endpoint} -> fetchData`,
        confidence: 0.85,
      };
    },
  },
];

// ============================================================
// Section 3: Flow-State Parser
// Translates natural language to HJX
// ============================================================

export interface FlowParseResult {
  hjx: string;
  ast?: HJXAst;
  intent: string;
  confidence: number;
  suggestions: string[];
}

export function parseFlowState(
  input: string,
  context: Partial<FlowContext> = {}
): FlowParseResult {
  const trimmed = input.trim();

  // Check if input is already valid HJX
  if (trimmed.startsWith("component ")) {
    try {
      const ast = parseHJX(trimmed);
      return {
        hjx: trimmed,
        ast,
        intent: "raw-hjx",
        confidence: 1.0,
        suggestions: [],
      };
    } catch {
      // Not valid HJX, continue with NLP parsing
    }
  }

  // Check if input contains mixed code+language
  if (isMixedInput(trimmed)) {
    return parseMixedInput(trimmed, context);
  }

  // Try to match against flow patterns
  const ctx: FlowContext = {
    existingAst: context.existingAst,
    variables: context.variables || {},
    components: context.components || [],
    handlers: context.handlers || [],
    stateKeys: context.stateKeys || [],
  };

  for (const pattern of FLOW_PATTERNS) {
    for (const regex of pattern.patterns) {
      const match = trimmed.match(regex);
      if (match) {
        const result = pattern.handler(match, ctx);
        return {
          hjx: result.hjx,
          intent: pattern.id,
          confidence: result.confidence,
          suggestions: generateSuggestions(pattern.id, trimmed),
        };
      }
    }
  }

  // Fallback: Try to generate something reasonable from the description
  return generateFromDescription(trimmed, ctx);
}

// ============================================================
// Section 4: Mixed Code + Language Parser
// ============================================================

function isMixedInput(input: string): boolean {
  const lines = input.split("\n");
  let hasCodeLine = false;
  let hasEnglishLine = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // A line is code if it starts with HJX block keywords or layout syntax
    const isCodeLine = /^(state|layout|style|handlers|api|breakpoints|imports|script):$|^component\s/.test(trimmed);

    if (isCodeLine) {
      hasCodeLine = true;
    } else if (/\b(create|make|add|build|want|need|should|when)\b/i.test(trimmed)) {
      hasEnglishLine = true;
    }
  }

  return hasCodeLine && hasEnglishLine;
}

function parseMixedInput(input: string, ctx: Partial<FlowContext>): FlowParseResult {
  const lines = input.split("\n");
  const hjxParts: string[] = [];
  const englishParts: string[] = [];
  let currentBlock: "code" | "english" | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect if line is HJX code
    const isCode = /^(component|state:|layout:|style:|handlers:|api:|breakpoints:|imports:|script:|[a-z]+[#.])/i.test(trimmed);

    if (isCode) {
      if (currentBlock === "english" && englishParts.length > 0) {
        // Process accumulated English with patterns directly (no recursion)
        const engResult = processEnglishPatterns(englishParts.join("\n"), ctx);
        hjxParts.push(engResult.hjx);
        englishParts.length = 0;
      }
      currentBlock = "code";
      hjxParts.push(trimmed);
    } else {
      currentBlock = "english";
      englishParts.push(trimmed);
    }
  }

  // Process remaining English
  if (englishParts.length > 0) {
    const engResult = processEnglishPatterns(englishParts.join("\n"), ctx);
    hjxParts.push(engResult.hjx);
  }

  return {
    hjx: hjxParts.join("\n\n"),
    intent: "mixed",
    confidence: 0.8,
    suggestions: ["Consider separating code and language blocks with blank lines for clarity"],
  };
}

// Direct pattern matching without recursion
function processEnglishPatterns(input: string, ctx: Partial<FlowContext>): FlowParseResult {
  const trimmed = input.trim();

  for (const pattern of FLOW_PATTERNS) {
    for (const regex of pattern.patterns) {
      const match = trimmed.match(regex);
      if (match) {
        const result = pattern.handler(match, ctx as FlowContext);
        return {
          hjx: result.hjx,
          intent: pattern.id,
          confidence: result.confidence,
          suggestions: generateSuggestions(pattern.id, trimmed),
        };
      }
    }
  }

  // Fallback
  return generateFromDescription(trimmed, ctx as FlowContext);
}

// ============================================================
// Section 5: Fallback Description Parser
// ============================================================

function generateFromDescription(description: string, ctx: FlowContext): FlowParseResult {
  const lower = description.toLowerCase();

  // Detect key elements
  const componentName = extractComponentName(description);
  const hasButton = /button/i.test(lower);
  const hasInput = /input|field|form/i.test(lower);
  const hasList = /list|items|todos/i.test(lower);
  const hasImage = /image|photo|picture/i.test(lower);
  const hasTitle = /title|heading|header/i.test(lower);
  const hasCard = /card|box|panel/i.test(lower);
  const hasCenter = /center|middle/i.test(lower);
  const hasGrid = /grid|columns|row/i.test(lower);
  const hasColor = /color|background|theme|dark|light/i.test(lower);

  let hjx = `component ${componentName}\n\nstate:\n  count = 0\n`;

  // Build layout based on detected elements
  hjx += "\nlayout:\n  view.container:\n";

  if (hasTitle) {
    hjx += `    text.title: "${componentName}"\n`;
  }

  if (hasInput) {
    hjx += `    input.field (bind value <-> count):\n`;
  }

  if (hasButton) {
    hjx += `    button.primary (on click -> handleClick): "Click Me"\n`;
  }

  if (hasList) {
    hjx += `    for (item in items):\n      view.item:\n        text: "{{item}}"\n`;
    hjx = hjx.replace("count = 0", 'items = ["Item 1", "Item 2"]');
  }

  // Build style based on detected preferences
  hjx += "\nstyle:\n";
  hjx += "  .container:\n    container\n";

  if (hasCenter) {
    hjx += "    display flex\n    justify content center\n    align items center\n";
  }

  if (hasCard) {
    hjx += "  .card:\n    card\n";
  }

  if (hasColor && /dark/i.test(lower)) {
    hjx += "  .container:\n    background #1a1a1a\n    color white\n";
  }

  // Build handlers
  if (hasButton) {
    hjx += "\nhandlers:\n  handleClick:\n    log \"Button clicked\"\n";
  }

  return {
    hjx,
    intent: "description-to-code",
    confidence: 0.6,
    suggestions: [
      "Try being more specific: 'create a counter component' or 'add a button called Submit'",
      "Use flow patterns: 'make a form with name and email fields'",
      "Mix code and English: 'component MyApp\\n  add a title and a button'",
    ],
  };
}

// ============================================================
// Section 6: Utility Functions
// ============================================================

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function extractComponentName(description: string): string {
  // Try to extract component name from description
  const patterns = [
    /(?:called|named|component)\s+(\w+)/i,
    /(\w+)\s+(?:component|app|page|screen)/i,
  ];

  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match) return capitalize(match[1]);
  }

  // Generate from first significant word
  const words = description.split(/\s+/);
  for (const word of words) {
    if (word.length > 2 && !/^(the|a|an|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|could|should|may|might|must|shall|can|to|of|in|for|on|with|at|by|from|as|into|through|during|before|after|above|below|between|out|off|over|under|again|further|then|once|here|there|when|where|why|how|all|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|just|because|but|and|or|yet|about)$/i.test(word)) {
      return capitalize(word);
    }
  }

  return "MyComponent";
}

function generateSuggestions(intentId: string, input: string): string[] {
  const suggestions: Record<string, string[]> = {
    "create-component": [
      "Add state variables: 'add state called count'",
      "Add layout: 'add a button called Submit'",
      "Style it: 'make the card centered with a shadow'",
    ],
    "counter": [
      "Add reset: 'add a reset button to the counter'",
      "Style it differently: 'make it dark theme'",
      "Add API: 'fetch count from /api/counter'",
    ],
    "form": [
      "Add validation: 'add email validation'",
      "Add submit handler: 'when submitted, save to /api/form'",
      "Style it: 'make the form centered'",
    ],
    "todo-list": [
      "Add completion: 'add a done button for each todo'",
      "Add API: 'fetch todos from /api/todos'",
      "Add filtering: 'add filter buttons for active/done'",
    ],
  };

  return suggestions[intentId] || [
    "Try: 'create a counter component'",
    "Try: 'make a form with name and email'",
    "Try: 'add a button called Submit'",
  ];
}

// ============================================================
// Section 7: Flow State Compiler
// Compiles flow-state input to final HJX + HTML/CSS/JS
// ============================================================

export interface FlowCompileResult {
  hjx: string;
  html: string;
  css: string;
  js: string;
  intent: string;
  confidence: number;
}

export function compileFlow(
  input: string,
  context: Partial<FlowContext> = {}
): FlowCompileResult {
  // Parse flow state
  const parseResult = parseFlowState(input, context);

  // Compile HJX to HTML/CSS/JS (using existing compiler)
  try {
    const ast = parseHJX(parseResult.hjx);
    // Note: In production, use the actual compiler
    // For now, return the HJX output
    return {
      hjx: parseResult.hjx,
      html: "<!-- Compiled by HJX Flow Engine -->",
      css: "/* Styles */",
      js: "// JavaScript",
      intent: parseResult.intent,
      confidence: parseResult.confidence,
    };
  } catch (e) {
    // Return parse result with empty bundle
    return {
      hjx: parseResult.hjx,
      html: "",
      css: "",
      js: "",
      intent: parseResult.intent,
      confidence: parseResult.confidence,
    };
  }
}
