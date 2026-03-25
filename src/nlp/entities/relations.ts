import { ExtractedEntity, EntityType } from "./extractor.js";

export enum RelationType {
  HAS_STATE = "HAS_STATE",
  HAS_HANDLER = "HAS_HANDLER",
  USES_VARIABLE = "USES_VARIABLE",
  BINDS_TO = "BINDS_TO",
  TRIGGERS = "TRIGGERS",
  IMPORTS = "IMPORTS",
  PASSES_PROP = "PASSES_PROP",
  CONTAINS = "CONTAINS",
  MODIFIES = "MODIFIES",
  CONDITIONED_ON = "CONDITIONED_ON",
  LOOPS_OVER = "LOOPS_OVER",
}

export interface Relation {
  type: RelationType;
  source: string;
  sourceType: EntityType;
  target: string;
  targetType: EntityType;
  confidence: number;
  evidence: string;
}

interface RelationPattern {
  type: RelationType;
  pattern: RegExp;
  sourceExtractor: (match: RegExpMatchArray) => string;
  targetExtractor: (match: RegExpMatchArray) => string;
  sourceType: EntityType;
  targetType: EntityType;
}

const RELATION_PATTERNS: RelationPattern[] = [
  {
    type: RelationType.TRIGGERS,
    pattern: /(?:when|on|click|submit|press)\s+(?:the\s+)?(\w+).+?(?:should|will|to)\s+(?:increment|decrement|toggle|submit|save|delete|update|reset|(\w+))/gi,
    sourceExtractor: (m) => m[1],
    targetExtractor: (m) => m[2] ?? m[1] + "Handler",
    sourceType: EntityType.EVENT_NAME,
    targetType: EntityType.EVENT_HANDLER,
  },
  {
    type: RelationType.BINDS_TO,
    pattern: /bind\s+(?:the\s+)?(\w+).+?(?:to|with|<->)\s+(?:the\s+)?(\w+)/gi,
    sourceExtractor: (m) => m[1],
    targetExtractor: (m) => m[2],
    sourceType: EntityType.LAYOUT_ELEMENT,
    targetType: EntityType.STATE_VARIABLE,
  },
  {
    type: RelationType.HAS_STATE,
    pattern: /(?:add|create|define|track|store|save)\s+(?:a\s+)?(?:state\s+)?(?:variable\s+)?(?:called\s+|named\s+)?(\w+)/gi,
    sourceExtractor: () => "component",
    targetExtractor: (m) => m[1],
    sourceType: EntityType.COMPONENT_NAME,
    targetType: EntityType.STATE_VARIABLE,
  },
  {
    type: RelationType.USES_VARIABLE,
    pattern: /(?:set|update|change|modify|increment|decrement)\s+(?:the\s+)?(\w+)\s*(?:=|to|=)/gi,
    sourceExtractor: () => "handler",
    targetExtractor: (m) => m[1],
    sourceType: EntityType.EVENT_HANDLER,
    targetType: EntityType.STATE_VARIABLE,
  },
  {
    type: RelationType.LOOPS_OVER,
    pattern: /(?:for|loop|iterate|each|every)\s+(?:over\s+)?(?:the\s+)?(\w+)/gi,
    sourceExtractor: () => "for_loop",
    targetExtractor: (m) => m[1],
    sourceType: EntityType.CONTROL_FLOW,
    targetType: EntityType.STATE_VARIABLE,
  },
  {
    type: RelationType.CONDITIONED_ON,
    pattern: /(?:if|when|show|hide|only\s+if)\s+(?:the\s+)?(?:not\s+)?(\w+)/gi,
    sourceExtractor: () => "if_block",
    targetExtractor: (m) => m[1],
    sourceType: EntityType.CONTROL_FLOW,
    targetType: EntityType.STATE_VARIABLE,
  },
];

export class RelationExtractor {
  private patterns: RelationPattern[];

  constructor() {
    this.patterns = RELATION_PATTERNS;
  }

  extractRelations(text: string, entities: ExtractedEntity[]): Relation[] {
    const relations: Relation[] = [];

    // Pattern-based extraction
    for (const rule of this.patterns) {
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
      let match;
      while ((match = regex.exec(text)) !== null) {
        const source = rule.sourceExtractor(match);
        const target = rule.targetExtractor(match);

        if (source && target) {
          relations.push({
            type: rule.type,
            source,
            sourceType: rule.sourceType,
            target,
            targetType: rule.targetType,
            confidence: 0.7,
            evidence: match[0],
          });
        }
      }
    }

    // Entity co-occurrence analysis
    const stateVars = entities.filter(e => e.type === EntityType.STATE_VARIABLE);
    const events = entities.filter(e => e.type === EntityType.EVENT_NAME);
    const handlers = entities.filter(e => e.type === EntityType.ACTION);
    const elements = entities.filter(e => e.type === EntityType.LAYOUT_ELEMENT);

    // Events trigger handlers
    for (const event of events) {
      for (const handler of handlers) {
        const distance = Math.abs(event.start - handler.start);
        if (distance < 100) {
          relations.push({
            type: RelationType.TRIGGERS,
            source: event.value,
            sourceType: EntityType.EVENT_NAME,
            target: handler.value + "Handler",
            targetType: EntityType.EVENT_HANDLER,
            confidence: Math.max(0.3, 1 - distance / 200),
            evidence: `Co-occurring: "${event.value}" near "${handler.value}"`,
          });
        }
      }
    }

    // Handlers use state variables
    for (const handler of handlers) {
      for (const stateVar of stateVars) {
        const distance = Math.abs(handler.start - stateVar.start);
        if (distance < 150) {
          relations.push({
            type: RelationType.USES_VARIABLE,
            source: handler.value + "Handler",
            sourceType: EntityType.EVENT_HANDLER,
            target: stateVar.value,
            targetType: EntityType.STATE_VARIABLE,
            confidence: Math.max(0.3, 1 - distance / 300),
            evidence: `Co-occurring: "${handler.value}" near "${stateVar.value}"`,
          });
        }
      }
    }

    return this.deduplicate(relations);
  }

  buildRelationGraph(relations: Relation[]): RelationGraph {
    const nodes = new Map<string, { type: EntityType; relations: Relation[] }>();

    for (const rel of relations) {
      if (!nodes.has(rel.source)) {
        nodes.set(rel.source, { type: rel.sourceType, relations: [] });
      }
      if (!nodes.has(rel.target)) {
        nodes.set(rel.target, { type: rel.targetType, relations: [] });
      }
      nodes.get(rel.source)!.relations.push(rel);
      nodes.get(rel.target)!.relations.push(rel);
    }

    return {
      nodes,
      edges: relations,
      getNeighbors: (nodeId: string) => {
        const node = nodes.get(nodeId);
        if (!node) return [];
        return node.relations
          .filter(r => r.source === nodeId || r.target === nodeId)
          .map(r => r.source === nodeId ? r.target : r.source);
      },
      getByType: (type: RelationType) => relations.filter(r => r.type === type),
    };
  }

  private deduplicate(relations: Relation[]): Relation[] {
    const seen = new Set<string>();
    return relations.filter(r => {
      const key = `${r.type}:${r.source}:${r.target}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

export interface RelationGraph {
  nodes: Map<string, { type: EntityType; relations: Relation[] }>;
  edges: Relation[];
  getNeighbors: (nodeId: string) => string[];
  getByType: (type: RelationType) => Relation[];
}

export function extractRelations(text: string, entities: ExtractedEntity[]): Relation[] {
  return new RelationExtractor().extractRelations(text, entities);
}
