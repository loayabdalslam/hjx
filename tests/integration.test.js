import { describe, it, expect } from 'vitest';
import { runHjx } from '../src/index.js';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

describe('System Integration', () => {
  it('should verify the programmatic API exists', () => {
    expect(typeof runHjx).toBe('function');
  });
});
