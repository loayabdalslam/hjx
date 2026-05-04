import { FlowPattern, FlowContext, FlowResult } from "./flow_engine.js";

export const COMPONENT_PATTERNS: FlowPattern[] = [
  {
    id: "add-component",
    patterns: [
      /add\s+(?:a|an)?\s*(Button|Card|Input|Modal|Form|Tabs|Alert|Badge|Spinner|Dropdown)(?:\s+component)?/i,
      /insert\s+(?:a|an)?\s*(Button|Card|Input|Modal|Form|Tabs|Alert|Badge|Spinner|Dropdown)/i,
      /put\s+(?:a|an)?\s*(Button|Card|Input|Modal|Form|Tabs|Alert|Badge|Spinner|Dropdown)/i,
    ],
    description: "Add a built-in component to the layout",
    handler: (match: RegExpMatchArray, ctx: FlowContext): FlowResult => {
      const comp = match[1];
      return {
        type: "layout",
        hjx: `layout:\n  ${comp}:`,
        confidence: 0.95,
      };
    }
  },
  {
    id: "component-with-variant",
    patterns: [
      /add\s+(?:a|an)?\s*(primary|secondary|danger|outline|ghost)\s+(Button)/i,
      /make\s+(?:a|an)?\s*(elevated|flat)\s+(Card)/i,
    ],
    description: "Add a component with a specific variant",
    handler: (match: RegExpMatchArray, ctx: FlowContext): FlowResult => {
      const variant = match[1];
      const comp = match[2];
      return {
        type: "layout",
        hjx: `layout:\n  ${comp} (variant="${variant}"):`,
        confidence: 0.96,
      };
    }
  }
];
