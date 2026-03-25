export enum Intent {
  CREATE_COMPONENT = "CREATE_COMPONENT",
  ADD_STATE = "ADD_STATE",
  MODIFY_LAYOUT = "MODIFY_LAYOUT",
  ADD_HANDLER = "ADD_HANDLER",
  ADD_STYLE = "ADD_STYLE",
  ADD_IMPORT = "ADD_IMPORT",
  ADD_CONDITIONAL = "ADD_CONDITIONAL",
  ADD_LOOP = "ADD_LOOP",
  BIND_DATA = "BIND_DATA",
  FIX_ERROR = "FIX_ERROR",
  EXPLAIN_CODE = "EXPLAIN_CODE",
  REFACTOR = "REFACTOR",
  ADD_COMPUTED = "ADD_COMPUTED",
  ADD_SCRIPT = "ADD_SCRIPT",
}

export interface IntentResult {
  primaryIntent: Intent;
  secondaryIntents: Intent[];
  confidence: number;
  entities: Record<string, string>;
  text: string;
}

interface RulePattern {
  intent: Intent;
  patterns: RegExp[];
  weight: number;
  entityExtractors?: { name: string; pattern: RegExp }[];
}

const RULE_PATTERNS: RulePattern[] = [
  {
    intent: Intent.CREATE_COMPONENT,
    patterns: [
      /\b(?:create|make|build|add|new|generate)\s+(?:a\s+)?(?:new\s+)?(?:component|page|widget|module|app|form|counter|dashboard|modal|card|nav|login|signup|todo|button|calculator|timer|gallery|search)/i,
      /\bcomponent\s+(?:for|that|to)\b/i,
      /\bi\s+(?:want|need|would\s+like)\s+(?:a\s+)?(?:new\s+)?(?:component|page|form|app)/i,
    ],
    weight: 1.0,
    entityExtractors: [
      { name: "componentName", pattern: /\b(?:create|make|build|add)\s+(?:a\s+)?(?:new\s+)?(?:component\s+(?:called\s+|named\s+)?)?([A-Z][a-zA-Z]*)/i },
    ],
  },
  {
    intent: Intent.ADD_STATE,
    patterns: [
      /\b(?:add|create|define|set)\s+(?:a\s+)?(?:state|variable|prop)/i,
      /\bstate\s+(?:variable|var)\b/i,
      /\b(?:track|store|save|hold|keep)\s+(?:the\s+)?(?:value|count|number|string|data)/i,
      /\b(?:count|name|email|value|list|array|item)\s+(?:variable|state)\b/i,
    ],
    weight: 1.0,
    entityExtractors: [
      { name: "state_var", pattern: /\b(?:called|named)\s+(\w+)/i },
      { name: "state_type", pattern: /\b(string|number|boolean|array|list|object)\b/i },
    ],
  },
  {
    intent: Intent.MODIFY_LAYOUT,
    patterns: [
      /\b(?:add|put|place|insert)\s+(?:a\s+)?(?:text|button|input|image|view|card|header|footer|nav)/i,
      /\b(?:layout|ui|interface|design|structure)\b/i,
      /\b(?:arrange|organize|position|layout)\s+(?:the\s+)?elements/i,
      /\b(?:add|show|display|render)\s+(?:a\s+)?(?:container|section|row|column|grid)/i,
    ],
    weight: 0.7,
  },
  {
    intent: Intent.ADD_HANDLER,
    patterns: [
      /\b(?:on|when|handle|trigger)\s+(?:click|submit|change|input|hover|focus|key|press)/i,
      /\b(?:add|create|implement|write)\s+(?:a\s+)?(?:click\s+)?(?:handler|function|action|event)/i,
      /\b(?:click|submit|press)\s+(?:should|will|to)\s+/i,
      /\b(?:event\s+)?handler\s+(?:for|that)\b/i,
      /\bwhen\s+(?:user|someone)\s+(?:clicks|submits|presses|types)/i,
      /\b(?:increment|decrement|toggle|reset|delete|save)\s+handler/i,
    ],
    weight: 1.5,
  },
  {
    intent: Intent.ADD_STYLE,
    patterns: [
      /\b(?:style|theme|color|background|font|css|design|look|appearance|visual)\b/i,
      /\b(?:make|set|change|add)\s+(?:it\s+)?(?:blue|red|green|dark|light|rounded|shadow)/i,
      /\b(?:padding|margin|border|radius|width|height|size)\b/i,
      /\b(?:dark\s+mode|light\s+mode|responsive|mobile)/i,
    ],
    weight: 1.2,
  },
  {
    intent: Intent.ADD_CONDITIONAL,
    patterns: [
      /\b(?:if|show|hide|display|render)\s+(?:when|only\s+when|if|unless)\b/i,
      /\b(?:conditional|conditionally|depending|based on)\b/i,
      /\b(?:show|hide)\s+(?:if|when|unless)\b/i,
      /\b(?:loading|error|success)\s+(?:state|screen|view)\b/i,
    ],
    weight: 1.0,
  },
  {
    intent: Intent.ADD_LOOP,
    patterns: [
      /\b(?:for|loop|iterate|each|every|list|render)\s+(?:over|through|all|each)/i,
      /\b(?:display|show|render|iterate)\s+(?:a\s+)?(?:list|array|items|elements)/i,
      /\b(?:repeat|map|each|every)\s+(?:item|element|row)/i,
      /\bfor\s*\(\s*\w+\s+in\b/i,
    ],
    weight: 1.0,
  },
  {
    intent: Intent.BIND_DATA,
    patterns: [
      /\b(?:bind|bind|sync|connect|link|two.?way)\s+(?:value|input|data|field)/i,
      /\b(?:value|input)\s+(?:<->|bound\s+to|linked\s+to|synced\s+with)\b/i,
      /\b(?:two.?way)\s+(?:binding|sync|connection)\b/i,
      /\b(?:bind\s+value|bind\s+input)\b/i,
    ],
    weight: 1.0,
  },
  {
    intent: Intent.FIX_ERROR,
    patterns: [
      /\b(?:fix|correct|repair|debug|solve|resolve)\s+(?:the\s+)?(?:error|bug|issue|problem|mistake|syntax)/i,
      /\b(?:there\s+is|found|got)\s+(?:a\s+)?(?:error|bug|issue|problem)/i,
      /\b(?:why|what)\s+(?:is\s+)?(?:wrong|broken|not\s+working)/i,
      /\b(?:doesn't|does\s+not|won't|can't)\s+(?:work|compile|run|build)/i,
      /\bsyntax\s+error\b/i,
    ],
    weight: 1.0,
  },
  {
    intent: Intent.EXPLAIN_CODE,
    patterns: [
      /\b(?:explain|describe|what\s+(?:does|is)|how\s+does|tell\s+me\s+about)/i,
      /\b(?:understand|read|interpret|analyze)\s+(?:this|the)\s+(?:code|component)/i,
      /\bwhat\s+(?:does|is)\s+(?:this|that)\s+(?:doing|for)?\s*\?/i,
    ],
    weight: 1.0,
  },
  {
    intent: Intent.REFACTOR,
    patterns: [
      /\b(?:refactor|optimize|improve|clean|simplify|restructure|reorganize)/i,
      /\b(?:extract|split|merge|combine)\s+(?:into|the)/i,
      /\b(?:better|more\s+efficient|cleaner)\s+(?:code|way|approach)/i,
    ],
    weight: 1.0,
  },
  {
    intent: Intent.ADD_COMPUTED,
    patterns: [
      /\b(?:computed|derived|calculated)\s+(?:value|property|state|variable)/i,
      /\b(?:compute|calculate|derive)\s+(?:the\s+)?(?:total|sum|average|count|result)/i,
      /\bcomputed:\b/i,
    ],
    weight: 1.0,
  },
  {
    intent: Intent.ADD_SCRIPT,
    patterns: [
      /\b(?:script|background|server|init|initialize|setup)\s+(?:code|task|function)/i,
      /\b(?:export|function|init)\b.*\b(?:store|server)\b/i,
      /\bscript:\b/i,
    ],
    weight: 1.0,
  },
];

export class IntentClassifier {
  private rulePatterns: RulePattern[];

  constructor(customPatterns?: RulePattern[]) {
    this.rulePatterns = customPatterns ?? RULE_PATTERNS;
  }

  classify(text: string): IntentResult {
    const normalized = text.toLowerCase().trim();

    const scores: Map<Intent, { score: number; entities: Record<string, string> }> = new Map();

    for (const rule of this.rulePatterns) {
      let matchScore = 0;
      const entities: Record<string, string> = {};

      for (const pattern of rule.patterns) {
        if (pattern.test(normalized)) {
          matchScore += rule.weight;
        }
      }

      if (matchScore > 0) {
        if (rule.entityExtractors) {
          for (const extractor of rule.entityExtractors) {
            const m = normalized.match(extractor.pattern);
            if (m && m[1]) {
              entities[extractor.name] = m[1];
            }
          }
        }

        const existing = scores.get(rule.intent);
        if (!existing || existing.score < matchScore) {
          scores.set(rule.intent, { score: matchScore, entities: { ...existing?.entities, ...entities } });
        }
      }
    }

    if (scores.size === 0) {
      return {
        primaryIntent: Intent.CREATE_COMPONENT,
        secondaryIntents: [],
        confidence: 0.1,
        entities: {},
        text,
      };
    }

    const sorted = Array.from(scores.entries()).sort((a, b) => b[1].score - a[1].score);
    const primary = sorted[0];
    const maxScore = primary[1].score;
    const confidence = Math.min(maxScore / 2, 1.0);

    const secondary = sorted.slice(1, 4)
      .filter(([_, v]) => v.score > maxScore * 0.4)
      .map(([k]) => k);

    return {
      primaryIntent: primary[0],
      secondaryIntents: secondary,
      confidence,
      entities: primary[1].entities,
      text,
    };
  }

  classifyBatch(texts: string[]): IntentResult[] {
    return texts.map(t => this.classify(t));
  }

  train(examples: { text: string; intent: Intent }[]): void {
    // Add new patterns from training examples
    for (const example of examples) {
      const existingRule = this.rulePatterns.find(r => r.intent === example.intent);
      if (existingRule) {
        const words = example.text.toLowerCase().split(/\s+/);
        const uniqueWords = [...new Set(words)].filter(w => w.length > 3);
        const pattern = new RegExp(`\\b${uniqueWords.slice(0, 3).join("\\s+.*")}\\b`, "i");
        if (!existingRule.patterns.some(p => p.source === pattern.source)) {
          existingRule.patterns.push(pattern);
        }
      }
    }
  }
}

export function classifyIntent(text: string): IntentResult {
  return new IntentClassifier().classify(text);
}
