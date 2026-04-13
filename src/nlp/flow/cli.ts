/**
 * HJX Flow CLI
 * Usage:
 *   hjx flow "create a counter component"
 *   hjx flow --file input.txt
 *   hjx flow --grammar custom-grammar.yml "make a todo app"
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { parseFlowState, compileFlow } from "./flow_engine.js";
import { loadGrammar, applyGrammar, processTemplate } from "./grammar_loader.js";

interface FlowArgs {
  file?: string;
  grammar?: string;
  out?: string;
  compile: boolean;
  watch: boolean;
}

function parseArgs(argv: string[]): FlowArgs {
  const args: FlowArgs = { compile: false, watch: false };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--file" || a === "-f") {
      args.file = argv[++i];
    } else if (a === "--grammar" || a === "-g") {
      args.grammar = argv[++i];
    } else if (a === "--out" || a === "-o") {
      args.out = argv[++i];
    } else if (a === "--compile" || a === "-c") {
      args.compile = true;
    } else if (a === "--watch" || a === "-w") {
      args.watch = true;
    }
  }

  return args;
}

function help() {
  console.log(`HJX Flow-State Engine v0.2

Usage:
  hjx flow "natural language description"
  hjx flow --file <input.txt>
  hjx flow --grammar <grammar.yml> "description"

Options:
  --file, -f <path>       Read input from file
  --grammar, -g <path>    Load custom grammar file
  --out, -o <path>        Write output to file
  --compile, -c           Compile to HTML/CSS/JS
  --watch, -w             Watch for changes (file mode)

Examples:
  hjx flow "create a counter component"
  hjx flow "make a todo app with add and delete"
  hjx flow --grammar my-rules.yml "build a dashboard"
  hjx flow --file prompt.txt --out result.hjx
  hjx flow --compile "create a form with name and email"

Flow-State Syntax:
  You can mix natural language with HJX code:

  "create a counter component
   make it look like a card
   add a reset button"

  Or pure HJX:

  "component Counter
   state:
     count = 0
   ..."
`);
}

export async function runFlow(argv: string[]): Promise<void> {
  const args = parseArgs(argv);

  if (argv.length === 0 || argv[0] === "help" || argv[0] === "--help") {
    return help();
  }

  // Get input
  let input: string;
  if (args.file) {
    const filePath = resolve(args.file);
    if (!existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }
    input = readFileSync(filePath, "utf-8");
  } else {
    input = argv.join(" ");
  }

  if (!input.trim()) {
    console.error("No input provided. Use: hjx flow \"description\"");
    process.exit(1);
  }

  // Load grammar
  const grammar = loadGrammar(args.grammar);
  const appliedRules = applyGrammar(grammar);

  console.log("🚀 HJX Flow-State Engine\n");
  console.log(`Input: "${input.trim()}"`);
  console.log(`Grammar: ${args.grammar || "built-in + grammar.yml"}\n`);
  console.log("─".repeat(50) + "\n");

  if (args.compile) {
    // Compile to full output
    const result = compileFlow(input);
    console.log("✅ Intent:", result.intent);
    console.log("📊 Confidence:", (result.confidence * 100).toFixed(1) + "%\n");

    if (result.hjx) {
      console.log("📝 HJX Output:");
      console.log("─".repeat(50));
      console.log(result.hjx);
      console.log("─".repeat(50));
    }

    if (result.html) {
      console.log("\n🌐 HTML:");
      console.log(result.html.slice(0, 200) + "...");
    }
  } else {
    // Parse only
    const result = parseFlowState(input);
    console.log("✅ Intent:", result.intent);
    console.log("📊 Confidence:", (result.confidence * 100).toFixed(1) + "%\n");

    if (result.hjx) {
      console.log("📝 Generated HJX:");
      console.log("─".repeat(50));
      console.log(result.hjx);
      console.log("─".repeat(50));
    }

    if (result.suggestions.length > 0) {
      console.log("\n💡 Suggestions:");
      for (const suggestion of result.suggestions) {
        console.log(`  • ${suggestion}`);
      }
    }
  }

  // Write output if specified
  if (args.out) {
    const outPath = resolve(args.out);
    const result = parseFlowState(input);
    writeFileSync(outPath, result.hjx, "utf-8");
    console.log(`\n💾 Written to: ${outPath}`);
  }
}
