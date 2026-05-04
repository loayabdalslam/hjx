/**
 * Hjx Code Generator
 * Builds prompts from parsed intent, calls the AI provider,
 * extracts clean code, generates explanations.
 */

import { execSync, spawnSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

// ─── Prompt Builder ───────────────────────────────────────────────────────────

export function buildPrompt(program, options = {}) {
  const { target, blocks, description } = program;
  const intents = blocks.map((b, i) => `${i + 1}. ${b.raw}`).join('\n');
  const context = description ? `Program description: ${description}\n\n` : '';

  return `You are a code generator for the Hjx programming language runtime.
Your job is to convert plain-English intent statements into clean, runnable ${target} code.

${context}Target language: ${target}
User intent:
${intents}

Rules:
- Output ONLY raw ${target} code with no markdown, no explanation, no backticks, no preamble.
- The code must be complete and directly runnable.
- Use idiomatic ${target} patterns.
- Add concise inline comments where helpful.
- If intent includes multiple steps, chain them logically in one program.

Code:`;
}

export function buildExplainPrompt(code, target, intent) {
  return `You are a helpful coding assistant explaining generated ${target} code.

The user described their intent as:
"${intent}"

The following ${target} code was generated:
\`\`\`${target}
${code}
\`\`\`

Provide a clear, concise explanation (3-6 sentences) of what this code does and how it fulfills the intent.
Do not restate the code. Explain it in plain English.`;
}

// ─── Code Extractor ───────────────────────────────────────────────────────────

export function extractCode(rawResponse, target) {
  // Strip markdown fences if AI ignored our instructions
  const fencePattern = new RegExp(
    `\`\`\`(?:${target}|[a-z+#]*)?\n([\\s\\S]*?)\`\`\``,
    'i'
  );
  const match = rawResponse.match(fencePattern);
  if (match) return match[1].trim();

  // Strip leading/trailing explanation lines heuristically
  const lines = rawResponse.split('\n');
  const codeStart = lines.findIndex(l =>
    l.trim() &&
    !l.trim().startsWith('Here') &&
    !l.trim().startsWith('Sure') &&
    !l.trim().startsWith('Below') &&
    !l.trim().startsWith('This')
  );

  if (codeStart > 0) {
    return lines.slice(codeStart).join('\n').trim();
  }

  return rawResponse.trim();
}

// ─── Executor ─────────────────────────────────────────────────────────────────

const EXECUTORS = {
  python:     { cmd: 'python3', ext: '.py',   args: (f) => [f] },
  javascript: { cmd: 'node',   ext: '.js',    args: (f) => [f] },
  typescript: { cmd: 'npx',   ext: '.ts',    args: (f) => ['ts-node', f] },
  go:         { cmd: 'go',     ext: '.go',    args: (f) => ['run', f] },
  rust:       { cmd: null,     ext: '.rs',    args: (f) => [] }, // needs compile step
  java:       { cmd: null,     ext: '.java',  args: (f) => [] }, // needs compile step
  kotlin:     { cmd: null,     ext: '.kt',    args: (f) => [] },
  cpp:        { cmd: null,     ext: '.cpp',   args: (f) => [] },
  c:          { cmd: null,     ext: '.c',     args: (f) => [] },
  sql:        { cmd: 'sqlite3',ext: '.sql',   args: (f) => [':memory:', `.read ${f}`] },
};

export function executeCode(code, target, options = {}) {
  const executor = EXECUTORS[target];
  if (!executor) {
    return { success: false, output: `No executor for target: ${target}`, compiled: false };
  }

  const ext = executor.ext;
  const tmpFile = join(tmpdir(), `hjx_${Date.now()}${ext}`);

  try {
    writeFileSync(tmpFile, code, 'utf8');

    // Compiled languages: build then run
    if (!executor.cmd) {
      return executeCompiled(code, target, tmpFile, options);
    }

    const cmd = executor.cmd;
    const args = executor.args(tmpFile);
    const timeout = options.timeout || 30000;

    const result = spawnSync(cmd, args, {
      encoding: 'utf8',
      timeout,
      env: { ...process.env },
    });

    return {
      success: result.status === 0,
      output: (result.stdout || '') + (result.stderr || ''),
      exitCode: result.status,
      compiled: true,
    };
  } finally {
    try { if (existsSync(tmpFile)) unlinkSync(tmpFile); } catch {}
  }
}

function executeCompiled(code, target, srcFile, options) {
  const tmp = tmpdir();
  const outFile = join(tmp, `hjx_out_${Date.now()}`);

  const compileMap = {
    rust: {
      compile: ['rustc', [srcFile, '-o', outFile]],
      run:     [outFile, []],
    },
    java: {
      compile: ['javac', [srcFile, '-d', tmp]],
      run:     ['java', ['-cp', tmp, 'Main']],
    },
    kotlin: {
      compile: ['kotlinc', [srcFile, '-include-runtime', '-d', `${outFile}.jar`]],
      run:     ['java', ['-jar', `${outFile}.jar`]],
    },
    cpp: {
      compile: ['g++', [srcFile, '-o', outFile, '-std=c++17']],
      run:     [outFile, []],
    },
    c: {
      compile: ['gcc', [srcFile, '-o', outFile]],
      run:     [outFile, []],
    },
  };

  const steps = compileMap[target];
  if (!steps) {
    return { success: false, output: `Compiled executor not configured for ${target}`, compiled: false };
  }

  // Compile step
  const compile = spawnSync(steps.compile[0], steps.compile[1], {
    encoding: 'utf8',
    timeout: 60000,
  });

  if (compile.status !== 0) {
    return {
      success: false,
      output: `Compilation failed:\n${compile.stderr || compile.stdout}`,
      compiled: false,
    };
  }

  // Run step
  const run = spawnSync(steps.run[0], steps.run[1], {
    encoding: 'utf8',
    timeout: options.timeout || 30000,
  });

  try { unlinkSync(outFile); } catch {}

  return {
    success: run.status === 0,
    output: (run.stdout || '') + (run.stderr || ''),
    exitCode: run.status,
    compiled: true,
  };
}

// ─── Full Pipeline ────────────────────────────────────────────────────────────

export async function generate(program, provider, options = {}) {
  const prompt = buildPrompt(program, options);
  const rawResponse = await provider.complete(prompt);
  const code = extractCode(rawResponse, program.target);

  return { code, prompt, rawResponse };
}

export async function explain(code, target, intent, provider) {
  const prompt = buildExplainPrompt(code, target, intent);
  const explanation = await provider.complete(prompt);
  return explanation.trim();
}
