import { parseHJX } from "../../parser.js";
import { Diagnostic, DiagnosticCode, QuickFix } from "./detector.js";

export interface CorrectedCode {
  original: string;
  corrected: string;
  changes: CodeChange[];
  success: boolean;
  remainingErrors: number;
}

export interface CodeChange {
  description: string;
  line: number;
  column: number;
  original: string;
  replacement: string;
  applied: boolean;
}

export interface FixSuggestion {
  description: string;
  confidence: number;
  preview: string;
  changes: CodeChange[];
}

export class ErrorCorrector {
  correctCode(source: string): CorrectedCode {
    const lines = source.split("\n");
    const changes: CodeChange[] = [];
    let corrected = source;

    // 1. Fix missing colons after block headers
    corrected = this.fixMissingColons(corrected, changes);

    // 2. Fix indentation
    corrected = this.fixIndentation(corrected, changes);

    // 3. Fix common typos
    corrected = this.fixCommonTypos(corrected, changes);

    // 4. Fix missing component declaration
    corrected = this.fixMissingComponent(corrected, changes);

    // 5. Fix unclosed strings
    corrected = this.fixUnclosedStrings(corrected, changes);

    // 6. Normalize quotes
    corrected = this.normalizeQuotes(corrected, changes);

    // 7. Fix missing state assignments
    corrected = this.fixStateAssignments(corrected, changes);

    // 8. Remove trailing whitespace
    const trimmed = corrected.replace(/\s+$/gm, "");
    if (trimmed !== corrected) {
      changes.push({ description: "Remove trailing whitespace", line: 0, column: 0, original: corrected, replacement: trimmed, applied: true });
      corrected = trimmed;
    }

    // Ensure final newline
    if (!corrected.endsWith("\n")) {
      corrected += "\n";
      changes.push({ description: "Add final newline", line: corrected.split("\n").length, column: 1, original: "", replacement: "\n", applied: true });
    }

    // Count remaining errors
    let remainingErrors = 0;
    try {
      parseHJX(corrected);
    } catch {
      remainingErrors = 1;
    }

    return {
      original: source,
      corrected,
      changes,
      success: remainingErrors === 0,
      remainingErrors,
    };
  }

  suggestFixes(diagnostics: Diagnostic[]): FixSuggestion[] {
    const suggestions: FixSuggestion[] = [];

    for (const diag of diagnostics) {
      switch (diag.code) {
        case DiagnosticCode.MISSING_COLON:
          suggestions.push({
            description: "Add missing colon",
            confidence: 0.95,
            preview: "Add ':' at end of line",
            changes: [{ description: "Add colon", line: diag.line, column: diag.column, original: "", replacement: ":", applied: false }],
          });
          break;

        case DiagnosticCode.INDENTATION_ERROR:
          suggestions.push({
            description: "Fix indentation to 2-space increments",
            confidence: 0.9,
            preview: "Normalize indentation",
            changes: [{ description: "Fix indent", line: diag.line, column: 1, original: "", replacement: "", applied: false }],
          });
          break;

        case DiagnosticCode.UNDEFINED_VARIABLE:
          const varMatch = diag.message.match(/'(\w+)'/);
          if (varMatch) {
            suggestions.push({
              description: `Add '${varMatch[1]}' to state block`,
              confidence: 0.8,
              preview: `state:\n  ${varMatch[1]} = ""`,
              changes: [{ description: "Add state var", line: 0, column: 0, original: "", replacement: `  ${varMatch[1]} = ""\n`, applied: false }],
            });
          }
          break;

        case DiagnosticCode.UNDEFINED_HANDLER:
          const handlerMatch = diag.message.match(/'(\w+)'/);
          if (handlerMatch) {
            suggestions.push({
              description: `Add '${handlerMatch[1]}' handler`,
              confidence: 0.8,
              preview: `handlers:\n  ${handlerMatch[1]}:\n    log "triggered"`,
              changes: [{ description: "Add handler", line: 0, column: 0, original: "", replacement: `  ${handlerMatch[1]}:\n    log "triggered"\n`, applied: false }],
            });
          }
          break;

        case DiagnosticCode.MISSING_BLOCK:
          suggestions.push({
            description: "Add layout block",
            confidence: 0.9,
            preview: "layout:\n  view.container:\n    text: \"Hello\"",
            changes: [{ description: "Add layout", line: 0, column: 0, original: "", replacement: "\nlayout:\n  view.container:\n    text: \"Hello\"\n", applied: false }],
          });
          break;

        case DiagnosticCode.MISSING_COMPONENT_NAME:
          suggestions.push({
            description: "Add component declaration",
            confidence: 0.95,
            preview: "component MyComponent",
            changes: [{ description: "Add component name", line: 1, column: 1, original: "", replacement: "component MyComponent\n", applied: false }],
          });
          break;
      }
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  autoFix(source: string, maxChanges: number = 10): CorrectedCode {
    const result = this.correctCode(source);

    // Limit changes
    if (result.changes.length > maxChanges) {
      result.changes = result.changes.slice(0, maxChanges);
      result.changes.push({ description: "Stopped after max changes", line: 0, column: 0, original: "", replacement: "", applied: false });
    }

    return result;
  }

  private fixMissingColons(source: string, changes: CodeChange[]): string {
    const lines = source.split("\n");
    const blockHeaders = ["state", "layout", "style", "handlers", "imports", "computed", "script"];

    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (blockHeaders.includes(trimmed)) {
        changes.push({ description: `Add missing colon to '${trimmed}'`, line: i + 1, column: 1, original: line, replacement: `${trimmed}:`, applied: true });
        return line.replace(trimmed, `${trimmed}:`);
      }
      return line;
    }).join("\n");
  }

  private fixIndentation(source: string, changes: CodeChange[]): string {
    const lines = source.split("\n");
    let inBlock = false;
    let blockIndent = 0;

    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return "";

      const currentIndent = line.match(/^\s*/)?.[0].length ?? 0;

      if (trimmed.endsWith(":")) {
        inBlock = true;
        blockIndent = Math.floor(currentIndent / 2) * 2;
        return " ".repeat(blockIndent) + trimmed;
      }

      if (inBlock && currentIndent <= blockIndent && !trimmed.match(/^(component |state:|layout:|style:|handlers:|imports:|computed:|script:)/)) {
        inBlock = false;
      }

      if (inBlock) {
        const expectedIndent = blockIndent + 2;
        if (currentIndent !== expectedIndent && currentIndent !== 0) {
          const fixed = " ".repeat(expectedIndent) + trimmed;
          if (fixed !== line) {
            changes.push({ description: "Fix indentation", line: i + 1, column: 1, original: line, replacement: fixed, applied: true });
          }
          return fixed;
        }
      }

      return line;
    }).join("\n");
  }

  private fixCommonTypos(source: string, changes: CodeChange[]): string {
    const typos: Record<string, string> = {
      "componet ": "component ",
      "compnent ": "component ",
      "compontent ": "component ",
      "layot ": "layout ",
      "layour:": "layout:",
      "handels ": "handlers ",
      "handler ": "handlers ",
      "hendlers ": "handlers ",
      "stae ": "state ",
      "stete ": "state ",
    };

    let result = source;
    for (const [typo, fix] of Object.entries(typos)) {
      if (result.includes(typo)) {
        result = result.replace(new RegExp(typo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fix);
        changes.push({ description: `Fix typo: '${typo.trim()}' → '${fix.trim()}'`, line: 0, column: 0, original: typo, replacement: fix, applied: true });
      }
    }

    return result;
  }

  private fixMissingComponent(source: string, changes: CodeChange[]): string {
    if (!source.match(/^component\s+\w+/m)) {
      changes.push({ description: "Add missing component declaration", line: 1, column: 1, original: "", replacement: "component App\n\n", applied: true });
      return "component App\n\n" + source;
    }
    return source;
  }

  private fixUnclosedStrings(source: string, changes: CodeChange[]): string {
    const lines = source.split("\n");
    return lines.map((line, i) => {
      // Count quotes
      const doubleQuotes = (line.match(/"/g) || []).length;
      const singleQuotes = (line.match(/'/g) || []).length;

      if (doubleQuotes % 2 !== 0) {
        const fixed = line + '"';
        changes.push({ description: "Close unclosed double quote", line: i + 1, column: line.length, original: line, replacement: fixed, applied: true });
        return fixed;
      }
      if (singleQuotes % 2 !== 0) {
        const fixed = line + "'";
        changes.push({ description: "Close unclosed single quote", line: i + 1, column: line.length, original: line, replacement: fixed, applied: true });
        return fixed;
      }
      return line;
    }).join("\n");
  }

  private normalizeQuotes(source: string, changes: CodeChange[]): string {
    // Convert single quotes to double quotes for string values
    const result = source.replace(/'([^']*)'/g, '"$1"');
    if (result !== source) {
      changes.push({ description: "Normalize quotes to double quotes", line: 0, column: 0, original: source, replacement: result, applied: true });
    }
    return result;
  }

  private fixStateAssignments(source: string, changes: CodeChange[]): string {
    // Fix lines like "varName" without "= value" in state blocks
    const lines = source.split("\n");
    let inState = false;

    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (trimmed === "state:") { inState = true; return line; }
      if (trimmed.endsWith(":") && !trimmed.startsWith("state")) { inState = false; return line; }

      if (inState && trimmed.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/) && !trimmed.match(/^(state|layout|style|handlers)$/)) {
        const fixed = `${line} = ""`;
        changes.push({ description: `Add default value to '${trimmed}'`, line: i + 1, column: 1, original: line, replacement: fixed, applied: true });
        return fixed;
      }

      return line;
    }).join("\n");
  }
}

export function correctCode(source: string): CorrectedCode {
  return new ErrorCorrector().correctCode(source);
}

export function suggestFixes(diagnostics: Diagnostic[]): FixSuggestion[] {
  return new ErrorCorrector().suggestFixes(diagnostics);
}
