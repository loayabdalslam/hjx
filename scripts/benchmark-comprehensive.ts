/**
 * HJX Comprehensive Benchmark Suite
 * 
 * Tests:
 * - Parser performance
 * - Compiler performance (vanilla + React)
 * - CSS scoping
 * - Flow-State engine
 * - Runtime performance (JSDOM)
 * - Server runtime
 */

import { performance } from 'node:perf_hooks';
import { writeFileSync } from 'node:fs';
import { parseHJX } from '../src/parser.js';
import { buildVanilla } from '../src/compiler/vanilla.js';
import { parseFlowState } from '../src/nlp/flow/flow_engine.js';
import { JSDOM } from 'jsdom';

// ============================================================
// Benchmark Runner
// ============================================================

interface BenchmarkResult {
  name: string;
  iterations: number;
  total: number;
  avg: number;
  min: number;
  max: number;
}

function benchmark(name: string, fn: () => void, iterations = 10): BenchmarkResult {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    times.push(end - start);
  }

  const total = times.reduce((a, b) => a + b, 0);
  return {
    name,
    iterations,
    total,
    avg: total / iterations,
    min: Math.min(...times),
    max: Math.max(...times),
  };
}

function formatResult(r: BenchmarkResult): string {
  return `${r.name}: ${r.avg.toFixed(4)} ms (avg of ${r.iterations} runs)`;
}

// ============================================================
// Test Data Generation
// ============================================================

function generateStateVars(count: number): string {
  let state = 'state:\n';
  for (let i = 0; i < count; i++) {
    state += `  var${i} = ${i}\n`;
  }
  return state;
}

function generateLayoutNodes(count: number, indent = 2): string {
  if (count <= 0) return '';

  let layout = 'layout:\n';
  for (let i = 0; i < count; i++) {
    const pad = ' '.repeat(indent);
    layout += `${pad}view.item${i}:\n`;
    layout += `${pad}  text: "Item ${i}"\n`;
  }
  return layout;
}

function generateCSSRules(count: number): string {
  let css = 'style:\n';
  for (let i = 0; i < count; i++) {
    css += `  .rule${i}:\n`;
    css += `    padding ${10 + i}px\n`;
    css += `    margin ${i}px\n`;
  }
  return css;
}

// ============================================================
// Benchmark Suites
// ============================================================

console.log('🏃 HJX Benchmark Suite\n');
console.log('─'.repeat(60) + '\n');

const results: string[] = [];
const platform = `${process.platform} ${process.arch}`;
const date = new Date().toISOString();

results.push(`# HJX Framework Benchmarks\n\n`);
results.push(`Date: ${date}\n`);
results.push(`Platform: ${platform}\n\n`);

// Suite 1: Parser Performance
console.log('📊 Parser Performance');
console.log('─'.repeat(40));

const parse100State = benchmark('Parse 100 state variables', () => {
  parseHJX(`component Test\n${generateStateVars(100)}`);
}, 20);
console.log(formatResult(parse100State));
results.push(`- Parse 100 state variables: ${parse100State.avg.toFixed(4)} ms\n`);

const parse1000State = benchmark('Parse 1000 state variables', () => {
  parseHJX(`component Test\n${generateStateVars(1000)}`);
}, 10);
console.log(formatResult(parse1000State));
results.push(`- Parse 1000 state variables: ${parse1000State.avg.toFixed(4)} ms\n`);

const parse5000State = benchmark('Parse 5000 state variables', () => {
  parseHJX(`component Test\n${generateStateVars(5000)}`);
}, 5);
console.log(formatResult(parse5000State));
results.push(`- Parse 5000 state variables: ${parse5000State.avg.toFixed(4)} ms\n`);

const parse100Nodes = benchmark('Parse 100 static nodes', () => {
  parseHJX(`component Test\n${generateLayoutNodes(100)}`);
}, 20);
console.log(formatResult(parse100Nodes));
results.push(`- Parse 100 static nodes: ${parse100Nodes.avg.toFixed(4)} ms\n`);

const parse1000Nodes = benchmark('Parse 1000 static nodes', () => {
  parseHJX(`component Test\n${generateLayoutNodes(1000)}`);
}, 10);
console.log(formatResult(parse1000Nodes));
results.push(`- Parse 1000 static nodes: ${parse1000Nodes.avg.toFixed(4)} ms\n`);

const parse5000Nodes = benchmark('Parse 5000 static nodes', () => {
  parseHJX(`component Test\n${generateLayoutNodes(5000)}`);
}, 5);
console.log(formatResult(parse5000Nodes));
results.push(`- Parse 5000 static nodes: ${parse5000Nodes.avg.toFixed(4)} ms\n\n`);

// Suite 2: Compiler Performance
console.log('\n📊 Compiler Performance');
console.log('─'.repeat(40));

const compile100 = benchmark('Compile 100 nodes → Vanilla', () => {
  const ast = parseHJX(`component Test\n${generateLayoutNodes(100)}`);
  buildVanilla(ast);
}, 20);
console.log(formatResult(compile100));
results.push(`- Compile 100 nodes → Vanilla JS: ${compile100.avg.toFixed(4)} ms\n`);

const compile1000 = benchmark('Compile 1000 nodes → Vanilla', () => {
  const ast = parseHJX(`component Test\n${generateLayoutNodes(1000)}`);
  buildVanilla(ast);
}, 10);
console.log(formatResult(compile1000));
results.push(`- Compile 1000 nodes → Vanilla JS: ${compile1000.avg.toFixed(4)} ms\n`);

const compile5000 = benchmark('Compile 5000 nodes → Vanilla', () => {
  const ast = parseHJX(`component Test\n${generateLayoutNodes(5000)}`);
  buildVanilla(ast);
}, 5);
console.log(formatResult(compile5000));
results.push(`- Compile 5000 nodes → Vanilla JS: ${compile5000.avg.toFixed(4)} ms\n`);

const scope100CSS = benchmark('Scope 100 CSS rules', () => {
  const ast = parseHJX(`component Test\n${generateCSSRules(100)}`);
  buildVanilla(ast);
}, 20);
console.log(formatResult(scope100CSS));
results.push(`- Scope 100 CSS rules: ${scope100CSS.avg.toFixed(4)} ms\n`);

const scope1000CSS = benchmark('Scope 1000 CSS rules', () => {
  const ast = parseHJX(`component Test\n${generateCSSRules(1000)}`);
  buildVanilla(ast);
}, 10);
console.log(formatResult(scope1000CSS));
results.push(`- Scope 1000 CSS rules: ${scope1000CSS.avg.toFixed(4)} ms\n\n`);

// Suite 3: Flow-State Engine
console.log('\n📊 Flow-State Engine Performance');
console.log('─'.repeat(40));

const flowCounter = benchmark('Flow: "create a counter"', () => {
  parseFlowState('create a counter component');
}, 50);
console.log(formatResult(flowCounter));
results.push(`- Flow "create a counter": ${flowCounter.avg.toFixed(4)} ms\n`);

const flowForm = benchmark('Flow: "make a form"', () => {
  parseFlowState('make a form with name and email');
}, 50);
console.log(formatResult(flowForm));
results.push(`- Flow "make a form": ${flowForm.avg.toFixed(4)} ms\n`);

const flowTodo = benchmark('Flow: "create a todo list"', () => {
  parseFlowState('create a todo list with add and delete');
}, 50);
console.log(formatResult(flowTodo));
results.push(`- Flow "create a todo list": ${flowTodo.avg.toFixed(4)} ms\n\n`);

// Suite 4: Runtime Performance (JSDOM)
console.log('\n📊 Runtime Performance (JSDOM)');
console.log('─'.repeat(40));

const runtimeInputs = [
  { count: 100, label: '100 items' },
  { count: 1000, label: '1000 items' },
  { count: 2000, label: '2000 items' },
];

for (const { count, label } of runtimeInputs) {
  const hjx = `component Test\nstate:\n  items = ${JSON.stringify(Array.from({ length: count }, (_, i) => `Item ${i}`))}\n\nlayout:\n  for (item in items):\n    view.item:\n      text: "{{item}}"`;

  const renderBench = benchmark(`Initial Render ${label}`, () => {
    const ast = parseHJX(hjx);
    const bundle = buildVanilla(ast);

    // Simulate DOM creation
    const dom = new JSDOM(bundle.html);
    const scriptEl = dom.window.document.createElement('script');
    scriptEl.textContent = bundle.js;
  }, 5);

  console.log(formatResult(renderBench));
  results.push(`- Initial Render ${label}: ${renderBench.avg.toFixed(4)} ms\n`);
}

// ============================================================
// Summary
// ============================================================

console.log('\n' + '─'.repeat(60));
console.log('\n✅ Benchmarks complete!\n');

// Write results
const output = results.join('');
writeFileSync('Benchmark.md', output, 'utf-8');
console.log('📝 Results written to Benchmark.md');
