import { HJXAst, HJXNode, HJXHandler } from "../../types.js";
import { parseHJX } from "../../parser.js";
import { tokenizeHJX, TokenType } from "../tokenizer/tokenizer.js";

export interface StructuralFeatures {
  linesOfCode: number;
  tokenCount: number;
  maxNestingDepth: number;
  avgNestingDepth: number;
  blockCount: {
    state: number;
    layout: number;
    style: number;
    handlers: number;
    imports: number;
    script: number;
    computed: number;
  };
  layoutTreeSize: number;
  layoutTreeDepth: number;
  handlerCount: number;
  importCount: number;
  complexity: number;
}

export interface LexicalFeatures {
  elementCounts: Record<string, number>;
  cssClassCount: number;
  cssIdCount: number;
  eventHandlerCount: number;
  stateVariableCount: number;
  controlFlowCount: { ifCount: number; forCount: number; elseCount: number };
  variableUsagePatterns: Record<string, number>;
  uniqueTokens: number;
  operatorCounts: Record<string, number>;
}

export interface SemanticFeatures {
  stateVariableNames: string[];
  handlerNames: string[];
  handlerComplexities: Record<string, number>;
  variableRefs: Record<string, string[]>;
  componentDependencies: string[];
  dataFlowEdges: { from: string; to: string; type: string }[];
}

export interface FeatureVector {
  structural: StructuralFeatures;
  lexical: LexicalFeatures;
  semantic: SemanticFeatures;
  summary: Record<string, number>;
  vector: number[];
}

export function extractFeatures(source: string, filename?: string): FeatureVector {
  const ast = parseHJX(source, filename);
  return extractFeaturesFromAST(ast, source);
}

export function extractFeaturesFromAST(ast: HJXAst, source: string): FeatureVector {
  const { tokens } = tokenizeHJX(source);
  const lines = source.split("\n");

  const structural = extractStructural(ast, source, tokens);
  const lexical = extractLexical(ast, source, tokens);
  const semantic = extractSemantic(ast);

  const summary: Record<string, number> = {
    linesOfCode: structural.linesOfCode,
    tokenCount: structural.tokenCount,
    maxNestingDepth: structural.maxNestingDepth,
    handlerCount: structural.handlerCount,
    importCount: structural.importCount,
    stateVariableCount: lexical.stateVariableCount,
    cssClassCount: lexical.cssClassCount,
    eventHandlerCount: lexical.eventHandlerCount,
    complexity: structural.complexity,
    layoutTreeSize: structural.layoutTreeSize,
    ifCount: lexical.controlFlowCount.ifCount,
    forCount: lexical.controlFlowCount.forCount,
  };

  const vector = summaryToVector(summary);

  return { structural, lexical, semantic, summary, vector };
}

function extractStructural(ast: HJXAst, source: string, tokens: any[]): StructuralFeatures {
  const lines = source.split("\n");
  const nonEmptyLines = lines.filter(l => l.trim().length > 0).length;

  const nestingDepths = collectNestingDepths(ast.layout);
  const maxNesting = nestingDepths.length > 0 ? Math.max(...nestingDepths) : 0;
  const avgNesting = nestingDepths.length > 0 ? nestingDepths.reduce((a, b) => a + b, 0) / nestingDepths.length : 0;

  let layoutTreeSize = 0;
  let layoutTreeDepth = 0;
  if (ast.layout) {
    const sizes = countTree(ast.layout);
    layoutTreeSize = sizes.nodes;
    layoutTreeDepth = sizes.depth;
  }

  let totalComplexity = 0;
  for (const handler of Object.values(ast.handlers)) {
    totalComplexity += calculateHandlerComplexity(handler);
  }

  return {
    linesOfCode: nonEmptyLines,
    tokenCount: tokens.length,
    maxNestingDepth: maxNesting,
    avgNestingDepth: Math.round(avgNesting * 100) / 100,
    blockCount: {
      state: Object.keys(ast.state).length > 0 ? 1 : 0,
      layout: ast.layout ? 1 : 0,
      style: ast.style.trim() ? 1 : 0,
      handlers: Object.keys(ast.handlers).length > 0 ? 1 : 0,
      imports: Object.keys(ast.imports).length > 0 ? 1 : 0,
      script: ast.script.trim() ? 1 : 0,
      computed: Object.keys(ast.computed).length > 0 ? 1 : 0,
    },
    layoutTreeSize,
    layoutTreeDepth,
    handlerCount: Object.keys(ast.handlers).length,
    importCount: Object.keys(ast.imports).length,
    complexity: totalComplexity,
  };
}

function extractLexical(ast: HJXAst, source: string, tokens: any[]): LexicalFeatures {
  const elementCounts: Record<string, number> = {};
  let cssClassCount = 0;
  let cssIdCount = 0;
  let eventHandlerCount = 0;
  let ifCount = 0;
  let forCount = 0;
  let elseCount = 0;
  const variableUsagePatterns: Record<string, number> = {};
  const operatorCounts: Record<string, number> = {};

  if (ast.layout) {
    walkNode(ast.layout, (node) => {
      elementCounts[node.tag] = (elementCounts[node.tag] || 0) + 1;
      cssClassCount += node.classes.length;
      if (node.id) cssIdCount++;
      eventHandlerCount += Object.keys(node.events).length;
      if (node.kind === "if") ifCount++;
      if (node.kind === "for") forCount++;
      if (node.kind === "else") elseCount++;
      if (node.bind) {
        const varName = node.bind.state;
        variableUsagePatterns[varName] = (variableUsagePatterns[varName] || 0) + 1;
      }
    });
  }

  // Count template variable usage
  const templateVars = source.match(/\{\{[a-zA-Z_][a-zA-Z0-9_.]*\}\}/g) || [];
  for (const tv of templateVars) {
    const varName = tv.slice(2, -2).trim().split(".")[0];
    variableUsagePatterns[varName] = (variableUsagePatterns[varName] || 0) + 1;
  }

  // Count operators in handler bodies
  for (const handler of Object.values(ast.handlers)) {
    for (const stmt of handler.body) {
      const ops = stmt.match(/[+\-*/=<>!&|]+/g) || [];
      for (const op of ops) {
        operatorCounts[op] = (operatorCounts[op] || 0) + 1;
      }
    }
  }

  const uniqueTokens = new Set(tokens.map((t: any) => t.value)).size;

  return {
    elementCounts,
    cssClassCount,
    cssIdCount,
    eventHandlerCount,
    stateVariableCount: Object.keys(ast.state).length,
    controlFlowCount: { ifCount, forCount, elseCount },
    variableUsagePatterns,
    uniqueTokens,
    operatorCounts,
  };
}

function extractSemantic(ast: HJXAst): SemanticFeatures {
  const stateVariableNames = Object.keys(ast.state);
  const handlerNames = Object.keys(ast.handlers);
  const handlerComplexities: Record<string, number> = {};
  const variableRefs: Record<string, string[]> = {};
  const dataFlowEdges: { from: string; to: string; type: string }[] = [];

  for (const [name, handler] of Object.entries(ast.handlers)) {
    handlerComplexities[name] = calculateHandlerComplexity(handler);

    const refs: string[] = [];
    for (const stmt of handler.body) {
      const setMatch = stmt.match(/^set\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
      if (setMatch) {
        dataFlowEdges.push({ from: name, to: setMatch[1], type: "writes" });
      }
      const vars = stmt.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
      for (const v of vars) {
        if (stateVariableNames.includes(v) && !refs.includes(v)) {
          refs.push(v);
          dataFlowEdges.push({ from: name, to: v, type: "reads" });
        }
      }
    }
    variableRefs[name] = refs;
  }

  // Build event -> handler edges from layout
  if (ast.layout) {
    walkNode(ast.layout, (node) => {
      for (const [event, handler] of Object.entries(node.events)) {
        dataFlowEdges.push({ from: `event:${event}`, to: handler, type: "triggers" });
      }
    });
  }

  const componentDependencies = Object.keys(ast.imports);

  return {
    stateVariableNames,
    handlerNames,
    handlerComplexities,
    variableRefs,
    componentDependencies,
    dataFlowEdges,
  };
}

function collectNestingDepths(node: HJXNode | null, depth = 0, depths: number[] = []): number[] {
  if (!node) return depths;
  depths.push(depth);
  for (const child of node.children) {
    collectNestingDepths(child, depth + 1, depths);
  }
  return depths;
}

function countTree(node: HJXNode): { nodes: number; depth: number } {
  let nodes = 1;
  let depth = 1;
  for (const child of node.children) {
    const childResult = countTree(child);
    nodes += childResult.nodes;
    depth = Math.max(depth, childResult.depth + 1);
  }
  return { nodes, depth };
}

function walkNode(node: HJXNode, fn: (node: HJXNode) => void): void {
  fn(node);
  for (const child of node.children) {
    walkNode(child, fn);
  }
}

function calculateHandlerComplexity(handler: HJXHandler): number {
  let complexity = 1;
  for (const stmt of handler.body) {
    if (stmt.includes("?")) complexity++;
    if (stmt.includes("&&")) complexity++;
    if (stmt.includes("||")) complexity++;
    if (stmt.includes(".filter")) complexity++;
    if (stmt.includes(".map")) complexity++;
    if (stmt.includes(".reduce")) complexity++;
  }
  return complexity;
}

function summaryToVector(summary: Record<string, number>): number[] {
  const keys = [
    "linesOfCode", "tokenCount", "maxNestingDepth", "handlerCount",
    "importCount", "stateVariableCount", "cssClassCount", "eventHandlerCount",
    "complexity", "layoutTreeSize", "ifCount", "forCount",
  ];
  return keys.map(k => summary[k] || 0);
}
