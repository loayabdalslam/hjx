import { HJXAst, HJXNode, HJXHandler } from "../../types.js";
import { parseHJX } from "../../parser.js";
import { tokenizeHJX, TokenType, TokenError } from "../tokenizer/tokenizer.js";

export enum DiagnosticSeverity {
  ERROR = "ERROR",
  WARNING = "WARNING",
  INFO = "INFO",
  HINT = "HINT",
}

export enum DiagnosticCode {
  SYNTAX_ERROR = "SYNTAX_ERROR",
  INDENTATION_ERROR = "INDENTATION_ERROR",
  MISSING_COLON = "MISSING_COLON",
  MISSING_BLOCK = "MISSING_BLOCK",
  UNDEFINED_VARIABLE = "UNDEFINED_VARIABLE",
  UNDEFINED_HANDLER = "UNDEFINED_HANDLER",
  UNUSED_VARIABLE = "UNUSED_VARIABLE",
  UNUSED_HANDLER = "UNUSED_HANDLER",
  MISSING_IMPORT = "MISSING_IMPORT",
  INVALID_CSS = "INVALID_CSS",
  MISSING_COMPONENT_NAME = "MISSING_COMPONENT_NAME",
  DUPLICATE_HANDLER = "DUPLICATE_HANDLER",
  DUPLICATE_STATE = "DUPLICATE_STATE",
  INVALID_STATE_VALUE = "INVALID_STATE_VALUE",
  UNCLOSED_BLOCK = "UNCLOSED_BLOCK",
  PERFORMANCE_WARNING = "PERFORMANCE_WARNING",
  STYLE_WARNING = "STYLE_WARNING",
}

export interface Diagnostic {
  code: DiagnosticCode;
  severity: DiagnosticSeverity;
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  source: string;
  quickFix?: QuickFix;
}

export interface QuickFix {
  title: string;
  replacement: string;
  range: { startLine: number; startColumn: number; endLine: number; endColumn: number };
}

export class ErrorDetector {
  detectErrors(source: string, filename = "<input>"): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    // Tokenization errors
    const { errors: tokenErrors } = tokenizeHJX(source);
    for (const err of tokenErrors) {
      diagnostics.push({
        code: DiagnosticCode.SYNTAX_ERROR,
        severity: DiagnosticSeverity.ERROR,
        message: err.message,
        line: err.line,
        column: err.column,
        source: "tokenizer",
      });
    }

    // Parse errors and AST-based checks
    let ast: HJXAst | null = null;
    try {
      ast = parseHJX(source, filename);
    } catch (e) {
      const errMsg = (e as Error).message;
      const lineMatch = errMsg.match(/:(\d+):/);
      const line = lineMatch ? parseInt(lineMatch[1]) : 1;

      // Detect specific parse errors
      if (errMsg.includes("Unknown top-level statement")) {
        diagnostics.push({
          code: DiagnosticCode.SYNTAX_ERROR,
          severity: DiagnosticSeverity.ERROR,
          message: errMsg,
          line,
          column: 1,
          source: "parser",
          quickFix: this.suggestForUnknownStatement(source, line),
        });
      } else if (errMsg.includes("Invalid state line")) {
        diagnostics.push({
          code: DiagnosticCode.SYNTAX_ERROR,
          severity: DiagnosticSeverity.ERROR,
          message: errMsg,
          line,
          column: 1,
          source: "parser",
        });
      } else if (errMsg.includes("Invalid component name")) {
        diagnostics.push({
          code: DiagnosticCode.MISSING_COMPONENT_NAME,
          severity: DiagnosticSeverity.ERROR,
          message: errMsg,
          line,
          column: 1,
          source: "parser",
        });
      } else if (errMsg.includes("Unexpected indentation")) {
        diagnostics.push({
          code: DiagnosticCode.INDENTATION_ERROR,
          severity: DiagnosticSeverity.ERROR,
          message: errMsg,
          line,
          column: 1,
          source: "parser",
        });
      } else {
        diagnostics.push({
          code: DiagnosticCode.SYNTAX_ERROR,
          severity: DiagnosticSeverity.ERROR,
          message: errMsg,
          line,
          column: 1,
          source: "parser",
        });
      }
    }

    if (!ast) return diagnostics;

    // AST-based diagnostics
    diagnostics.push(...this.checkMissingBlocks(ast, source));
    diagnostics.push(...this.checkUnusedVariables(ast, source));
    diagnostics.push(...this.checkUndefinedReferences(ast, source));
    diagnostics.push(...this.checkHandlerReferences(ast));
    diagnostics.push(...this.checkStyleWarnings(ast, source));
    diagnostics.push(...this.checkPerformanceWarnings(ast, source));
    diagnostics.push(...this.checkDuplicateDefinitions(ast));

    return diagnostics;
  }

  getQuickFix(diagnostic: Diagnostic): QuickFix | null {
    return diagnostic.quickFix ?? null;
  }

  explainError(diagnostic: Diagnostic): string {
    const explanations: Record<DiagnosticCode, string> = {
      [DiagnosticCode.SYNTAX_ERROR]: "The code doesn't follow HJX syntax rules. Check for typos, missing characters, or invalid constructs.",
      [DiagnosticCode.INDENTATION_ERROR]: "HJX uses indentation to define blocks. Make sure child elements are indented exactly 2 spaces more than their parent.",
      [DiagnosticCode.MISSING_COLON]: "Block headers (state, layout, style, handlers) must end with a colon (:).",
      [DiagnosticCode.MISSING_BLOCK]: "A component should have at least a layout block. Consider adding 'layout:' with UI elements.",
      [DiagnosticCode.UNDEFINED_VARIABLE]: "This variable is referenced but not defined in the state block. Add it to 'state:' or check the spelling.",
      [DiagnosticCode.UNDEFINED_HANDLER]: "This handler is referenced in an event binding but not defined in the handlers block.",
      [DiagnosticCode.UNUSED_VARIABLE]: "This state variable is defined but never used in the layout or handlers.",
      [DiagnosticCode.UNUSED_HANDLER]: "This handler is defined but never referenced in the layout.",
      [DiagnosticCode.MISSING_IMPORT]: "This component is used but not imported. Add it to the imports block.",
      [DiagnosticCode.INVALID_CSS]: "The CSS rule may contain syntax errors.",
      [DiagnosticCode.MISSING_COMPONENT_NAME]: "A component must be declared with 'component <Name>' at the top of the file.",
      [DiagnosticCode.DUPLICATE_HANDLER]: "This handler is defined more than once. Only the last definition will be used.",
      [DiagnosticCode.DUPLICATE_STATE]: "This state variable is defined more than once.",
      [DiagnosticCode.INVALID_STATE_VALUE]: "The state value is not a valid type (string, number, boolean, array, object).",
      [DiagnosticCode.UNCLOSED_BLOCK]: "A block was opened but not properly closed. Check indentation levels.",
      [DiagnosticCode.PERFORMANCE_WARNING]: "This pattern may cause performance issues at runtime.",
      [DiagnosticCode.STYLE_WARNING]: "The styling could be improved for better maintainability or best practices.",
    };

    return explanations[diagnostic.code] ?? "Unknown error.";
  }

  private checkMissingBlocks(ast: HJXAst, source: string): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    if (!ast.layout) {
      diagnostics.push({
        code: DiagnosticCode.MISSING_BLOCK,
        severity: DiagnosticSeverity.WARNING,
        message: "Component is missing a layout block",
        line: 1,
        column: 1,
        source: "analyzer",
        quickFix: {
          title: "Add layout block",
          replacement: "\nlayout:\n  view.container:\n    text: \"Hello World\"\n",
          range: { startLine: source.split("\n").length, startColumn: 1, endLine: source.split("\n").length, endColumn: 1 },
        },
      });
    }

    return diagnostics;
  }

  private checkUnusedVariables(ast: HJXAst, source: string): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    const stateVars = Object.keys(ast.state);

    for (const varName of stateVars) {
      const isUsedInLayout = ast.layout ? this.isVarUsedInNode(ast.layout, varName) : false;
      const isUsedInHandlers = Object.values(ast.handlers).some(h =>
        h.body.some(stmt => stmt.includes(varName))
      );
      const isUsedInTemplate = source.includes(`{{${varName}}}`);
      const isUsedInComputed = Object.values(ast.computed).some(expr => expr.includes(varName));

      if (!isUsedInLayout && !isUsedInHandlers && !isUsedInTemplate && !isUsedInComputed) {
        diagnostics.push({
          code: DiagnosticCode.UNUSED_VARIABLE,
          severity: DiagnosticSeverity.WARNING,
          message: `State variable '${varName}' is defined but never used`,
          line: 1,
          column: 1,
          source: "analyzer",
        });
      }
    }

    return diagnostics;
  }

  private checkUndefinedReferences(ast: HJXAst, source: string): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    const stateVars = new Set(Object.keys(ast.state));
    const computedVars = new Set(Object.keys(ast.computed));
    const allKnownVars = new Set([...stateVars, ...computedVars]);

    if (ast.layout) {
      this.checkNodeRefs(ast.layout, allKnownVars, diagnostics, source);
    }

    return diagnostics;
  }

  private checkNodeRefs(node: HJXNode, knownVars: Set<string>, diagnostics: Diagnostic[], source: string): void {
    // Check template variables in text
    if (node.text) {
      const templateVars = node.text.match(/\{\{([a-zA-Z_][a-zA-Z0-9_.]*)\}\}/g) || [];
      for (const tv of templateVars) {
        const varName = tv.slice(2, -2).trim().split(".")[0];
        if (!knownVars.has(varName) && varName !== "item") {
          diagnostics.push({
            code: DiagnosticCode.UNDEFINED_VARIABLE,
            severity: DiagnosticSeverity.ERROR,
            message: `Variable '${varName}' used in template but not defined in state`,
            line: 1,
            column: 1,
            source: "analyzer",
          });
        }
      }
    }

    // Check bind references
    if (node.bind && !knownVars.has(node.bind.state)) {
      diagnostics.push({
        code: DiagnosticCode.UNDEFINED_VARIABLE,
        severity: DiagnosticSeverity.ERROR,
        message: `Variable '${node.bind.state}' used in bind but not defined in state`,
        line: 1,
        column: 1,
        source: "analyzer",
      });
    }

    // Check condition references
    if (node.condition) {
      const condVars = node.condition.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
      for (const v of condVars) {
        if (!knownVars.has(v) && v !== "true" && v !== "false") {
          diagnostics.push({
            code: DiagnosticCode.UNDEFINED_VARIABLE,
            severity: DiagnosticSeverity.ERROR,
            message: `Variable '${v}' used in condition but not defined in state`,
            line: 1,
            column: 1,
            source: "analyzer",
          });
        }
      }
    }

    for (const child of node.children) {
      this.checkNodeRefs(child, knownVars, diagnostics, source);
    }
  }

  private checkHandlerReferences(ast: HJXAst): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    const definedHandlers = new Set(Object.keys(ast.handlers));
    const referencedHandlers = new Set<string>();

    if (ast.layout) {
      this.collectHandlerRefs(ast.layout, referencedHandlers);
    }

    for (const handler of referencedHandlers) {
      if (!definedHandlers.has(handler)) {
        diagnostics.push({
          code: DiagnosticCode.UNDEFINED_HANDLER,
          severity: DiagnosticSeverity.ERROR,
          message: `Handler '${handler}' is referenced in layout but not defined`,
          line: 1,
          column: 1,
          source: "analyzer",
        });
      }
    }

    for (const handler of definedHandlers) {
      if (!referencedHandlers.has(handler)) {
        diagnostics.push({
          code: DiagnosticCode.UNUSED_HANDLER,
          severity: DiagnosticSeverity.INFO,
          message: `Handler '${handler}' is defined but not referenced in layout`,
          line: 1,
          column: 1,
          source: "analyzer",
        });
      }
    }

    return diagnostics;
  }

  private collectHandlerRefs(node: HJXNode, refs: Set<string>): void {
    for (const handler of Object.values(node.events)) {
      refs.add(handler);
    }
    for (const child of node.children) {
      this.collectHandlerRefs(child, refs);
    }
  }

  private checkStyleWarnings(ast: HJXAst, source: string): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    // Check for !important usage
    if (ast.styleRaw.includes("!important")) {
      diagnostics.push({
        code: DiagnosticCode.STYLE_WARNING,
        severity: DiagnosticSeverity.WARNING,
        message: "Avoid using !important; prefer specificity instead",
        line: 1,
        column: 1,
        source: "style-analyzer",
      });
    }

    // Check for empty style block
    if (ast.styleRaw.trim() === "" && ast.layout) {
      diagnostics.push({
        code: DiagnosticCode.STYLE_WARNING,
        severity: DiagnosticSeverity.INFO,
        message: "Layout has elements but no styles defined",
        line: 1,
        column: 1,
        source: "style-analyzer",
      });
    }

    return diagnostics;
  }

  private checkPerformanceWarnings(ast: HJXAst, source: string): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    // Check for large loops without keys
    if (ast.layout) {
      this.checkNodePerformance(ast.layout, diagnostics);
    }

    return diagnostics;
  }

  private checkNodePerformance(node: HJXNode, diagnostics: Diagnostic[]): void {
    if (node.kind === "for") {
      // Loop without unique key warning
      const hasKey = node.children.some(c => c.attrs["key"]);
      if (!hasKey) {
        diagnostics.push({
          code: DiagnosticCode.PERFORMANCE_WARNING,
          severity: DiagnosticSeverity.INFO,
          message: "Loop items should have a unique key attribute for efficient updates",
          line: 1,
          column: 1,
          source: "perf-analyzer",
        });
      }
    }

    for (const child of node.children) {
      this.checkNodePerformance(child, diagnostics);
    }
  }

  private checkDuplicateDefinitions(ast: HJXAst): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];

    // Handlers can't really be duplicated in the current parser (last wins),
    // but we check for pattern

    return diagnostics;
  }

  private isVarUsedInNode(node: HJXNode, varName: string): boolean {
    if (node.bind?.state === varName) return true;
    if (node.condition?.includes(varName)) return true;
    if (node.text?.includes(`{{${varName}}}`)) return true;

    for (const child of node.children) {
      if (this.isVarUsedInNode(child, varName)) return true;
    }

    return false;
  }

  private suggestForUnknownStatement(source: string, line: number): QuickFix | undefined {
    const lines = source.split("\n");
    const lineContent = lines[line - 1]?.trim() ?? "";

    if (lineContent.match(/^(state|layout|style|handlers|imports|computed|script)$/)) {
      return {
        title: "Add missing colon",
        replacement: `${lineContent}:`,
        range: { startLine: line, startColumn: 1, endLine: line, endColumn: lineContent.length + 1 },
      };
    }

    return undefined;
  }
}

export function detectErrors(source: string, filename?: string): Diagnostic[] {
  return new ErrorDetector().detectErrors(source, filename);
}
