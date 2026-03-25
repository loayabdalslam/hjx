import { parseHJX } from "../../parser.js";
import { HJXAst, HJXNode } from "../../types.js";
import { classifyIntent, Intent } from "../intent/classifier.js";
import { extractEntities, EntityType } from "../entities/extractor.js";

export interface CompletionContext {
  source: string;
  cursorLine: number;
  cursorColumn: number;
  ast?: HJXAst;
  currentBlock?: string;
  previousToken?: string;
}

export interface CompletionItem {
  label: string;
  detail: string;
  insertText: string;
  kind: CompletionKind;
  score: number;
  documentation?: string;
}

export enum CompletionKind {
  Keyword = "Keyword",
  Snippet = "Snippet",
  Variable = "Variable",
  Handler = "Handler",
  Property = "Property",
  Value = "Value",
  Element = "Element",
  Class = "Class",
  Event = "Event",
  Import = "Import",
}

export class IncrementalGenerator {
  private ast: HJXAst | null = null;

  getCompletions(context: CompletionContext): CompletionItem[] {
    const items: CompletionItem[] = [];

    try {
      this.ast = parseHJX(context.source);
    } catch {
      this.ast = null;
    }

    const block = this.detectCurrentBlock(context);
    const line = context.source.split("\n")[context.cursorLine - 1] ?? "";
    const beforeCursor = line.substring(0, context.cursorColumn - 1).trim();

    switch (block) {
      case "component":
        items.push(...this.getComponentCompletions(beforeCursor));
        break;
      case "state":
        items.push(...this.getStateCompletions(beforeCursor));
        break;
      case "layout":
        items.push(...this.getLayoutCompletions(beforeCursor, context));
        break;
      case "style":
        items.push(...this.getStyleCompletions(beforeCursor));
        break;
      case "handlers":
        items.push(...this.getHandlerCompletions(beforeCursor, context));
        break;
      case "imports":
        items.push(...this.getImportCompletions(beforeCursor));
        break;
      case "computed":
        items.push(...this.getComputedCompletions(beforeCursor));
        break;
      default:
        items.push(...this.getTopLevelCompletions(beforeCursor));
    }

    // Sort by score
    items.sort((a, b) => b.score - a.score);

    return items.slice(0, 20);
  }

  private detectCurrentBlock(context: CompletionContext): string {
    const lines = context.source.split("\n");
    let currentBlock = "top";

    for (let i = 0; i < context.cursorLine; i++) {
      const line = lines[i].trim();
      if (line === "state:") currentBlock = "state";
      else if (line === "layout:") currentBlock = "layout";
      else if (line === "style:") currentBlock = "style";
      else if (line === "handlers:") currentBlock = "handlers";
      else if (line === "imports:") currentBlock = "imports";
      else if (line === "computed:") currentBlock = "computed";
      else if (line === "script:") currentBlock = "script";
      else if (line.startsWith("component ")) currentBlock = "top";
    }

    return currentBlock;
  }

  private getTopLevelCompletions(beforeCursor: string): CompletionItem[] {
    return [
      { label: "component", detail: "Component declaration", insertText: "component ${1:Name}", kind: CompletionKind.Keyword, score: 1.0, documentation: "Declares a new HJX component" },
      { label: "state", detail: "State block", insertText: "state:\n  ${1:var} = ${2:value}", kind: CompletionKind.Snippet, score: 0.9 },
      { label: "layout", detail: "Layout block", insertText: "layout:\n  ${1}", kind: CompletionKind.Snippet, score: 0.9 },
      { label: "style", detail: "Style block", insertText: "style:\n  .${1:class} { ${2} }", kind: CompletionKind.Snippet, score: 0.9 },
      { label: "handlers", detail: "Handlers block", insertText: "handlers:\n  ${1:name}:\n    ${2}", kind: CompletionKind.Snippet, score: 0.9 },
      { label: "imports", detail: "Imports block", insertText: "imports:\n  ${1:Name} from \"${2:path}\"", kind: CompletionKind.Snippet, score: 0.8 },
      { label: "computed", detail: "Computed block", insertText: "computed:\n  ${1:name} = ${2:expr}", kind: CompletionKind.Snippet, score: 0.7 },
      { label: "script", detail: "Script block", insertText: "script:\n  ${1}", kind: CompletionKind.Snippet, score: 0.7 },
    ];
  }

  private getStateCompletions(beforeCursor: string): CompletionItem[] {
    const items: CompletionItem[] = [
      { label: "string variable", detail: "String state", insertText: "${1:name} = \"${2:}\"", kind: CompletionKind.Snippet, score: 0.9 },
      { label: "number variable", detail: "Number state", insertText: "${1:name} = 0", kind: CompletionKind.Snippet, score: 0.9 },
      { label: "boolean variable", detail: "Boolean state", insertText: "${1:name} = false", kind: CompletionKind.Snippet, score: 0.9 },
      { label: "array variable", detail: "Array state", insertText: "${1:name} = []", kind: CompletionKind.Snippet, score: 0.9 },
      { label: "count", detail: "Counter variable", insertText: "count = 0", kind: CompletionKind.Variable, score: 0.7 },
      { label: "isLoading", detail: "Loading flag", insertText: "isLoading = false", kind: CompletionKind.Variable, score: 0.7 },
      { label: "items", detail: "Items array", insertText: "items = []", kind: CompletionKind.Variable, score: 0.7 },
      { label: "showMenu", detail: "Menu visibility", insertText: "showMenu = false", kind: CompletionKind.Variable, score: 0.6 },
    ];

    if (this.ast) {
      for (const [name, value] of Object.entries(this.ast.state)) {
        items.push({ label: name, detail: `State: ${JSON.stringify(value)}`, insertText: name, kind: CompletionKind.Variable, score: 0.5 });
      }
    }

    return items;
  }

  private getLayoutCompletions(beforeCursor: string, context: CompletionContext): CompletionItem[] {
    const items: CompletionItem[] = [
      { label: "view", detail: "Container element", insertText: "view.${1:class}:\n  ${2}", kind: CompletionKind.Element, score: 1.0 },
      { label: "text", detail: "Text element", insertText: "text: \"${1}\"", kind: CompletionKind.Element, score: 1.0 },
      { label: "button", detail: "Button element", insertText: "button (on click -> ${1:handler}): \"${2}\"", kind: CompletionKind.Element, score: 1.0 },
      { label: "input", detail: "Input element", insertText: "input (bind value <-> ${1:var}):", kind: CompletionKind.Element, score: 1.0 },
      { label: "if", detail: "Conditional block", insertText: "if (${1:condition}):\n  ${2}", kind: CompletionKind.Snippet, score: 0.95 },
      { label: "else", detail: "Else block", insertText: "else:\n  ${1}", kind: CompletionKind.Snippet, score: 0.9 },
      { label: "for", detail: "Loop block", insertText: "for (${1:item} in ${2:list}):\n  ${3}", kind: CompletionKind.Snippet, score: 0.95 },
      { label: "view.container", detail: "Container with class", insertText: "view.container:\n  ${1}", kind: CompletionKind.Snippet, score: 0.8 },
      { label: "text.title", detail: "Title text", insertText: "text.title: \"${1}\"", kind: CompletionKind.Snippet, score: 0.8 },
      { label: "button.primary", detail: "Primary button", insertText: "button.primary (on click -> ${1:handler}): \"${2}\"", kind: CompletionKind.Snippet, score: 0.8 },
    ];

    // Add state variable completions for template literals
    if (this.ast) {
      for (const name of Object.keys(this.ast.state)) {
        items.push({
          label: `{{${name}}}`,
          detail: `Template: ${name}`,
          insertText: `{{${name}}}`,
          kind: CompletionKind.Variable,
          score: 0.85,
          documentation: `Interpolate state variable: ${name}`,
        });
      }

      // Add handler completions
      for (const name of Object.keys(this.ast.handlers)) {
        items.push({
          label: name,
          detail: `Handler: ${name}`,
          insertText: name,
          kind: CompletionKind.Handler,
          score: 0.7,
        });
      }
    }

    return items;
  }

  private getHandlerCompletions(beforeCursor: string, context: CompletionContext): CompletionItem[] {
    const items: CompletionItem[] = [
      { label: "set", detail: "Set statement", insertText: "set ${1:var} = ${2:expr}", kind: CompletionKind.Snippet, score: 1.0 },
      { label: "log", detail: "Log statement", insertText: "log \"${1:message}\"", kind: CompletionKind.Snippet, score: 0.9 },
    ];

    // Add handler name completion
    items.push({
      label: "handler name",
      detail: "New handler",
      insertText: "${1:name}:\n    set ${2:var} = ${2:var} + 1",
      kind: CompletionKind.Snippet,
      score: 0.8,
    });

    // Add state variable references
    if (this.ast) {
      for (const name of Object.keys(this.ast.state)) {
        items.push({ label: name, detail: `State variable`, insertText: name, kind: CompletionKind.Variable, score: 0.7 });
      }
    }

    return items;
  }

  private getStyleCompletions(beforeCursor: string): CompletionItem[] {
    return [
      { label: ".class", detail: "CSS class rule", insertText: ".${1:class} { ${2} }", kind: CompletionKind.Snippet, score: 1.0 },
      { label: "padding", detail: "Padding property", insertText: "padding: ${1:16px};", kind: CompletionKind.Property, score: 0.9 },
      { label: "margin", detail: "Margin property", insertText: "margin: ${1:16px};", kind: CompletionKind.Property, score: 0.9 },
      { label: "background", detail: "Background property", insertText: "background: ${1:white};", kind: CompletionKind.Property, score: 0.9 },
      { label: "color", detail: "Color property", insertText: "color: ${1:#333};", kind: CompletionKind.Property, score: 0.9 },
      { label: "border-radius", detail: "Border radius", insertText: "border-radius: ${1:8px};", kind: CompletionKind.Property, score: 0.85 },
      { label: "display: flex", detail: "Flexbox", insertText: "display: flex; gap: ${1:8px};", kind: CompletionKind.Snippet, score: 0.85 },
      { label: "font-size", detail: "Font size", insertText: "font-size: ${1:16px};", kind: CompletionKind.Property, score: 0.8 },
      { label: "font-weight", detail: "Font weight", insertText: "font-weight: ${1:bold};", kind: CompletionKind.Property, score: 0.8 },
      { label: "border", detail: "Border property", insertText: "border: ${1:1px solid #ddd};", kind: CompletionKind.Property, score: 0.8 },
      { label: "cursor", detail: "Cursor style", insertText: "cursor: ${1:pointer};", kind: CompletionKind.Property, score: 0.7 },
    ];
  }

  private getImportCompletions(beforeCursor: string): CompletionItem[] {
    return [
      { label: "Button", detail: "Button component", insertText: 'Button from "./components/Button.hjx"', kind: CompletionKind.Import, score: 0.9 },
      { label: "Card", detail: "Card component", insertText: 'Card from "./components/Card.hjx"', kind: CompletionKind.Import, score: 0.9 },
      { label: "Input", detail: "Input component", insertText: 'Input from "./components/Input.hjx"', kind: CompletionKind.Import, score: 0.9 },
      { label: "Modal", detail: "Modal component", insertText: 'Modal from "./components/Modal.hjx"', kind: CompletionKind.Import, score: 0.8 },
    ];
  }

  private getComputedCompletions(beforeCursor: string): CompletionItem[] {
    const items: CompletionItem[] = [
      { label: "computed property", detail: "New computed", insertText: "${1:name} = ${2:expr}", kind: CompletionKind.Snippet, score: 0.9 },
    ];

    if (this.ast) {
      for (const name of Object.keys(this.ast.state)) {
        items.push({ label: name, detail: "State reference", insertText: name, kind: CompletionKind.Variable, score: 0.6 });
      }
    }

    return items;
  }

  private getComponentCompletions(beforeCursor: string): CompletionItem[] {
    return [
      { label: "Counter", detail: "Counter component", insertText: "Counter", kind: CompletionKind.Value, score: 0.8 },
      { label: "App", detail: "Main app component", insertText: "App", kind: CompletionKind.Value, score: 0.8 },
      { label: "Dashboard", detail: "Dashboard component", insertText: "Dashboard", kind: CompletionKind.Value, score: 0.7 },
      { label: "TodoList", detail: "Todo list component", insertText: "TodoList", kind: CompletionKind.Value, score: 0.7 },
      { label: "UserProfile", detail: "User profile component", insertText: "UserProfile", kind: CompletionKind.Value, score: 0.7 },
    ];
  }
}

export function getCompletions(context: CompletionContext): CompletionItem[] {
  return new IncrementalGenerator().getCompletions(context);
}
