import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { HJXAst, HJXNode } from "../../types.js";
import { parseHJX } from "../../parser.js";
import { extractFeatures, FeatureVector } from "./extractor.js";
import { getEmbedding, clusterComponents } from "./embeddings.js";
import { FeatureStore } from "./store.js";

export interface VisualizerOptions {
  outputPath: string;
  title: string;
}

export class FeatureVisualizer {
  private store: FeatureStore;
  private options: VisualizerOptions;

  constructor(store: FeatureStore, options?: Partial<VisualizerOptions>) {
    this.store = store;
    this.options = {
      outputPath: options?.outputPath ?? "dist/nlp-visual",
      title: options?.title ?? "HJX NLP Feature Visualization",
    };
  }

  generateASTTree(source: string): string {
    const ast = parseHJX(source);
    return this.nodeToHTML(ast.layout, 0);
  }

  generateComponentDashboard(): string {
    const components = this.store.getAllComponents();
    const stats = this.store.getStats();

    const componentRows = components.map(c => `
      <tr>
        <td>${c.name}</td>
        <td>${c.filePath}</td>
        <td>${c.features.structural.linesOfCode}</td>
        <td>${c.features.structural.complexity}</td>
        <td>${c.features.lexical.stateVariableCount}</td>
        <td>${c.features.structural.handlerCount}</td>
        <td>${c.features.lexical.eventHandlerCount}</td>
        <td>${c.version}</td>
      </tr>
    `).join("\n");

    const featureNames = Object.keys(stats.avgFeatures);
    const barCharts = featureNames.map(key => `
      <div class="bar-container">
        <div class="bar-label">${key}</div>
        <div class="bar" style="width: ${Math.min(stats.avgFeatures[key] * 10, 100)}%">${stats.avgFeatures[key].toFixed(2)}</div>
      </div>
    `).join("\n");

    const clusterData = this.generateClusterData();

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${this.options.title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { margin-bottom: 20px; color: #333; }
    h2 { margin: 20px 0 10px; color: #555; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .stat-card { background: white; padding: 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .stat-value { font-size: 32px; font-weight: bold; color: #007bff; }
    .stat-label { color: #666; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
    th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f8f9fa; font-weight: 600; color: #555; }
    tr:hover { background: #f0f7ff; }
    .bar-container { margin: 4px 0; display: flex; align-items: center; }
    .bar-label { width: 150px; font-size: 12px; color: #666; }
    .bar { background: linear-gradient(90deg, #007bff, #00c6ff); color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; min-width: 30px; }
    .chart-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
    #scatter { width: 100%; height: 400px; }
    .cluster { background: white; padding: 16px; border-radius: 8px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .cluster-title { font-weight: 600; margin-bottom: 8px; }
    .cluster-members { font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${this.options.title}</h1>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">${stats.totalComponents}</div>
        <div class="stat-label">Total Components</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.avgFeatures.linesOfCode?.toFixed(1) ?? 0}</div>
        <div class="stat-label">Avg Lines of Code</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.avgFeatures.complexity?.toFixed(1) ?? 0}</div>
        <div class="stat-label">Avg Complexity</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.totalLabels}</div>
        <div class="stat-label">Total Labels</div>
      </div>
    </div>

    <h2>Components</h2>
    <table>
      <thead>
        <tr><th>Name</th><th>Path</th><th>LOC</th><th>Complexity</th><th>State Vars</th><th>Handlers</th><th>Events</th><th>Version</th></tr>
      </thead>
      <tbody>${componentRows}</tbody>
    </table>

    <h2>Average Feature Metrics</h2>
    <div class="chart-container">
      ${barCharts}
    </div>

    <h2>Component Clusters</h2>
    <div class="chart-container">
      ${clusterData}
    </div>

    <h2>Embedding Scatter Plot (PCA 2D Projection)</h2>
    <div class="chart-container">
      <canvas id="scatter"></canvas>
    </div>
  </div>

  <script>
    // Simple PCA-like 2D projection of embeddings
    const components = ${JSON.stringify(components.map(c => ({
      name: c.name,
      x: c.embedding[0] * 100 + c.embedding[1] * 50,
      y: c.embedding[2] * 100 + c.embedding[3] * 50,
    })))};

    const canvas = document.getElementById('scatter');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth - 40;
    canvas.height = 400;

    const padding = 40;
    const w = canvas.width - padding * 2;
    const h = canvas.height - padding * 2;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    components.forEach(c => {
      minX = Math.min(minX, c.x); maxX = Math.max(maxX, c.x);
      minY = Math.min(minY, c.y); maxY = Math.max(maxY, c.y);
    });

    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    components.forEach((c, i) => {
      const x = padding + ((c.x - minX) / (maxX - minX || 1)) * w;
      const y = canvas.height - padding - ((c.y - minY) / (maxY - minY || 1)) * h;

      ctx.fillStyle = \`hsl(\${(i * 137.5) % 360}, 70%, 50%)\`;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#333';
      ctx.font = '11px system-ui';
      ctx.fillText(c.name, x + 8, y + 4);
    });
  </script>
</body>
</html>`;
  }

  generateASTVisualization(source: string): string {
    const ast = parseHJX(source);
    const tree = this.buildTreeData(ast);

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AST Visualization</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: monospace; background: #1e1e1e; color: #d4d4d4; padding: 20px; }
    .tree-node { margin-left: 24px; border-left: 1px solid #444; padding-left: 12px; }
    .node-label { cursor: pointer; padding: 2px 4px; border-radius: 3px; }
    .node-label:hover { background: #2d2d2d; }
    .tag { color: #4ec9b0; }
    .attr { color: #9cdcfe; }
    .text { color: #ce9178; }
    .kind { color: #569cd6; font-weight: bold; }
    .indent { display: inline-block; width: 12px; }
  </style>
</head>
<body>
  <h2 style="color: #fff; margin-bottom: 16px;">AST: ${ast.component.name}</h2>
  <div><span class="kind">component</span> <span class="attr">${ast.component.name}</span></div>
  ${Object.keys(ast.state).length > 0 ? `<div><span class="kind">state:</span></div>
  ${Object.entries(ast.state).map(([k, v]) => `<div class="tree-node"><span class="attr">${k}</span> = <span class="text">${JSON.stringify(v)}</span></div>`).join("")}` : ""}
  ${ast.layout ? `<div style="margin-top: 8px;"><span class="kind">layout:</span></div>${this.nodeToHTML(ast.layout, 0)}` : ""}
  ${Object.keys(ast.handlers).length > 0 ? `<div style="margin-top: 8px;"><span class="kind">handlers:</span></div>
  ${Object.entries(ast.handlers).map(([k, v]) => `<div class="tree-node"><span class="attr">${k}:</span>
  ${v.body.map(b => `<div class="tree-node"><span class="text">${b}</span></div>`).join("")}
  </div>`).join("")}` : ""}
</body>
</html>`;
  }

  writeVisualization(source: string, filename: string): void {
    if (!existsSync(this.options.outputPath)) {
      mkdirSync(this.options.outputPath, { recursive: true });
    }
    const html = this.generateASTVisualization(source);
    writeFileSync(join(this.options.outputPath, filename), html, "utf-8");
  }

  writeDashboard(): void {
    if (!existsSync(this.options.outputPath)) {
      mkdirSync(this.options.outputPath, { recursive: true });
    }
    const html = this.generateComponentDashboard();
    writeFileSync(join(this.options.outputPath, "dashboard.html"), html, "utf-8");
  }

  private nodeToHTML(node: HJXNode | null, depth: number): string {
    if (!node) return "";
    const indent = "  ".repeat(depth + 1);
    let html = `<div class="tree-node" style="margin-left: ${depth * 20}px">`;
    html += `<span class="tag">${node.tag}</span>`;
    if (node.id) html += ` <span class="attr">#${node.id}</span>`;
    if (node.classes.length > 0) html += ` <span class="attr">.${node.classes.join(".")}</span>`;
    if (node.kind === "if" && node.condition) html += ` <span class="text">(${node.condition})</span>`;
    if (node.kind === "for" && node.iterator) html += ` <span class="text">(${node.iterator.item} in ${node.iterator.list})</span>`;
    if (node.text) html += ` <span class="text">"${node.text}"</span>`;
    for (const [event, handler] of Object.entries(node.events)) {
      html += ` <span class="attr">(on ${event} -> ${handler})</span>`;
    }
    html += `</div>\n`;
    for (const child of node.children) {
      html += this.nodeToHTML(child, depth + 1);
    }
    return html;
  }

  private buildTreeData(ast: HJXAst): Record<string, unknown> {
    return {
      component: ast.component.name,
      state: ast.state,
      handlers: Object.keys(ast.handlers),
      layout: ast.layout ? this.nodeToTree(ast.layout) : null,
    };
  }

  private nodeToTree(node: HJXNode): Record<string, unknown> {
    return {
      tag: node.tag,
      kind: node.kind,
      id: node.id,
      classes: node.classes,
      text: node.text,
      events: node.events,
      children: node.children.map(c => this.nodeToTree(c)),
    };
  }

  private generateClusterData(): string {
    const components = this.store.getAllComponents();
    if (components.length < 3) return "<p>Not enough components for clustering.</p>";

    const codes = components.map(c => c.source);
    const k = Math.min(3, Math.floor(codes.length / 2));
    const clusters = clusterComponents(codes, k);

    return clusters.map((cluster, i) => {
      const matchedNames = cluster.members.map(code => {
        const comp = components.find(c => c.source === code);
        return comp?.name ?? "unknown";
      });
      return `<div class="cluster">
        <div class="cluster-title">Cluster ${i + 1} (${cluster.members.length} components)</div>
        <div class="cluster-members">${matchedNames.join(", ")}</div>
      </div>`;
    }).join("\n");
  }
}
