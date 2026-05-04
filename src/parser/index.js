/**
 * Intent Parser
 * Reads .hjx source, extracts intent blocks, target language, and metadata
 */

export const SUPPORTED_TARGETS = [
  'python', 'javascript', 'typescript', 'rust',
  'go', 'java', 'kotlin', 'cpp', 'c', 'sql'
];

const TARGET_ALIASES = {
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'c++': 'cpp',
};

/**
 * Parse a .hjx source string into a structured program object
 * @param {string} source - raw .hjx file content
 */
export function parse(source) {
  const lines = source.split('\n');
  const program = {
    target: null,
    description: null,
    blocks: [],
    metadata: {},
    rawSource: source,
  };

  let currentBlock = null;
  let inBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('##')) continue;

    const noComment = trimmed.replace(/#(?!#)[^"']*$/, '').trim();
    if (!noComment) continue;

    const targetMatch = noComment.match(/^(@target|target:)\s+(\w[\w+]*)/i);
    if (targetMatch) {
      const raw = targetMatch[2].toLowerCase();
      program.target = TARGET_ALIASES[raw] || raw;
      continue;
    }

    const descMatch = noComment.match(/^@description\s+(.+)/i);
    if (descMatch) {
      program.description = descMatch[1].trim();
      continue;
    }

    if (!inBlock) {
      if (/^do\s*\{/i.test(noComment)) {
        currentBlock = { type: 'do', lines: [], raw: '' };
        inBlock = true;
        const same = noComment.replace(/^do\s*\{/i, '').replace(/\}$/, '').trim();
        if (same) currentBlock.lines.push(same);
        if (noComment.endsWith('}')) {
          currentBlock.raw = currentBlock.lines.join(' ');
          program.blocks.push(finalizeBlock(currentBlock));
          currentBlock = null;
          inBlock = false;
        }
        continue;
      }

      program.blocks.push({
        type: 'intent',
        raw: noComment,
        index: program.blocks.length,
      });
    } else {
      if (noComment === '}') {
        currentBlock.raw = currentBlock.lines.join('\n');
        program.blocks.push(finalizeBlock(currentBlock));
        currentBlock = null;
        inBlock = false;
      } else {
        currentBlock.lines.push(noComment);
      }
    }
  }

  if (!program.target) program.target = 'python';
  validateTarget(program.target);
  return program;
}

function finalizeBlock(block) {
  return {
    type: 'intent',
    raw: block.raw,
    index: 0,
    multiLine: true,
  };
}

function validateTarget(target) {
  if (!SUPPORTED_TARGETS.includes(target)) {
    throw new Error(`Unsupported target language: "${target}"`);
  }
}

export function parseIntent(text, target = 'python') {
  return {
    target,
    description: null,
    blocks: [{ type: 'intent', raw: text.trim(), index: 0 }],
    metadata: {},
    rawSource: text,
  };
}
