export { HJXTokenizer, tokenizeHJX, TokenType } from "./tokenizer/tokenizer.js";
export type { Token, TokenStream, TokenError } from "./tokenizer/tokenizer.js";

export { parseEnhanced, normalizeAST, flattenAST, extractSymbolTable, getNodePath, findReferences, getScope } from "./parser/enhanced-parser.js";
export type { EnhancedAST, EnhancedNode, SymbolInfo, EnhancedHandler, Position, SourceRange } from "./parser/enhanced-parser.js";

export { parseWithRecovery } from "./parser/error-recovery.js";
export type { ParseError, RecoveryResult, QuickFix as RecoveryQuickFix } from "./parser/error-recovery.js";
export { ErrorType, ErrorSeverity } from "./parser/error-recovery.js";

export { CanonicalFormatter, formatHJX } from "./parser/canonical-formatter.js";
export type { FormatOptions, DiffLine } from "./parser/canonical-formatter.js";

export { extractFeatures, extractFeaturesFromAST } from "./features/extractor.js";
export type { FeatureVector, StructuralFeatures, LexicalFeatures, SemanticFeatures } from "./features/extractor.js";

export { getEmbedding, findSimilar, clusterComponents, clearEmbeddingCache } from "./features/embeddings.js";
export type { CodeEmbedding, SimilarCode, Cluster } from "./features/embeddings.js";

export { FeatureStore } from "./features/store.js";
export type { ComponentRecord, SearchQuery, SearchResult } from "./features/store.js";

export { FeatureVisualizer } from "./features/visualizer.js";
export type { VisualizerOptions } from "./features/visualizer.js";

export { IntentClassifier, classifyIntent, Intent } from "./intent/classifier.js";
export type { IntentResult } from "./intent/classifier.js";

export { generateTrainingData } from "./intent/training-data.js";
export type { TrainingExample } from "./intent/training-data.js";

export { EntityExtractor, extractEntities, EntityType } from "./entities/extractor.js";
export type { ExtractedEntity, ResolvedEntity } from "./entities/extractor.js";

export { RelationExtractor, extractRelations, RelationType } from "./entities/relations.js";
export type { Relation, RelationGraph } from "./entities/relations.js";

export { TemplateGenerator, generateCode } from "./generation/template-generator.js";
export type { Template, TemplateSlot, GenerationResult } from "./generation/template-generator.js";

export { NeuralCodeGenerator, generateCodeNeural } from "./generation/neural-generator.js";
export type { NeuralGenerationConfig, NeuralGenerationResult } from "./generation/neural-generator.js";

export { IncrementalGenerator, getCompletions, CompletionKind } from "./generation/incremental-generator.js";
export type { CompletionContext, CompletionItem } from "./generation/incremental-generator.js";

export { ErrorDetector, detectErrors, DiagnosticSeverity, DiagnosticCode } from "./errors/detector.js";
export type { Diagnostic, QuickFix } from "./errors/detector.js";

export { ErrorCorrector, correctCode, suggestFixes } from "./errors/corrector.js";
export type { CorrectedCode, CodeChange, FixSuggestion } from "./errors/corrector.js";

export { SemanticCodeSearch, createSearchIndex } from "./completion/search.js";
export type { SearchIndexEntry, SemanticSearchResult, Usage } from "./completion/search.js";

import { IntentClassifier } from "./intent/classifier.js";
import { EntityExtractor } from "./entities/extractor.js";
import { RelationExtractor } from "./entities/relations.js";
import { TemplateGenerator } from "./generation/template-generator.js";
import { NeuralCodeGenerator } from "./generation/neural-generator.js";
import { IncrementalGenerator } from "./generation/incremental-generator.js";
import { ErrorDetector } from "./errors/detector.js";
import { ErrorCorrector } from "./errors/corrector.js";
import { FeatureStore } from "./features/store.js";
import { FeatureVisualizer } from "./features/visualizer.js";
import { extractFeatures } from "./features/extractor.js";
import { getEmbedding, findSimilar, clusterComponents } from "./features/embeddings.js";

export class HJXNLPEngine {
  public intentClassifier: IntentClassifier;
  public entityExtractor: EntityExtractor;
  public relationExtractor: RelationExtractor;
  public templateGenerator: TemplateGenerator;
  public neuralGenerator: NeuralCodeGenerator;
  public incrementalGenerator: IncrementalGenerator;
  public errorDetector: ErrorDetector;
  public errorCorrector: ErrorCorrector;
  public featureStore: FeatureStore;
  public visualizer: FeatureVisualizer;

  constructor() {
    this.intentClassifier = new IntentClassifier();
    this.entityExtractor = new EntityExtractor();
    this.relationExtractor = new RelationExtractor();
    this.templateGenerator = new TemplateGenerator();
    this.neuralGenerator = new NeuralCodeGenerator();
    this.incrementalGenerator = new IncrementalGenerator();
    this.errorDetector = new ErrorDetector();
    this.errorCorrector = new ErrorCorrector();
    this.featureStore = new FeatureStore();
    this.visualizer = new FeatureVisualizer(this.featureStore);
  }

  async classifyIntent(text: string) {
    return await this.intentClassifier.classify(text);
  }

  extractEntities(text: string) {
    return this.entityExtractor.extractEntities(text);
  }

  extractRelations(text: string, entities: any[]) {
    return this.relationExtractor.extractRelations(text, entities);
  }

  async generateCode(description: string, context?: string) {
    return this.neuralGenerator.generate(description, context);
  }

  getCompletions(context: any) {
    return this.incrementalGenerator.getCompletions(context);
  }

  detectErrors(source: string) {
    return this.errorDetector.detectErrors(source);
  }

  correctCode(source: string) {
    return this.errorCorrector.correctCode(source);
  }

  async analyzeComponent(source: string, filePath: string) {
    const features = extractFeatures(source, filePath);
    const embedding = getEmbedding(source);
    const intent = await this.classifyIntent(source);
    const entities = this.extractEntities(source);
    const errors = this.detectErrors(source);
    const relations = this.extractRelations(source, entities);

    return { features, embedding, intent, entities, errors, relations };
  }

  indexComponent(filePath: string, source: string, labels: string[] = []) {
    const features = extractFeatures(source, filePath);
    return this.featureStore.addComponent(filePath, source, features, labels);
  }

  searchComponents(query: any) {
    return this.featureStore.search(query);
  }
}
