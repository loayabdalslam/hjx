# Phase 2: Component Library

## Overview
Create 10 built-in components and a registry system to manage them.

## Components to Create

1. **Button** - Primary, secondary, danger, outline, ghost variants
2. **Card** - Container with header, body, footer
3. **Input** - Text input with label, error state
4. **Form** - Form wrapper with submit handling
5. **Modal** - Dialog with backdrop and actions
6. **Alert** - Alert/notification component
7. **Badge** - Small label/tag component
8. **Spinner** - Loading spinner
9. **Tabs** - Tab navigation
10. **Dropdown** - Select/dropdown menu

## Tasks

### Task 2-1 to 2-6: Create Components
**Status:** Pending  
**Priority:** High  
**Estimated:** 2 hours each

Create `.hjx` files for each component with:
- Default styles using design tokens
- Variants and props
- Event handlers
- Documentation

### Task 2-7: Create Component Registry
**Status:** Pending  
**Priority:** High  
**Estimated:** 1 hour  
**Depends on:** All component tasks

Create `src/components/registry.ts` to:
- Map component names to HJX definitions
- Provide component metadata
- Handle component resolution

### Task 2-8: Update Parser
**Status:** Pending  
**Priority:** High  
**Estimated:** 1 hour  
**Depends on:** Task 2-7

Update `src/parser.ts` to:
- Recognize built-in component imports
- Resolve `@ComponentName` syntax
- Validate component usage

### Task 2-9: Update Compilers
**Status:** Pending  
**Priority:** High  
**Estimated:** 1 hour  
**Depends on:** Task 2-8

Update `src/compiler/vanilla.ts` and `src/compiler/react.ts` to:
- Inline built-in components
- Generate correct component code
- Handle component props

## Verification

- [ ] All 10 components created
- [ ] Registry working correctly
- [ ] Parser recognizes built-in imports
- [ ] Vanilla compilation works
- [ ] React compilation works
- [ ] Tests pass

## Notes

- Components should be composable
- Props should be type-safe
- Components should use design tokens
