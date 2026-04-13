import { HJXAst, HJXNode } from "../../types.js";
import { parseHJX } from "../../parser.js";
import { tokenizeHJX, Token, TokenType } from "../tokenizer/tokenizer.js";
import { extractFeatures, FeatureVector } from "./extractor.js";

export interface CodeEmbedding {
  code: string;
  vector: number[];
  dimensions: number;
  method: string;
}

export interface SimilarCode {
  code: string;
  similarity: number;
  source: string;
}

export interface Cluster {
  id: number;
  centroid: number[];
  members: string[];
  label?: string;
}

const EMBEDDING_DIM = 128;

let embeddingCache: Map<string, number[]> = new Map();

export function getEmbedding(source: string): number[] {
  const cacheKey = source.trim();
  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey)!;
  }

  const vector = computeStructuralEmbedding(source);
  embeddingCache.set(cacheKey, vector);
  return vector;
}

export function getEmbeddingSync(source: string): number[] {
  return getEmbedding(source);
}

export function findSimilar(source: string, corpus: { code: string; label?: string }[], limit = 5): SimilarCode[] {
  const queryEmbedding = getEmbedding(source);

  const similarities = corpus.map(item => ({
    code: item.code,
    similarity: cosineSimilarity(queryEmbedding, getEmbedding(item.code)),
    source: item.label ?? "unknown",
  }));

  return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
}

export function clusterComponents(corpus: string[], k = 3): Cluster[] {
  const embeddings = corpus.map(code => ({ code, vector: getEmbedding(code) }));

  // Simple k-means
  const centroids: number[][] = [];
  for (let i = 0; i < k; i++) {
    centroids.push(embeddings[Math.floor(i * embeddings.length / k)].vector.slice());
  }

  let assignments = new Array(embeddings.length).fill(0);

  for (let iter = 0; iter < 20; iter++) {
    // Assign
    let changed = false;
    for (let i = 0; i < embeddings.length; i++) {
      let bestCluster = 0;
      let bestDist = Infinity;
      for (let c = 0; c < k; c++) {
        const dist = euclideanDistance(embeddings[i].vector, centroids[c]);
        if (dist < bestDist) {
          bestDist = dist;
          bestCluster = c;
        }
      }
      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster;
        changed = true;
      }
    }

    if (!changed) break;

    // Update centroids
    for (let c = 0; c < k; c++) {
      const members = embeddings.filter((_, i) => assignments[i] === c);
      if (members.length === 0) continue;
      centroids[c] = new Array(EMBEDDING_DIM).fill(0);
      for (const m of members) {
        for (let d = 0; d < EMBEDDING_DIM; d++) {
          centroids[c][d] += m.vector[d];
        }
      }
      for (let d = 0; d < EMBEDDING_DIM; d++) {
        centroids[c][d] /= members.length;
      }
    }
  }

  const clusters: Cluster[] = [];
  for (let c = 0; c < k; c++) {
    const members = embeddings.filter((_, i) => assignments[i] === c).map(e => e.code);
    if (members.length > 0) {
      clusters.push({ id: c, centroid: centroids[c], members });
    }
  }

  return clusters;
}

function computeStructuralEmbedding(source: string): number[] {
  const vector = new Array(EMBEDDING_DIM).fill(0);
  const { tokens } = tokenizeHJX(source);

  // Token type distribution (first 20 dims)
  const typeCounts: Record<string, number> = {};
  for (const token of tokens) {
    typeCounts[token.type] = (typeCounts[token.type] || 0) + 1;
  }
  const typeMap: Record<string, number> = {
    [TokenType.KEYWORD]: 0, [TokenType.IDENTIFIER]: 1, [TokenType.STRING]: 2,
    [TokenType.NUMBER]: 3, [TokenType.OPERATOR]: 4, [TokenType.DELIMITER]: 5,
    [TokenType.TEMPLATE_LITERAL]: 6, [TokenType.INDENT]: 7, [TokenType.DEDENT]: 8,
    [TokenType.COMMENT]: 9, [TokenType.BOOLEAN]: 10, [TokenType.EOF]: 11,
  };
  for (const [type, idx] of Object.entries(typeMap)) {
    vector[idx] = (typeCounts[type] || 0) / Math.max(tokens.length, 1);
  }

  // Keyword presence (dims 20-45)
  const keywordDims: Record<string, number> = {
    component: 20, state: 21, layout: 22, style: 23, handlers: 24,
    imports: 25, script: 26, computed: 27, if: 28, for: 29, else: 30,
    set: 31, log: 32, view: 33, text: 34, button: 35, input: 36,
    slot: 37, true: 38, false: 39, export: 40, function: 41,
  };
  for (const token of tokens) {
    if (token.type === TokenType.KEYWORD || token.type === TokenType.IDENTIFIER) {
      const dim = keywordDims[token.value];
      if (dim !== undefined) {
        vector[dim] = 1;
      }
    }
  }

  // Structural features (dims 45-65)
  try {
    const ast = parseHJX(source);
    vector[45] = Object.keys(ast.state).length / 20;
    vector[46] = Object.keys(ast.handlers).length / 10;
    vector[47] = Object.keys(ast.imports).length / 10;
    vector[48] = ast.layout ? countNodes(ast.layout) / 50 : 0;
    vector[49] = ast.layout ? treeDepth(ast.layout) / 10 : 0;
    vector[50] = (ast.style.length > 0 || ast.styleRaw.trim()) ? 1 : 0;
    vector[51] = ast.script.trim() ? 1 : 0;
    vector[52] = Object.keys(ast.computed).length / 10;

    // Control flow counts
    let ifCount = 0, forCount = 0;
    if (ast.layout) {
      walkNodes(ast.layout, n => {
        if (n.kind === "if") ifCount++;
        if (n.kind === "for") forCount++;
      });
    }
    vector[53] = ifCount / 10;
    vector[54] = forCount / 10;
  } catch {
    // Failed to parse
  }

  // Token n-gram features (dims 65-95)
  const values = tokens.filter(t => t.type !== TokenType.WHITESPACE && t.type !== TokenType.NEWLINE && t.type !== TokenType.EOF).map(t => t.value);
  for (let i = 0; i < Math.min(values.length - 1, 15); i++) {
    const hash = simpleHash(values[i] + values[i + 1]) % 30;
    vector[65 + hash] = 1;
  }

  // Template variable patterns (dims 95-110)
  const templateVars = source.match(/\{\{[a-zA-Z_][a-zA-Z0-9_.]*\}\}/g) || [];
  vector[95] = templateVars.length / 20;
  const uniqueVars = new Set(templateVars.map(v => v.slice(2, -2).trim().split(".")[0]));
  vector[96] = uniqueVars.size / 20;

  // CSS class patterns (dims 110-120)
  const cssClasses = source.match(/\.[a-zA-Z_][a-zA-Z0-9_-]*/g) || [];
  vector[110] = cssClasses.length / 30;
  vector[111] = new Set(cssClasses).size / 30;

  // Event binding patterns (dims 120-128)
  const events = source.match(/on\s+[a-zA-Z]+\s*->/g) || [];
  vector[120] = events.length / 10;
  const binds = source.match(/bind\s+value\s*<->/g) || [];
  vector[121] = binds.length / 5;

  return normalizeVector(vector);
}

function countNodes(node: HJXNode): number {
  let count = 1;
  for (const child of node.children) {
    count += countNodes(child);
  }
  return count;
}

function treeDepth(node: HJXNode): number {
  if (node.children.length === 0) return 1;
  return 1 + Math.max(...node.children.map(treeDepth));
}

function walkNodes(node: HJXNode, fn: (n: HJXNode) => void): void {
  fn(node);
  for (const child of node.children) {
    walkNodes(child, fn);
  }
}

function normalizeVector(v: number[]): number[] {
  const norm = Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
  if (norm === 0) return v;
  return v.map(x => x / norm);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function clearEmbeddingCache(): void {
  embeddingCache.clear();
}
