import { HJXAst, HJXNode, HJXHandler, HJXStateValue } from "../types.js";
import { parseHJX } from "../parser.js";
import { NeuralCodeGenerator } from "./generation/neural-generator.js";

/**
 * Advanced NLP Engine for Plain English HJX
 * Understands natural language patterns and converts them to HJX AST
 * Fulfills "Option B" with hybrid AI/Rule approach
 */

export class AdvancedNLPEngine {
  private text: string;

  constructor(text: string) {
    this.text = text;
  }

  private async parseWithAI(): Promise<HJXAst> {
    const generator = new NeuralCodeGenerator({ useAI: true });
    const result = await generator.generate(this.text);
    return parseHJX(result.code);
  }

  async parse(forceAI = false): Promise<HJXAst> {
    if (forceAI || this.isComplex()) {
      try {
        return await this.parseWithAI();
      } catch (e) {
        console.warn("[AdvancedNLPEngine] AI parsing failed, falling back to rules:", e);
      }
    }

    const ast: HJXAst = {
      kind: "HJXAst",
      version: "0.2",
      component: { name: this.extractComponentName() },
      imports: {},
      script: "",
      state: this.extractState(),
      api: [],
      layout: this.extractLayout(),
      style: [],
      styleRaw: this.extractStyleRaw(),
      handlers: this.extractHandlers(),
      computed: {},
      breakpoints: []
    };

    return ast;
  }

  private isComplex(): boolean {
    const complexKeywords = ["complex", "dynamic", "advanced", "integrated", "custom", "responsive", "accessible", "ai", "dashboard", "smart"];
    const hasComplexKeyword = complexKeywords.some(k => this.text.toLowerCase().includes(k));
    const isLong = this.text.length > 300;
    const hasManyOn = (this.text.match(/on\s+/gi) || []).length > 2;
    return hasComplexKeyword || isLong || hasManyOn;
  }

  private extractComponentName(): string {
    const match = this.text.match(/(?:Create|Build) (?:a\s+)?(?:component|page|app) (?:called|named|named as)?\s*(\w+)/i);
    return match ? match[1] : "App";
  }

  private extractState(): Record<string, HJXStateValue> {
    const state: Record<string, HJXStateValue> = {};
    const varPattern = /(?:With (?:a\s+)?state variable|Track (?:the\s+)?(\w+)\s*(?:as\s+)?(?:a\s+)?state)\s*(\w+)?(?:\s+(?:as|starting at|=)\s+(.+?))?(?=With|Display|Show|Handler|Style|On|When|$)/gi;
    let match;

    while ((match = varPattern.exec(this.text)) !== null) {
      const varName = match[1] || match[2];
      const valueStr = match[3]?.trim() || "null";
      if (varName) {
        state[varName] = this.parseValue(valueStr);
      }
    }

    return state;
  }

  private parseValue(valueStr: string): HJXStateValue {
    if (!valueStr || valueStr === "null") return null;
    if (valueStr.includes("array") || valueStr === "[]") return [];
    if (valueStr.includes("object") || valueStr === "{}") return {};
    if (valueStr.toLowerCase() === "true") return true;
    if (valueStr.toLowerCase() === "false") return false;
    if (/^-?\d+(\.\d+)?$/.test(valueStr)) return parseFloat(valueStr);
    if ((valueStr.startsWith('"') && valueStr.endsWith('"')) || (valueStr.startsWith("'") && valueStr.endsWith("'"))) return valueStr.slice(1, -1);
    return valueStr;
  }

  private extractLayout(): HJXNode | null {
    const layoutSection = this.extractSection("Display|Show");
    if (!layoutSection) return null;

    return this.buildLayoutTree(layoutSection);
  }

  private buildLayoutTree(text: string): HJXNode {
    const root: HJXNode = {
      kind: "node",
      tag: "view",
      classes: ["root"],
      attrs: {},
      props: {},
      text: null,
      events: {},
      bind: null,
      children: []
    };

    const lines = text.split('\n').filter(l => l.trim());
    for (const line of lines) {
      const node = this.parseLayoutLine(line);
      if (node) {
        root.children.push(node);
      }
    }

    return root;
  }

  private parseLayoutLine(line: string): HJXNode | null {
    line = line.trim();
    const baseNode = (): HJXNode => ({
      kind: "node",
      tag: "view",
      classes: [],
      attrs: {},
      props: {},
      text: null,
      events: {},
      bind: null,
      children: []
    });

    if (line.match(/Show text|Display text|text:/i)) {
      const match = line.match(/(?:Show|Display) text[:\s]+["']?([^"']+)["']?/i);
      if (match) {
        const node = baseNode();
        node.tag = "text";
        node.text = match[1];
        return node;
      }
    }
    if (line.match(/button|Show.*button/i)) {
      const match = line.match(/button[:\s]+(?:labeled\s+)?["']?([^"']+)["']?/i);
      if (match) {
        const node = baseNode();
        node.tag = "button";
        node.text = match[1];
        return node;
      }
    }
    if (line.match(/input|field/i)) {
      const node = baseNode();
      node.tag = "input";
      node.attrs = { type: "text" };
      node.props = { type: "text" };
      return node;
    }
    if (line.match(/container|card|section|view/i)) {
      const node = baseNode();
      node.tag = "view";
      node.classes = ["container"];
      return node;
    }
    
    const forMatch = line.match(/(?:For each|for)\s+(\w+)\s+in\s+(\w+)/i);
    if (forMatch) {
      const node = baseNode();
      node.kind = "for";
      node.tag = "for";
      node.iterator = { item: forMatch[1], list: forMatch[2] };
      return node;
    }

    const ifMatch = line.match(/If\s+(.+?)(?:show|display|then)?/i);
    if (ifMatch) {
      const node = baseNode();
      node.kind = "if";
      node.tag = "if";
      node.condition = ifMatch[1];
      return node;
    }

    return null;
  }

  private extractHandlers(): Record<string, HJXHandler> {
    const handlers: Record<string, HJXHandler> = {};
    const handlerPattern = /(?:Handler|On)\s+(\w+)(?:\s+with\s+parameter\s+(\w+))?\s*(?:that|which|to|it should)?\s*\n?([\s\S]*?)(?=Handler|On|When|Display|Show|$)/gi;
    let match;

    while ((match = handlerPattern.exec(this.text)) !== null) {
      const name = match[1];
      const body = match[3]?.trim() || "";

      handlers[name] = {
        name,
        body: this.translateHandlerBody(body).split("\n").filter(l => l.trim())
      };
    }

    return handlers;
  }

  private translateHandlerBody(body: string): string {
    let code = body;
    code = code.replace(/Set (\w+) to (.+?)(?=\n|$)/gi, "set $1 = $2");
    code = code.replace(/Increase (\w+) by (\d+)/gi, "set $1 = $1 + $2");
    code = code.replace(/Decrease (\w+) by (\d+)/gi, "set $1 = $1 - $2");
    code = code.replace(/Add (.+?) to (\w+)/gi, "set $2 = [...$2, $1]");
    code = code.replace(/Remove (.+?) from (\w+)/gi, "set $2 = $2.filter(item => item !== $1)");
    code = code.replace(/If (.+?)(?=\n|$)/gi, "if ($1)");
    return code;
  }

  private extractStyleRaw(): string {
    const styleSection = this.extractSection("Style");
    if (!styleSection) return "";

    let css = "";
    const lines = styleSection.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const match = trimmed.match(/Style (.+?) with (.+)/i);
      if (match) css += `${match[1]} { ${match[2]} }\n`;
    }
    return css;
  }

  private extractSection(keyword: string): string | null {
    const regex = new RegExp(`${keyword}[^]*?(?=(?:${keyword}|Handler|On|When|$))`, "i");
    const match = this.text.match(regex);
    return match ? match[0] : null;
  }
}

export async function parseWithNLP(text: string): Promise<HJXAst> {
  const engine = new AdvancedNLPEngine(text);
  return await engine.parse();
}
