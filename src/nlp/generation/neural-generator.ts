import { Intent, IntentResult, classifyIntent } from "../intent/classifier.js";
import { extractEntities, ExtractedEntity, EntityType } from "../entities/extractor.js";
import { TemplateGenerator, GenerationResult } from "./template-generator.js";
import { parseHJX } from "../../parser.js";
// Note: AI/orchestrator removed - using template-based generation

export interface NeuralGenerationConfig {
  maxTokens: number;
  temperature: number;
  beamSize: number;
  topP: number;
  repetitionPenalty: number;
  useAI?: boolean;
}

const DEFAULT_CONFIG: NeuralGenerationConfig = {
  maxTokens: 2048,
  temperature: 0.7,
  beamSize: 3,
  topP: 0.9,
  repetitionPenalty: 1.1,
  useAI: false, // Using template-based generation (no AI/orchestrator)
};

export interface NeuralGenerationResult {
  code: string;
  candidates: string[];
  confidence: number;
  method: "neural" | "template" | "hybrid" | "ai";
  validSyntax: boolean;
  postProcessed: boolean;
}

export class NeuralCodeGenerator {
  private templateGenerator: TemplateGenerator;
  private config: NeuralGenerationConfig;

  constructor(config?: Partial<NeuralGenerationConfig>) {
    this.templateGenerator = new TemplateGenerator();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async generate(description: string, context?: string): Promise<NeuralGenerationResult> {
    if (this.config.useAI) {
      return this.generateWithAI(description, context);
    }

    const intent = await classifyIntent(description);
    const entities = extractEntities(description);

    // Try template-based generation first
    const templateResult = this.templateGenerator.generate(intent, entities);

    // Enhance template result with context-aware modifications
    let code = templateResult.hjx;
    if (context) {
      code = this.mergeWithContext(code, context, intent);
    }

    // Apply post-processing
    code = this.postProcess(code);

    // Validate syntax
    let validSyntax = false;
    try {
      parseHJX(code);
      validSyntax = true;
    } catch {
      // Try to fix common issues
      code = this.attemptFix(code);
      try {
        parseHJX(code);
        validSyntax = true;
      } catch {
        validSyntax = false;
      }
    }

    // Generate candidates using different strategies
    const candidates = this.generateCandidates(description, intent, entities, context);

    return {
      code,
      candidates,
      confidence: templateResult.confidence,
      method: templateResult.templateId === "custom" ? "neural" : "template",
      validSyntax,
      postProcessed: true,
    };
  }

  private async generateWithAI(description: string, context?: string): Promise<NeuralGenerationResult> {
    // Fallback to template generation (no AI/orchestrator needed)
    // Just use the template-based approach
    this.config.useAI = false;
    const result = await this.generate(description, context);
    this.config.useAI = false; // Keep it off
    return {
      ...result,
      method: "template",
      confidence: 0.7
    };
  }

  async generatePartial(existingCode: string, completion: string): Promise<string> {
    let ast;
    try {
      ast = parseHJX(existingCode);
    } catch {
      return await this.generatePartialFallback(existingCode, completion);
    }

    const intent = await classifyIntent(completion);
    const entities = extractEntities(completion);

    switch (intent.primaryIntent) {
      case Intent.ADD_STATE:
        return this.addStateToComponent(existingCode, ast, entities);
      case Intent.ADD_HANDLER:
        return this.addHandlerToComponent(existingCode, ast, entities);
      case Intent.ADD_STYLE:
        return this.addStyleToComponent(existingCode, entities);
      case Intent.ADD_CONDITIONAL:
        return this.addConditionalToLayout(existingCode, ast, entities);
      case Intent.ADD_LOOP:
        return this.addLoopToLayout(existingCode, ast, entities);
      case Intent.ADD_IMPORT:
        return this.addImportToComponent(existingCode, entities);
      case Intent.BIND_DATA:
        return this.addBindingToLayout(existingCode, ast, entities);
      case Intent.ADD_COMPUTED:
        return this.addComputedToComponent(existingCode, ast, entities);
      default:
        const templateResult = this.templateGenerator.generate(intent, entities);
        return templateResult.hjx;
    }
  }

  private addStateToComponent(code: string, ast: any, entities: ExtractedEntity[]): string {
    const stateVar = entities.find(e => e.type === EntityType.STATE_VARIABLE);
    const dataType = entities.find(e => e.type === EntityType.DATA_TYPE);
    const varName = stateVar?.value || "newVar";
    const type = dataType?.value || "string";

    let defaultValue: string;
    switch (type) {
      case "number": defaultValue = "0"; break;
      case "boolean": defaultValue = "false"; break;
      case "array": defaultValue = "[]"; break;
      default: defaultValue = '""'; break;
    }

    if (Object.keys(ast.state).length > 0) {
      // Find state block and add to it
      const stateMatch = code.match(/(state:\n)((?:\s+\w+ = .+\n)*)/);
      if (stateMatch) {
        return code.replace(stateMatch[0], stateMatch[0] + `  ${varName} = ${defaultValue}\n`);
      }
    }

    // Add new state block
    const componentMatch = code.match(/(component\s+\w+\n)/);
    if (componentMatch) {
      return code.replace(componentMatch[0], componentMatch[0] + `\nstate:\n  ${varName} = ${defaultValue}\n`);
    }

    return code + `\nstate:\n  ${varName} = ${defaultValue}\n`;
  }

  private addHandlerToComponent(code: string, ast: any, entities: ExtractedEntity[]): string {
    const action = entities.find(e => e.type === EntityType.ACTION);
    const stateVar = entities.find(e => e.type === EntityType.STATE_VARIABLE);
    const handlerName = action ? action.value + "Handler" : "newHandler";
    const targetVar = stateVar?.value;

    let body: string;
    if (action?.value === "increment" && targetVar) {
      body = `    set ${targetVar} = ${targetVar} + 1`;
    } else if (action?.value === "decrement" && targetVar) {
      body = `    set ${targetVar} = ${targetVar} - 1`;
    } else if (action?.value === "toggle" && targetVar) {
      body = `    set ${targetVar} = !${targetVar}`;
    } else {
      body = `    log "${handlerName} triggered"`;
    }

    if (Object.keys(ast.handlers).length > 0) {
      // Add to existing handlers block
      const handlersEnd = code.lastIndexOf("handlers:");
      if (handlersEnd !== -1) {
        return code + `\n  ${handlerName}:\n${body}\n`;
      }
    }

    return code + `\nhandlers:\n  ${handlerName}:\n${body}\n`;
  }

  private addStyleToComponent(code: string, entities: ExtractedEntity[]): string {
    const prop = entities.find(e => e.type === EntityType.STYLE_PROPERTY);
    const val = entities.find(e => e.type === EntityType.STYLE_VALUE);
    const propName = prop?.value || "padding";
    const value = val?.value || "16px";

    const cssRule = `\n  .container { ${propName}: ${value}; }`;

    if (code.includes("style:")) {
      return code.replace(/(style:\n(?:\s+.*\n)*)/, `$1${cssRule}\n`);
    }

    return code + `\nstyle:${cssRule}\n`;
  }

  private addConditionalToLayout(code: string, ast: any, entities: ExtractedEntity[]): string {
    const stateVar = entities.find(e => e.type === EntityType.STATE_VARIABLE);
    const condition = stateVar?.value || "isVisible";

    const conditional = `\n  if (${condition}):\n    text: "Conditionally shown"\n`;

    if (code.includes("layout:")) {
      return code.replace(/(layout:\n(?:\s+.*\n)*)/, `$1${conditional}`);
    }

    return code;
  }

  private addLoopToLayout(code: string, ast: any, entities: ExtractedEntity[]): string {
    const stateVar = entities.find(e => e.type === EntityType.STATE_VARIABLE);
    const listName = stateVar?.value || "items";

    const loop = `\n  for (item in ${listName}):\n    view.item:\n      text: "{{item}}"\n`;

    if (code.includes("layout:")) {
      return code.replace(/(layout:\n(?:\s+.*\n)*)/, `$1${loop}`);
    }

    return code;
  }

  private addImportToComponent(code: string, entities: ExtractedEntity[]): string {
    const compName = entities.find(e => e.type === EntityType.COMPONENT_NAME);
    const name = compName?.value || "Component";
    const path = `./components/${name}.hjx`;

    if (code.includes("imports:")) {
      return code.replace(/(imports:\n)/, `$1  ${name} from "${path}"\n`);
    }

    const componentMatch = code.match(/(component\s+\w+\n)/);
    if (componentMatch) {
      return code.replace(componentMatch[0], componentMatch[0] + `\nimports:\n  ${name} from "${path}"\n`);
    }

    return code;
  }

  private addBindingToLayout(code: string, ast: any, entities: ExtractedEntity[]): string {
    const stateVar = entities.find(e => e.type === EntityType.STATE_VARIABLE);
    const varName = stateVar?.value || "value";

    return code + `\n  input (bind value <-> ${varName}):\n`;
  }

  private addComputedToComponent(code: string, ast: any, entities: ExtractedEntity[]): string {
    const stateVar = entities.find(e => e.type === EntityType.STATE_VARIABLE);
    const name = stateVar?.value || "computed";

    if (code.includes("computed:")) {
      return code.replace(/(computed:\n)/, `$1  ${name} = ""\n`);
    }

    const stateMatch = code.match(/(state:\n(?:\s+\w+ = .+\n)*)/);
    if (stateMatch) {
      return code.replace(stateMatch[0], stateMatch[0] + `\ncomputed:\n  ${name} = ""\n`);
    }

    return code + `\ncomputed:\n  ${name} = ""\n`;
  }

  private mergeWithContext(code: string, context: string, intent: IntentResult): string {
    try {
      const contextAst = parseHJX(context);

      // If the intent is to modify an existing component, merge
      if (intent.primaryIntent === Intent.ADD_STATE && Object.keys(contextAst.state).length > 0) {
        // Don't duplicate state
        return code;
      }

      return code;
    } catch {
      return code;
    }
  }

  private postProcess(code: string): string {
    // Normalize indentation to 2 spaces
    const lines = code.split("\n");
    const processed = lines.map(line => {
      return line.replace(/\t/g, "  ");
    });

    // Remove trailing whitespace
    let result = processed.join("\n").replace(/\s+$/gm, "");

    // Ensure consistent quotes (double)
    result = result.replace(/'([^']*)'/g, '"$1"');

    // Ensure file ends with newline
    result = result.trimEnd() + "\n";

    return result;
  }

  private attemptFix(code: string): string {
    let fixed = code;

    // Fix missing colons after block headers
    fixed = fixed.replace(/^(state|layout|style|handlers|imports|computed|script)(\s*)$/gm, "$1:");

    // Fix missing component declaration
    if (!fixed.match(/^component\s+\w+/m)) {
      fixed = "component Generated\n\n" + fixed;
    }

    // Fix indentation consistency
    const lines = fixed.split("\n");
    let indent = 0;
    const fixedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.endsWith(":")) {
        const result = "  ".repeat(indent) + trimmed;
        indent++;
        return result;
      }
      return "  ".repeat(indent) + trimmed;
    });

    return fixedLines.join("\n");
  }

  private generateCandidates(
    description: string,
    intent: IntentResult,
    entities: ExtractedEntity[],
    context?: string
  ): string[] {
    const candidates: string[] = [];

    // Candidate 1: Template-based
    const templateResult = this.templateGenerator.generate(intent, entities);
    candidates.push(templateResult.hjx);

    // Candidate 2: Variation with different styling
    const altIntent = { ...intent, entities: { ...intent.entities, styleVariant: "minimal" } };
    const altResult = this.templateGenerator.generate(altIntent, entities);
    candidates.push(altResult.hjx);

    // Candidate 3: If we have context, try a merge approach
    if (context) {
      try {
        parseHJX(context);
        candidates.push(context + "\n\n// Generated from: " + description);
      } catch {
        // Context not valid, skip
      }
    }

    return [...new Set(candidates)];
  }

  private async generatePartialFallback(existingCode: string, completion: string): Promise<string> {
    const intent = await classifyIntent(completion);
    const entities = extractEntities(completion);
    const templateResult = this.templateGenerator.generate(intent, entities);
    return existingCode + "\n\n" + templateResult.hjx;
  }
}

export async function generateCodeNeural(description: string, context?: string): Promise<NeuralGenerationResult> {
  return new NeuralCodeGenerator().generate(description, context);
}
