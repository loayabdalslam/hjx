import { describe, it, expect } from 'vitest';
import { parse } from '../src/parser/index.js';

describe('Intent Parser Core', () => {
  it('should parse simple intent blocks', () => {
    const source = `target: javascript\n# Intent 1\ncode1\n# Intent 2\ncode2`;
    const program = parse(source);
    expect(program.target).toBe('javascript');
    expect(program.blocks.length).toBe(2);
  });

  it('should handle @target directives', () => {
    const source = `@target python\n# Do something`;
    const program = parse(source);
    expect(program.target).toBe('python');
  });
});
