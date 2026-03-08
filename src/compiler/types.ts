import { HJXNode } from "../types";

export type ExpressionType = 'text' | 'attribute' | 'condition' | 'loop' | 'event' | 'binding';

export interface ElementExpression {
  type: ExpressionType;
  expression: string;
  dependencies: Set<string>;
  attribute?: string;
  item?: string;
  list?: string;
  eventName?: string;
  handlerName?: string;
  bindProp?: string;
}

export interface DependencyGraph {
  // Maps state variables to DOM elements that depend on them
  stateToElements: Map<string, Set<string>>;
  
  // Maps state variables to computed values that depend on them
  stateToComputed: Map<string, Set<string>>;
  
  // Maps computed values to their state dependencies
  computedDeps: Map<string, Set<string>>;
  
  // Stores the raw expression for each computed value
  computedExprs: Map<string, string>;
  
  // Maps each DOM element to its expressions
  elementExpressions: Map<string, ElementExpression[]>;
  
  // Tracks which state variables each handler modifies
  handlerEffects: Map<string, Set<string>>;
  
  // Parent-child relationships for DOM elements
  elementParents: Map<string, string>;
  
  // Elements that need special handling (if/for blocks)
  dynamicElements: Set<string>;
  
  // Performance metrics
  metrics: {
    totalElements: number;
    totalExpressions: number;
    hotStates: string[]; // States that affect many elements
  };
}

export interface AnalysisContext {
  stateKeys: Set<string>;
  path: number[];
  inDynamicBlock: boolean;
  currentIfCondition?: string;
  currentLoopItem?: string;
  currentLoopListSource?: string;
  trackNestedProperties: boolean;
}

export interface AnalysisResult {
  graph: DependencyGraph;
  metrics: {
    hotStates: any;
    totalElements: number;
    analysisTime: number;
    elementCount: number;
    expressionCount: number;
    dependencyCount: number;
  };
}