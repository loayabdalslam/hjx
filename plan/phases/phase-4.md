# Phase 4: Variants & Composition

## Overview
Support component variants and advanced composition patterns.

## Tasks

### Task 4-1: Create variants.ts
**Status:** Pending  
**Priority:** Medium  
**Estimated:** 1.5 hours  
**Depends on:** Phase 2 complete

Create `src/components/variants.ts` with:
- Variant definitions for each component
- Variant resolution logic
- Variant composition

Variants:
- Button: primary, secondary, danger, outline, ghost
- Card: elevated, flat, outlined
- Input: text, email, password, number, textarea
- Alert: info, success, warning, error

### Task 4-2: Update parser.ts
**Status:** Pending  
**Priority:** Medium  
**Estimated:** 1.5 hours  
**Depends on:** Task 4-1

Update `src/parser.ts` to:
- Parse component props
- Handle variant syntax
- Validate prop values

### Task 4-3: Update compilers
**Status:** Pending  
**Priority:** Medium  
**Estimated:** 1.5 hours  
**Depends on:** Task 4-2

Update `src/compiler/vanilla.ts` and `src/compiler/react.ts` to:
- Apply variants to components
- Generate variant-specific CSS
- Handle variant composition

### Task 4-4: Add tests
**Status:** Pending  
**Priority:** Low  
**Estimated:** 0.5 hours  
**Depends on:** Task 4-3

Create `src/components/variants.test.ts` with:
- Variant resolution tests
- Composition tests
- Edge case tests

## Verification

- [ ] `button.primary` renders primary button
- [ ] `button.danger` renders danger button
- [ ] `card.elevated` renders elevated card
- [ ] Variants compose correctly
- [ ] Tests pass

## Notes

- Variants should be composable
- Should support custom variants
- Should be type-safe
