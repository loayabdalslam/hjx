# Phase 3: Grammar Extension

## Overview
Add natural language patterns for component generation.

## Tasks

### Task 3-1: Update grammar.yml
**Status:** Pending  
**Priority:** High  
**Estimated:** 2 hours  
**Depends on:** Phase 2 complete

Add sections to `grammar.yml`:
- Component creation patterns
- Component composition patterns
- Component variant patterns

Examples:
- "create a button component" → Button with customization
- "add a modal dialog" → Modal with title/content/actions
- "make a form with fields X, Y, Z" → Form with inputs
- "create a card with title and description" → Card layout

### Task 3-2: Create component_patterns.ts
**Status:** Pending  
**Priority:** High  
**Estimated:** 1.5 hours  
**Depends on:** Task 3-1

Create `src/nlp/flow/component_patterns.ts` with:
- Predefined component patterns
- Pattern matching logic
- Template substitution

### Task 3-3: Update flow_engine.ts
**Status:** Pending  
**Priority:** High  
**Estimated:** 1.5 hours  
**Depends on:** Task 3-2

Update `src/nlp/flow/flow_engine.ts` to:
- Detect component requests
- Generate component usage code
- Handle component composition

## Verification

- [ ] `hjx flow "create a button component"` works
- [ ] `hjx flow "make a form with name and email"` works
- [ ] `hjx flow "add a modal dialog"` works
- [ ] Generated code is valid HJX
- [ ] Tests pass

## Notes

- Patterns should be flexible
- Should support composition
- Should handle variants
