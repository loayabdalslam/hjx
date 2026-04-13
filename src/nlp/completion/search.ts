import { HJXAst, HJXNode } from "../../types.js";
import { parseHJX } from "../../parser.js";
import { tokenizeHJX, TokenType } from "../tokenizer/tokenizer.js";
import { getEmbedding } from "../features/embeddings.js";

export interface SearchIndexEntry {
  id: string;
  filePath: string;
  componentName: string;
  source: string;
  tokens: string[];
  keywords: Set<string>;
  embedding: number[];
  metadata: {
    stateVars: string[];
    handlers: string[];
    elements: string[];
    classes: string[];
    imports: string[];
  };
}

export interface SemanticSearchResult {
  entry: SearchIndexEntry;
  score: number;
  matchType: "semantic" | "keyword" | "structural" | "hybrid";
  highlights: string[];
}

export interface Usage {
  file: string;
  line: number;
  column: number;
  context: string;
}

export class SemanticCodeSearch {
  private index: Map<string, SearchIndexEntry> = new Map();
  private invertedIndex: Map<string, Set<string>> = new Map();

  addToIndex(id: string, filePath: string, source: string): void {
    const entry = this.buildIndexEntry(id, filePath, source);
    this.index.set(id, entry);

    // Build inverted index
    for (const token of entry.tokens) {
      const lower = token.toLowerCase();
      if (!this.invertedIndex.has(lower)) {
        this.invertedIndex.set(lower, new Set());
      }
      this.invertedIndex.get(lower)!.add(id);
    }
    for (const keyword of entry.keywords) {
      const lower = keyword.toLowerCase();
      if (!this.invertedIndex.has(lower)) {
        this.invertedIndex.set(lower, new Set());
      }
      this.invertedIndex.get(lower)!.add(id);
    }
  }

  removeFromIndex(id: string): void {
    const entry = this.index.get(id);
    if (!entry) return;

    for (const token of entry.tokens) {
      this.invertedIndex.get(token.toLowerCase())?.delete(id);
    }
    this.index.delete(id);
  }

  search(query: string, limit = 10): SemanticSearchResult[] {
    const results: SemanticSearchResult[] = [];
    const queryTokens = this.tokenizeQuery(query);
    const queryEmbedding = getEmbedding(query);

    for (const [id, entry] of this.index) {
      let score = 0;
      const highlights: string[] = [];
      let matchType: "semantic" | "keyword" | "structural" | "hybrid" = "keyword";

      // Keyword matching
      let keywordScore = 0;
      for (const qt of queryTokens) {
        for (const token of entry.tokens) {
          if (token.toLowerCase().includes(qt.toLowerCase())) {
            keywordScore += 1;
            highlights.push(token);
          }
        }
        for (const keyword of entry.keywords) {
          if (keyword.toLowerCase().includes(qt.toLowerCase())) {
            keywordScore += 2;
            highlights.push(keyword);
          }
        }
      }
      keywordScore /= Math.max(queryTokens.length, 1);

      // Semantic similarity
      let semanticScore = 0;
      if (queryEmbedding.length > 0 && entry.embedding.length > 0) {
        semanticScore = this.cosineSimilarity(queryEmbedding, entry.embedding);
        if (semanticScore > 0.5) matchType = "semantic";
      }

      // Metadata matching
      let metaScore = 0;
      for (const qt of queryTokens) {
        if (entry.metadata.stateVars.some(v => v.toLowerCase().includes(qt.toLowerCase()))) metaScore += 1.5;
        if (entry.metadata.handlers.some(h => h.toLowerCase().includes(qt.toLowerCase()))) metaScore += 1.5;
        if (entry.metadata.elements.some(e => e.toLowerCase().includes(qt.toLowerCase()))) metaScore += 1;
      }

      // Combined score
      score = keywordScore * 0.4 + semanticScore * 0.4 + metaScore * 0.2;
      if (keywordScore > 0 && semanticScore > 0.3) matchType = "hybrid";

      if (score > 0.05) {
        results.push({ entry, score, matchType, highlights: [...new Set(highlights)] });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  searchSimilar(componentSource: string, limit = 5): SemanticSearchResult[] {
    const embedding = getEmbedding(componentSource);
    const results: SemanticSearchResult[] = [];

    for (const [id, entry] of this.index) {
      const similarity = this.cosineSimilarity(embedding, entry.embedding);
      if (similarity > 0.1) {
        results.push({ entry, score: similarity, matchType: "structural", highlights: [] });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  findUsages(identifier: string, sources: Map<string, string>): Usage[] {
    const usages: Usage[] = [];

    for (const [filePath, source] of sources) {
      const lines = source.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const regex = new RegExp(`\\b${identifier}\\b`, "g");
        let match;
        while ((match = regex.exec(line)) !== null) {
          usages.push({
            file: filePath,
            line: i + 1,
            column: match.index + 1,
            context: line.trim(),
          });
        }
      }
    }

    return usages;
  }

  private buildIndexEntry(id: string, filePath: string, source: string): SearchIndexEntry {
    const { tokens } = tokenizeHJX(source);
    const tokenValues = tokens.map(t => t.value);
    const keywords = new Set<string>();

    let ast: HJXAst;
    try {
      ast = parseHJX(source);
    } catch {
      ast = { kind: "HJXAst", version: "0.2", component: { name: "Unknown" }, imports: {}, script: "", state: {}, api: [], layout: null, style: [], styleRaw: "", handlers: {}, computed: {}, breakpoints: [] };
    }

    // Extract keywords
    for (const token of tokens) {
      if (token.type === TokenType.KEYWORD) keywords.add(token.value);
    }

    // Collect metadata
    const stateVars = Object.keys(ast.state);
    const handlers = Object.keys(ast.handlers);
    const elements: string[] = [];
    const classes: string[] = [];
    const imports = Object.keys(ast.imports);

    if (ast.layout) {
      this.collectLayoutMeta(ast.layout, elements, classes);
    }

    // CSS classes from style
    const cssClasses = ast.styleRaw.match(/\.[a-zA-Z_][a-zA-Z0-9_-]*/g) || [];
    classes.push(...cssClasses.map((c: string) => c.slice(1)));

    const embedding = getEmbedding(source);

    return {
      id,
      filePath,
      componentName: ast.component.name,
      source,
      tokens: tokenValues,
      keywords,
      embedding,
      metadata: { stateVars, handlers, elements, classes: [...new Set(classes)], imports },
    };
  }

  private collectLayoutMeta(node: HJXNode, elements: string[], classes: string[]): void {
    elements.push(node.tag);
    classes.push(...node.classes);
    for (const child of node.children) {
      this.collectLayoutMeta(child, elements, classes);
    }
  }

  private tokenizeQuery(query: string): string[] {
    return query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }
}

export function createSearchIndex(): SemanticCodeSearch {
  return new SemanticCodeSearch();
}
