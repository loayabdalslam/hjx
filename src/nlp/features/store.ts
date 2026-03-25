import { FeatureVector } from "./extractor.js";
import { getEmbedding } from "./embeddings.js";

export interface ComponentRecord {
  id: string;
  name: string;
  filePath: string;
  source: string;
  features: FeatureVector;
  embedding: number[];
  labels: string[];
  version: number;
  timestamp: number;
}

export interface SearchQuery {
  vector?: number[];
  featureFilter?: Partial<Record<string, number>>;
  labelFilter?: string[];
  textFilter?: string;
  limit: number;
}

export interface SearchResult {
  component: ComponentRecord;
  score: number;
  matchType: string;
}

export class FeatureStore {
  private components: Map<string, ComponentRecord> = new Map();
  private pathIndex: Map<string, string> = new Map();
  private labelIndex: Map<string, Set<string>> = new Map();

  addComponent(filePath: string, source: string, features: FeatureVector, labels: string[] = []): string {
    const id = this.generateId(filePath);
    const name = this.extractName(source, filePath);
    const embedding = getEmbedding(source);

    const record: ComponentRecord = {
      id,
      name,
      filePath,
      source,
      features,
      embedding,
      labels,
      version: (this.components.get(id)?.version ?? 0) + 1,
      timestamp: Date.now(),
    };

    this.components.set(id, record);
    this.pathIndex.set(filePath, id);

    for (const label of labels) {
      if (!this.labelIndex.has(label)) {
        this.labelIndex.set(label, new Set());
      }
      this.labelIndex.get(label)!.add(id);
    }

    return id;
  }

  getComponent(id: string): ComponentRecord | undefined {
    return this.components.get(id);
  }

  getComponentByPath(filePath: string): ComponentRecord | undefined {
    const id = this.pathIndex.get(filePath);
    return id ? this.components.get(id) : undefined;
  }

  updateFeatures(id: string, features: Partial<FeatureVector>): boolean {
    const record = this.components.get(id);
    if (!record) return false;
    record.features = { ...record.features, ...features };
    record.version++;
    record.timestamp = Date.now();
    return true;
  }

  deleteComponent(id: string): boolean {
    const record = this.components.get(id);
    if (!record) return false;
    this.pathIndex.delete(record.filePath);
    for (const label of record.labels) {
      this.labelIndex.get(label)?.delete(id);
    }
    this.components.delete(id);
    return true;
  }

  search(query: SearchQuery): SearchResult[] {
    let results: SearchResult[] = [];

    if (query.vector) {
      for (const [id, record] of this.components) {
        const similarity = this.cosineSimilarity(query.vector!, record.embedding);
        results.push({ component: record, score: similarity, matchType: "embedding" });
      }
    }

    if (query.featureFilter) {
      const filterEntries = Object.entries(query.featureFilter);
      for (const [id, record] of this.components) {
        let matchScore = 0;
        for (const [key, value] of filterEntries) {
          if (value === undefined) continue;
          const actual = (record.features.summary as any)[key] ?? 0;
          const diff = Math.abs(actual - value);
          matchScore += 1 / (1 + diff);
        }
        matchScore /= filterEntries.length;
        const existing = results.find(r => r.component.id === id);
        if (existing) {
          existing.score = (existing.score + matchScore) / 2;
        } else {
          results.push({ component: record, score: matchScore, matchType: "features" });
        }
      }
    }

    if (query.labelFilter && query.labelFilter.length > 0) {
      for (const label of query.labelFilter) {
        const ids = this.labelIndex.get(label);
        if (ids) {
          for (const id of ids) {
            const record = this.components.get(id)!;
            const existing = results.find(r => r.component.id === id);
            if (existing) {
              existing.score += 0.5;
            } else {
              results.push({ component: record, score: 0.5, matchType: "label" });
            }
          }
        }
      }
    }

    if (query.textFilter) {
      const lowerFilter = query.textFilter.toLowerCase();
      for (const [id, record] of this.components) {
        if (record.name.toLowerCase().includes(lowerFilter) || record.source.toLowerCase().includes(lowerFilter)) {
          const existing = results.find(r => r.component.id === id);
          if (existing) {
            existing.score += 0.3;
          } else {
            results.push({ component: record, score: 0.3, matchType: "text" });
          }
        }
      }
    }

    if (results.length === 0) {
      for (const [id, record] of this.components) {
        results.push({ component: record, score: 0, matchType: "none" });
      }
    }

    // Deduplicate
    const seen = new Set<string>();
    results = results.filter(r => {
      if (seen.has(r.component.id)) return false;
      seen.add(r.component.id);
      return true;
    });

    return results.sort((a, b) => b.score - a.score).slice(0, query.limit ?? 10);
  }

  processDirectory(fileContents: Map<string, string>, featuresMap: Map<string, FeatureVector>): number {
    let count = 0;
    for (const [path, features] of featuresMap) {
      const source = fileContents.get(path) ?? "";
      this.addComponent(path, source, features);
      count++;
    }
    return count;
  }

  getAllComponents(): ComponentRecord[] {
    return Array.from(this.components.values());
  }

  getStats(): {
    totalComponents: number;
    totalLabels: number;
    avgFeatures: Record<string, number>;
  } {
    const components = this.getAllComponents();
    const avgFeatures: Record<string, number> = {};

    if (components.length > 0) {
      const keys = Object.keys(components[0].features.summary);
      for (const key of keys) {
        avgFeatures[key] = components.reduce((sum, c) => sum + ((c.features.summary as any)[key] || 0), 0) / components.length;
      }
    }

    return {
      totalComponents: components.length,
      totalLabels: this.labelIndex.size,
      avgFeatures,
    };
  }

  private generateId(filePath: string): string {
    let hash = 0;
    for (let i = 0; i < filePath.length; i++) {
      hash = ((hash << 5) - hash + filePath.charCodeAt(i)) | 0;
    }
    return `comp_${Math.abs(hash).toString(36)}`;
  }

  private extractName(source: string, filePath: string): string {
    const match = source.match(/^component\s+(\w+)/m);
    if (match) return match[1];
    const fileName = filePath.split(/[/\\]/).pop() ?? "unknown";
    return fileName.replace(/\.hjx$/, "");
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }
}
