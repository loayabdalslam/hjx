import { Intent, IntentResult } from "../intent/classifier.js";
import { ExtractedEntity, EntityType, extractEntities } from "../entities/extractor.js";

export interface TemplateSlot {
  name: string;
  type: string;
  default: string;
  required: boolean;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  intents: Intent[];
  slots: TemplateSlot[];
  generate: (params: Record<string, string>) => string;
}

export interface GenerationResult {
  hjx: string;
  templateId: string;
  confidence: number;
  warnings: string[];
}

const TEMPLATES: Template[] = [
  {
    id: "basic-component",
    name: "Basic Component",
    description: "A minimal HJX component",
    intents: [Intent.CREATE_COMPONENT, Intent.MODIFY_LAYOUT],
    slots: [
      { name: "componentName", type: "string", default: "MyComponent", required: true },
      { name: "hasState", type: "boolean", default: "false", required: false },
      { name: "stateVars", type: "string", default: "", required: false },
      { name: "layoutElements", type: "string", default: '    text: "Hello World"', required: false },
    ],
    generate: (p) => `component ${p.componentName}
${p.hasState === "true" ? `\nstate:\n${p.stateVars}\n` : ""}
layout:
${p.layoutElements}
`,
  },
  {
    id: "counter",
    name: "Counter",
    description: "Counter with increment/decrement",
    intents: [Intent.CREATE_COMPONENT],
    slots: [
      { name: "componentName", type: "string", default: "Counter", required: true },
      { name: "initialValue", type: "number", default: "0", required: false },
    ],
    generate: (p) => `component ${p.componentName}

state:
  count = ${p.initialValue}

layout:
  view#root.card:
    text.title: "Count: {{count}}"
    button.primary (on click -> inc): "Increase"
    button.ghost (on click -> dec): "Decrease"

style:
  .card { padding: 16px; border: 1px solid #ddd; border-radius: 12px; display: inline-flex; flex-direction: column; gap: 12px; font-family: system-ui; }
  .title { font-size: 18px; font-weight: 600; }
  .primary { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 0; }
  .ghost { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 1px solid #ddd; background: transparent; }

handlers:
  inc:
    set count = count + 1
  dec:
    set count = count - 1
`,
  },
  {
    id: "form",
    name: "Form",
    description: "Form with input and submit",
    intents: [Intent.CREATE_COMPONENT],
    slots: [
      { name: "componentName", type: "string", default: "Form", required: true },
      { name: "fields", type: "string", default: "email", required: false },
      { name: "title", type: "string", default: "Form", required: false },
    ],
    generate: (p) => `component ${p.componentName}

state:
${p.fields.split(",").map((f: string) => `  ${f.trim()} = ""`).join("\n")}
  message = ""

layout:
  view.card:
    text.title: "${p.title}"
${p.fields.split(",").map((f: string) => `    input.field (bind value <-> ${f.trim()}): `).join("\n")}
    button.primary (on click -> submit): "Submit"
    text.note: "{{message}}"

style:
  .card { padding: 16px; border: 1px solid #ddd; border-radius: 12px; display: flex; flex-direction: column; gap: 10px; width: 320px; font-family: system-ui; }
  .title { font-size: 18px; font-weight: 700; }
  .field { padding: 10px 12px; border-radius: 10px; border: 1px solid #ddd; }
  .primary { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 0; }

handlers:
  submit:
    log "submitted"
    set message = "Submitted!"
`,
  },
  {
    id: "list",
    name: "List",
    description: "List with add/remove items",
    intents: [Intent.CREATE_COMPONENT],
    slots: [
      { name: "componentName", type: "string", default: "TodoList", required: true },
      { name: "itemName", type: "string", default: "items", required: false },
      { name: "initialItems", type: "string", default: '["Item 1", "Item 2"]', required: false },
    ],
    generate: (p) => `component ${p.componentName}

state:
  ${p.itemName} = ${p.initialItems}
  newItem = ""

layout:
  view.container:
    view.header:
      text.title: "${p.componentName}"

    view.input-section:
      input (bind value <-> newItem):
      button.add-btn (on click -> addItem): "Add"

    view.list:
      for (item in ${p.itemName}):
        view.item-row:
          text: "{{item}}"
          button.delete (on click -> removeItem): "x"

style:
  .container { padding: 20px; max-width: 500px; margin: 0 auto; font-family: system-ui; }
  .header { margin-bottom: 20px; }
  .title { font-size: 24px; font-weight: bold; }
  .input-section { display: flex; gap: 8px; margin-bottom: 20px; }
  .add-btn { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; }
  .item-row { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8f9fa; border-radius: 6px; margin-bottom: 8px; }
  .delete { padding: 4px 8px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; }

handlers:
  addItem:
    set ${p.itemName} = [...${p.itemName}, newItem]
    set newItem = ""
  removeItem:
    set ${p.itemName} = ${p.itemName}.filter(i => i !== ctx.el.dataset.hjxItem)
`,
  },
  {
    id: "conditional-display",
    name: "Conditional Display",
    description: "Show/hide based on state",
    intents: [Intent.ADD_CONDITIONAL],
    slots: [
      { name: "condition", type: "string", default: "isVisible", required: true },
      { name: "element", type: "string", default: '    text: "Content shown conditionally"', required: false },
    ],
    generate: (p) => `if (${p.condition}):
${p.element}
`,
  },
  {
    id: "loop-block",
    name: "Loop Block",
    description: "Iterate over a list",
    intents: [Intent.ADD_LOOP],
    slots: [
      { name: "listName", type: "string", default: "items", required: true },
      { name: "itemName", type: "string", default: "item", required: false },
    ],
    generate: (p) => `for (${p.itemName} in ${p.listName}):
  view.item:
    text: "{{${p.itemName}}}"
`,
  },
  {
    id: "handler",
    name: "Handler",
    description: "Event handler",
    intents: [Intent.ADD_HANDLER],
    slots: [
      { name: "handlerName", type: "string", default: "handleClick", required: true },
      { name: "targetVar", type: "string", default: "", required: false },
      { name: "action", type: "string", default: "", required: false },
    ],
    generate: (p) => {
      let body = "";
      if (p.targetVar && p.action === "increment") {
        body = `  set ${p.targetVar} = ${p.targetVar} + 1`;
      } else if (p.targetVar && p.action === "decrement") {
        body = `  set ${p.targetVar} = ${p.targetVar} - 1`;
      } else if (p.targetVar && p.action === "toggle") {
        body = `  set ${p.targetVar} = !${p.targetVar}`;
      } else if (p.action === "log") {
        body = `  log "${p.handlerName} triggered"`;
      } else if (p.targetVar) {
        body = `  set ${p.targetVar} = ${p.targetVar}`;
      } else {
        body = `  log "${p.handlerName} triggered"`;
      }
      return `handlers:
${p.handlerName}:
${body}
`;
    },
  },
  {
    id: "state-block",
    name: "State Block",
    description: "State variable definition",
    intents: [Intent.ADD_STATE],
    slots: [
      { name: "varName", type: "string", default: "value", required: true },
      { name: "varType", type: "string", default: "string", required: false },
      { name: "initialValue", type: "string", default: "", required: false },
    ],
    generate: (p) => {
      let value = p.initialValue;
      if (!value) {
        switch (p.varType) {
          case "number": value = "0"; break;
          case "boolean": value = "false"; break;
          case "array": value = "[]"; break;
          case "object": value = "{}"; break;
          default: value = '""'; break;
        }
      }
      return `state:
  ${p.varName} = ${value}
`;
    },
  },
  {
    id: "modal",
    name: "Modal Dialog",
    description: "Modal with open/close",
    intents: [Intent.CREATE_COMPONENT],
    slots: [
      { name: "componentName", type: "string", default: "Modal", required: true },
      { name: "title", type: "string", default: "Dialog", required: false },
    ],
    generate: (p) => `component ${p.componentName}

state:
  isOpen = false

layout:
  button (on click -> open): "Open ${p.title}"
  if (isOpen):
    view.overlay:
      view.modal:
        view.modal-header:
          text: "${p.title}"
          button.close (on click -> close): "x"
        view.modal-body:
          slot

style:
  .overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
  .modal { background: white; border-radius: 12px; padding: 24px; max-width: 480px; width: 100%; }
  .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .close { background: none; border: none; font-size: 20px; cursor: pointer; }

handlers:
  open:
    set isOpen = true
  close:
    set isOpen = false
`,
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Dashboard with stats cards",
    intents: [Intent.CREATE_COMPONENT],
    slots: [
      { name: "componentName", type: "string", default: "Dashboard", required: true },
    ],
    generate: (p) => `component ${p.componentName}

state:
  stats = [{ label: "Users", value: 100 }, { label: "Revenue", value: 5000 }]

layout:
  view.dashboard:
    text.heading: "${p.componentName}"
    view.stats-grid:
      for (stat in stats):
        view.stat-card:
          text.stat-value: "{{stat.value}}"
          text.stat-label: "{{stat.label}}"

style:
  .dashboard { padding: 24px; font-family: system-ui; }
  .heading { font-size: 28px; font-weight: bold; margin-bottom: 24px; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
  .stat-card { padding: 20px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .stat-value { font-size: 32px; font-weight: bold; }
  .stat-label { color: #666; margin-top: 4px; }
`,
  },
];

export class TemplateGenerator {
  private templates: Template[];

  constructor() {
    this.templates = TEMPLATES;
  }

  generate(intent: IntentResult, entities: ExtractedEntity[]): GenerationResult {
    const matchedTemplates = this.templates.filter(t => t.intents.includes(intent.primaryIntent));

    if (matchedTemplates.length === 0) {
      return {
        hjx: this.generateFromScratch(intent, entities),
        templateId: "custom",
        confidence: 0.3,
        warnings: ["No matching template found, generated from scratch"],
      };
    }

    // Score templates
    const scored = matchedTemplates.map(template => {
      let score = 0;
      const params = this.fillSlots(template, intent, entities);

      // Score based on how many required slots we could fill
      const requiredSlots = template.slots.filter(s => s.required);
      const filledRequired = requiredSlots.filter(s => params[s.name] && params[s.name] !== s.default);
      score += (filledRequired.length / Math.max(requiredSlots.length, 1)) * 0.5;

      // Score based on entities matching
      for (const entity of entities) {
        if (template.slots.some(s => this.entityMatchesSlot(entity, s))) {
          score += 0.1;
        }
      }

      // Boost score if template name matches entity values
      const templateNameLower = template.name.toLowerCase();
      for (const entity of entities) {
        if (templateNameLower.includes(entity.value.toLowerCase()) || entity.value.toLowerCase().includes(templateNameLower.split(" ")[0])) {
          score += 0.3;
        }
      }

      // Boost score if intent text contains template name as a key word
      const intentTextLower = intent.text.toLowerCase();
      const nameWords = templateNameLower.split(" ").filter(w => w.length > 3);
      for (const word of nameWords) {
        if (intentTextLower.includes(word)) {
          score += 0.4;
        }
      }

      return { template, score, params };
    });

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];

    const hjx = best.template.generate(best.params);
    return {
      hjx,
      templateId: best.template.id,
      confidence: Math.min(best.score + 0.4, 1.0),
      warnings: best.score < 0.3 ? ["Low template match confidence"] : [],
    };
  }

  generateComponent(description: string): string {
    const intent: IntentResult = {
      primaryIntent: Intent.CREATE_COMPONENT,
      secondaryIntents: [],
      confidence: 0.8,
      entities: {},
      text: description,
    };

    const entities = extractEntities(description);

    const result = this.generate(intent, entities);
    return result.hjx;
  }

  getTemplates(): Template[] {
    return [...this.templates];
  }

  addTemplate(template: Template): void {
    this.templates.push(template);
  }

  private fillSlots(template: Template, intent: IntentResult, entities: ExtractedEntity[]): Record<string, string> {
    const params: Record<string, string> = {};

    for (const slot of template.slots) {
      params[slot.name] = slot.default;

      // Try to fill from intent entities
      if (intent.entities[slot.name]) {
        params[slot.name] = intent.entities[slot.name];
      }

      // Try to fill from extracted entities
      for (const entity of entities) {
        if (this.entityMatchesSlot(entity, slot)) {
          params[slot.name] = entity.value;
          break;
        }
      }
    }

    // Extract component name from text
    if (params.componentName === "MyComponent") {
      const nameMatch = intent.text.match(/(?:create|make|build|add)\s+(?:a\s+)?(?:new\s+)?(\w+)/i);
      if (nameMatch && nameMatch[1] && nameMatch[1] !== "new") {
        params.componentName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
      }
    }

    return params;
  }

  private entityMatchesSlot(entity: ExtractedEntity, slot: TemplateSlot): boolean {
    if (slot.name.toLowerCase().includes("name") && entity.type === EntityType.COMPONENT_NAME) return true;
    if (slot.name.toLowerCase().includes("var") && entity.type === EntityType.STATE_VARIABLE) return true;
    if (slot.name.toLowerCase().includes("event") && entity.type === EntityType.EVENT_NAME) return true;
    if (slot.name.toLowerCase().includes("type") && entity.type === EntityType.DATA_TYPE) return true;
    if (slot.name.toLowerCase().includes("element") && entity.type === EntityType.LAYOUT_ELEMENT) return true;
    return false;
  }

  private generateFromScratch(intent: IntentResult, entities: ExtractedEntity[]): string {
    const name = intent.entities.componentName || "MyComponent";
    return `component ${name}

state:
  value = ""

layout:
  view.container:
    text: "Hello from ${name}"
`;
  }
}

export function generateCode(description: string): string {
  return new TemplateGenerator().generateComponent(description);
}
