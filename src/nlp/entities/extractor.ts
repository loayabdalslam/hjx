export enum EntityType {
  COMPONENT_NAME = "COMPONENT_NAME",
  STATE_VARIABLE = "STATE_VARIABLE",
  EVENT_HANDLER = "EVENT_HANDLER",
  CSS_CLASS = "CSS_CLASS",
  PROPERTY = "PROPERTY",
  DATA_TYPE = "DATA_TYPE",
  EVENT_NAME = "EVENT_NAME",
  STYLE_PROPERTY = "STYLE_PROPERTY",
  STYLE_VALUE = "STYLE_VALUE",
  LAYOUT_ELEMENT = "LAYOUT_ELEMENT",
  CONTROL_FLOW = "CONTROL_FLOW",
  VALUE = "VALUE",
  ACTION = "ACTION",
  FILE_PATH = "FILE_PATH",
}

export interface ExtractedEntity {
  type: EntityType;
  value: string;
  start: number;
  end: number;
  confidence: number;
  context: string;
}

export interface ResolvedEntity extends ExtractedEntity {
  resolved: boolean;
  resolvedValue: string;
  scope: string;
}

interface EntityRule {
  type: EntityType;
  patterns: RegExp[];
  postProcess?: (match: string) => string;
}

const ENTITY_RULES: EntityRule[] = [
  {
    type: EntityType.LAYOUT_ELEMENT,
    patterns: [
      /\b(view|text|button|input|image|img|link|card|modal|dialog|header|footer|nav|form|label|select|textarea|table|div|span|section|article|main|aside)\b/gi,
    ],
  },
  {
    type: EntityType.DATA_TYPE,
    patterns: [
      /\b(string|number|boolean|array|list|object|integer|float|double)\b/gi,
    ],
  },
  {
    type: EntityType.EVENT_NAME,
    patterns: [
      /\b(click|submit|change|input|focus|blur|keydown|keyup|keypress|mouseover|mouseout|mouseenter|mouseleave|scroll|load|resize)\b/gi,
    ],
  },
  {
    type: EntityType.STYLE_PROPERTY,
    patterns: [
      /\b(padding|margin|border|border-radius|background|color|font-size|font-weight|width|height|display|flex|grid|position|top|left|right|bottom|opacity|z-index|overflow|text-align|line-height|box-shadow|gap|align|justify)\b/gi,
    ],
  },
  {
    type: EntityType.STYLE_VALUE,
    patterns: [
      /\b(\d+px|\d+em|\d+rem|\d+%|auto|inherit|none|block|inline|flex|grid|center|left|right|bold|normal|solid|dashed|transparent|absolute|relative|fixed|sticky)\b/gi,
      /\b(blue|red|green|yellow|orange|purple|pink|white|black|gray|grey|dark|light|slate)\b/gi,
    ],
  },
  {
    type: EntityType.DATA_TYPE,
    patterns: [
      /\b(true|false|null|undefined)\b/gi,
    ],
    postProcess: (m) => "boolean",
  },
  {
    type: EntityType.VALUE,
    patterns: [
      /\b(\d+(?:\.\d+)?)\b/g,
      /"([^"]*)"/g,
      /'([^']*)'/g,
    ],
  },
  {
    type: EntityType.FILE_PATH,
    patterns: [
      /(?:from|import|path|file|component)\s*[:\s]+["']?([.\/\w-]+\.hjx)["']?/gi,
      /["']([.\/\w-]+\.hjx)["']/gi,
    ],
  },
  {
    type: EntityType.ACTION,
    patterns: [
      /\b(increment|decrement|toggle|submit|save|delete|remove|add|update|reset|clear|fetch|load|send|show|hide|open|close|create|edit|filter|sort|search)\b/gi,
    ],
  },
];

export class EntityExtractor {
  private rules: EntityRule[];
  private customPatterns: Map<EntityType, RegExp[]> = new Map();

  constructor() {
    this.rules = ENTITY_RULES;
  }

  extractEntities(text: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    const allRules = [...this.rules];

    // Add custom patterns
    for (const [type, patterns] of this.customPatterns) {
      allRules.push({ type, patterns });
    }

    for (const rule of allRules) {
      for (const pattern of rule.patterns) {
        // Reset lastIndex for global patterns
        const regex = new RegExp(pattern.source, pattern.flags);
        let match;
        while ((match = regex.exec(text)) !== null) {
          const value = match[1] ?? match[0];
          entities.push({
            type: rule.type,
            value: rule.postProcess ? rule.postProcess(value) : value,
            start: match.index,
            end: match.index + match[0].length,
            confidence: this.calculateConfidence(rule.type, value, text, match.index),
            context: this.getContext(text, match.index, match.index + match[0].length),
          });
        }
      }
    }

    // Extract identifiers as potential state variables or component names
    const identifierRegex = /\b([A-Z][a-zA-Z0-9]*)\b/g;
    let idMatch;
    while ((idMatch = identifierRegex.exec(text)) !== null) {
      const val = idMatch[1];
      if (!entities.some(e => e.value === val && e.start === idMatch!.index)) {
        entities.push({
          type: EntityType.COMPONENT_NAME,
          value: val,
          start: idMatch.index,
          end: idMatch.index + val.length,
          confidence: 0.6,
          context: this.getContext(text, idMatch.index, idMatch.index + val.length),
        });
      }
    }

    // Extract camelCase identifiers as potential state variables
    const camelCaseRegex = /\b([a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*)\b/g;
    let ccMatch;
    while ((ccMatch = camelCaseRegex.exec(text)) !== null) {
      const val = ccMatch[1];
      if (!entities.some(e => e.value === val && e.start <= ccMatch!.index && e.end >= ccMatch!.index + val.length)) {
        entities.push({
          type: EntityType.STATE_VARIABLE,
          value: val,
          start: ccMatch.index,
          end: ccMatch.index + val.length,
          confidence: 0.7,
          context: this.getContext(text, ccMatch.index, ccMatch.index + val.length),
        });
      }
    }

    return this.deduplicate(entities);
  }

  resolveReferences(entities: ExtractedEntity[], context: Record<string, unknown>): ResolvedEntity[] {
    return entities.map(entity => {
      let resolved = false;
      let resolvedValue = entity.value;
      let scope = "unknown";

      // Check if entity matches a known state variable
      if (entity.type === EntityType.STATE_VARIABLE && context.stateVars) {
        if ((context.stateVars as string[]).includes(entity.value)) {
          resolved = true;
          scope = "state";
        }
      }

      // Check if entity matches a known handler
      if (entity.type === EntityType.EVENT_HANDLER && context.handlers) {
        if ((context.handlers as string[]).includes(entity.value)) {
          resolved = true;
          scope = "handlers";
        }
      }

      // Check if entity matches a known import
      if (entity.type === EntityType.COMPONENT_NAME && context.imports) {
        if ((context.imports as string[]).includes(entity.value)) {
          resolved = true;
          scope = "imports";
        }
      }

      return { ...entity, resolved, resolvedValue, scope };
    });
  }

  entityLinking(entities: ExtractedEntity[], knownComponents: string[]): ExtractedEntity[] {
    return entities.map(entity => {
      if (entity.type === EntityType.COMPONENT_NAME && knownComponents.includes(entity.value)) {
        return { ...entity, confidence: Math.min(entity.confidence + 0.2, 1.0) };
      }
      return entity;
    });
  }

  addCustomPattern(type: EntityType, pattern: RegExp): void {
    if (!this.customPatterns.has(type)) {
      this.customPatterns.set(type, []);
    }
    this.customPatterns.get(type)!.push(pattern);
  }

  private calculateConfidence(type: EntityType, value: string, text: string, position: number): number {
    let confidence = 0.5;
    const context = this.getContext(text, Math.max(0, position - 30), Math.min(text.length, position + value.length + 30));

    // Higher confidence for context-specific patterns
    if (type === EntityType.LAYOUT_ELEMENT && /\b(add|create|put|display|render)\b/i.test(context)) {
      confidence += 0.3;
    }
    if (type === EntityType.STATE_VARIABLE && /\b(state|variable|var|count|name|value)\b/i.test(context)) {
      confidence += 0.2;
    }
    if (type === EntityType.EVENT_NAME && /\b(on|when|handle|trigger|click)\b/i.test(context)) {
      confidence += 0.3;
    }
    if (type === EntityType.STYLE_PROPERTY && /\b(style|color|background|font|padding|margin)\b/i.test(context)) {
      confidence += 0.3;
    }

    return Math.min(confidence, 1.0);
  }

  private getContext(text: string, start: number, end: number): string {
    const ctxStart = Math.max(0, start - 15);
    const ctxEnd = Math.min(text.length, end + 15);
    return text.substring(ctxStart, ctxEnd);
  }

  private deduplicate(entities: ExtractedEntity[]): ExtractedEntity[] {
    const seen = new Map<string, ExtractedEntity>();
    for (const entity of entities) {
      const key = `${entity.type}:${entity.value}`;
      const existing = seen.get(key);
      if (!existing || entity.confidence > existing.confidence) {
        seen.set(key, entity);
      }
    }
    return Array.from(seen.values()).sort((a, b) => a.start - b.start);
  }
}

export function extractEntities(text: string): ExtractedEntity[] {
  return new EntityExtractor().extractEntities(text);
}
