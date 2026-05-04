# Phase 7: Bug Fixes & Stability - Action Plan

**Status:** Ready to Start  
**Duration:** 1-2 weeks  
**Priority:** CRITICAL  
**Owner:** Development Team

---

## Overview

Phase 7 focuses on fixing critical bugs that block the test suite and stabilizing the codebase before moving into performance optimization (Phase 8).

---

## Bug #1: Missing Lovable Orchestrator Module (CRITICAL)

### Problem
```
Error: Cannot find module '../../lovable/orchestrator.js' 
imported from E:/chatit.cloud/hjx/hjx/src/nlp/intent/classifier.ts
```

### Root Cause
- `src/nlp/intent/classifier.ts` imports a non-existent module
- `src/lovable/` directory was deleted but imports remain
- Tests fail immediately on import

### Solution

**Step 1: Remove Lovable Dependency**

Files to update:
- `src/nlp/intent/classifier.ts` - Remove orchestrator import
- `src/nlp/generation/neural-generator.ts` - Remove orchestrator import
- `src/nlp/index.ts` - Update exports if needed

**Step 2: Implement Fallback Intent Classification**

Replace orchestrator with simple pattern matching:

```typescript
// src/nlp/intent/classifier.ts
export enum Intent {
  COUNTER = "counter",
  FORM = "form",
  TODO_LIST = "todo-list",
  DASHBOARD = "dashboard",
  UNKNOWN = "unknown"
}

export function classifyIntent(input: string): Intent {
  const lower = input.toLowerCase();
  
  if (lower.includes("counter")) return Intent.COUNTER;
  if (lower.includes("form")) return Intent.FORM;
  if (lower.includes("todo")) return Intent.TODO_LIST;
  if (lower.includes("dashboard")) return Intent.DASHBOARD;
  
  return Intent.UNKNOWN;
}
```

**Step 3: Update Neural Generator**

Remove orchestrator dependency and use simple generation:

```typescript
// src/nlp/generation/neural-generator.ts
export function generateHJX(intent: Intent, description: string): string {
  // Simple template-based generation
  // No orchestrator needed
}
```

**Step 4: Run Tests**

```bash
npm test -- --run
```

Expected: All tests pass

### Files to Modify
- `src/nlp/intent/classifier.ts`
- `src/nlp/generation/neural-generator.ts`
- `src/nlp/index.ts`

### Estimated Time: 2-3 hours

### Verification
- [ ] Tests pass: `npm test -- --run`
- [ ] No import errors
- [ ] Intent classification works
- [ ] Code generation works

---

## Bug #2: Deleted Example Files (MEDIUM)

### Problem
Git status shows deleted files:
```
D examples-showcase.html
D examples/01-beginner-counter.hjx
D examples/02-beginner-todo.hjx
D examples/03-intermediate-form.hjx
D examples/04-intermediate-dashboard.hjx
D examples/05-advanced-ecommerce.hjx
D src/lovable/config/providers.ts
D src/lovable/prompt_builder.ts
```

### Root Cause
- Files were deleted but not committed
- Unclear if deletion was intentional
- Creates confusing git state

### Solution

**Option A: Commit the Deletions (Recommended)**

If these files are no longer needed:

```bash
git add -A
git commit -m "Remove deprecated example files and lovable integration"
```

**Option B: Restore the Files**

If these files should be kept:

```bash
git restore examples-showcase.html
git restore examples/01-beginner-counter.hjx
# ... restore all deleted files
```

### Decision Matrix

| File | Keep? | Reason |
|------|-------|--------|
| `examples-showcase.html` | NO | Replaced by examples/ directory |
| `examples/01-beginner-counter.hjx` | YES | Core example |
| `examples/02-beginner-todo.hjx` | YES | Core example |
| `examples/03-intermediate-form.hjx` | YES | Core example |
| `examples/04-intermediate-dashboard.hjx` | YES | Core example |
| `examples/05-advanced-ecommerce.hjx` | YES | Core example |
| `src/lovable/config/providers.ts` | NO | Lovable integration removed |
| `src/lovable/prompt_builder.ts` | NO | Lovable integration removed |

### Recommended Action

1. Restore all `.hjx` example files
2. Commit deletion of `.html` and lovable files
3. Verify examples work with dev server

```bash
# Restore examples
git restore examples/01-beginner-counter.hjx
git restore examples/02-beginner-todo.hjx
git restore examples/03-intermediate-form.hjx
git restore examples/04-intermediate-dashboard.hjx
git restore examples/05-advanced-ecommerce.hjx

# Commit lovable deletions
git add src/lovable/
git commit -m "Remove lovable integration files"

# Verify
npm run build
npm run dev
```

### Estimated Time: 1-2 hours

### Verification
- [ ] Git status is clean
- [ ] Examples work: `npm run dev`
- [ ] Build succeeds: `npm run build`

---

## Bug #3: Untracked Files Organization (LOW)

### Problem
Multiple untracked files need organization:

```
?? EXAMPLES_COMPLETE.md
?? EXAMPLES_SETUP.md
?? IMPLEMENTATION_COMPLETE.md
?? examples/README.md
?? examples/plain-english/
?? examples/react/
?? examples/semi-hjx/
?? grammar-english.yml
?? src/components/variants.ts
?? src/nlp/advanced-nlp-engine.ts
?? src/nlp/flow/component_patterns.ts
```

### Root Cause
- New files added but not integrated
- Unclear purpose of some files
- Build configuration may need updates

### Solution

**File-by-File Analysis:**

| File | Action | Reason |
|------|--------|--------|
| `EXAMPLES_COMPLETE.md` | DELETE | Duplicate of PROGRESS.md |
| `EXAMPLES_SETUP.md` | DELETE | Covered in README.md |
| `IMPLEMENTATION_COMPLETE.md` | DELETE | Covered in PROGRESS.md |
| `examples/README.md` | KEEP | Useful for examples directory |
| `examples/plain-english/` | REVIEW | Check if needed |
| `examples/react/` | REVIEW | Check if needed |
| `examples/semi-hjx/` | REVIEW | Check if needed |
| `grammar-english.yml` | KEEP | Alternative grammar |
| `src/components/variants.ts` | KEEP | Component variants |
| `src/nlp/advanced-nlp-engine.ts` | REVIEW | Check if needed |
| `src/nlp/flow/component_patterns.ts` | KEEP | Component patterns |

### Recommended Actions

```bash
# Delete redundant documentation
rm EXAMPLES_COMPLETE.md
rm EXAMPLES_SETUP.md
rm IMPLEMENTATION_COMPLETE.md

# Review example directories
ls -la examples/plain-english/
ls -la examples/react/
ls -la examples/semi-hjx/

# Keep grammar file
git add grammar-english.yml

# Keep component files
git add src/components/variants.ts
git add src/nlp/flow/component_patterns.ts

# Review advanced NLP
cat src/nlp/advanced-nlp-engine.ts
# If not used, delete it

# Commit organized state
git add -A
git commit -m "Organize untracked files and remove redundant docs"
```

### Estimated Time: 2-3 hours

### Verification
- [ ] `git status` shows clean working tree
- [ ] All necessary files are tracked
- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm test -- --run`

---

## Phase 7 Checklist

### Week 1: Bug Fixes

- [ ] **Bug #1: Orchestrator Import**
  - [ ] Remove orchestrator imports
  - [ ] Implement fallback classification
  - [ ] Update neural generator
  - [ ] Tests pass

- [ ] **Bug #2: Deleted Files**
  - [ ] Restore example files
  - [ ] Commit lovable deletions
  - [ ] Verify examples work

- [ ] **Bug #3: Untracked Files**
  - [ ] Delete redundant docs
  - [ ] Review example directories
  - [ ] Organize component files
  - [ ] Clean git status

### Week 2: Verification & Polish

- [ ] **Full Test Suite**
  - [ ] `npm test -- --run` passes
  - [ ] No warnings or errors
  - [ ] Coverage report generated

- [ ] **Build Verification**
  - [ ] `npm run build` succeeds
  - [ ] No TypeScript errors
  - [ ] Output files generated

- [ ] **Dev Server**
  - [ ] `npm run dev` starts
  - [ ] Hot reload works
  - [ ] Examples load correctly

- [ ] **Documentation**
  - [ ] README.md is current
  - [ ] CLAUDE.md is accurate
  - [ ] Examples are documented

- [ ] **Git State**
  - [ ] All changes committed
  - [ ] Branch is clean
  - [ ] Ready for Phase 8

---

## Success Criteria

✅ **Phase 7 is complete when:**

1. All tests pass: `npm test -- --run`
2. Build succeeds: `npm run build`
3. Dev server works: `npm run dev`
4. Git status is clean: `git status`
5. No critical bugs remain
6. Documentation is current

---

## Rollback Plan

If issues arise:

```bash
# Revert to last known good state
git log --oneline | head -5
git reset --hard <commit-hash>

# Or revert specific commits
git revert <commit-hash>
```

---

## Next Phase

Once Phase 7 is complete:
- Move to **Phase 8: Performance Optimization**
- Profile parser and compiler
- Optimize bottlenecks
- Add performance tests

---

**Created:** 2026-05-04  
**Target Completion:** 2026-05-18  
**Owner:** Development Team
