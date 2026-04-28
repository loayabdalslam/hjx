# HJX Design System & Component Library - Task Tracking

This folder contains the task tracking system for integrating built-in design systems and components into HJX.

## Overview

**Project Goal:** Embed a comprehensive design system with pre-built components directly into the HJX language core.

**Total Phases:** 6  
**Estimated Duration:** 25-35 hours  
**Status:** In Planning

## Phases

### Phase 1: Design System Foundation (4-6 hours)
Create core design tokens and extend the language to support them.

**Key Tasks:**
- Create `src/design-system/tokens.ts` - Design tokens
- Create `src/design-system/presets.ts` - CSS presets
- Update `src/compiler/nl_css.ts` - Token integration
- Update `src/parser.ts` - Design-system block parsing

**Status:** ⏳ Pending

### Phase 2: Built-in Component Library (8-10 hours)
Create reusable components embedded in the language.

**Key Tasks:**
- Create 10 built-in components (Button, Card, Input, Modal, Form, Tabs, Alert, Badge, Spinner, Dropdown)
- Create `src/components/registry.ts` - Component registry
- Update parsers and compilers to handle components

**Status:** ⏳ Pending

### Phase 3: Grammar Extension (4-6 hours)
Make components discoverable via natural language.

**Key Tasks:**
- Update `grammar.yml` - Component patterns
- Update `src/nlp/flow/flow_engine.ts` - Component generation
- Create `src/nlp/flow/component_patterns.ts` - Patterns

**Status:** ⏳ Pending

### Phase 4: Variants & Composition (4-6 hours)
Support component variants and composition patterns.

**Key Tasks:**
- Add variant support to components
- Update parser for component props
- Create `src/components/variants.ts`

**Status:** ⏳ Pending

### Phase 5: Task Tracking System (2-3 hours)
Create structured task tracking.

**Key Tasks:**
- Create plan folder structure
- Set up task tracking format
- Document progress

**Status:** 🔄 In Progress

### Phase 6: Documentation & Examples (3-4 hours)
Document the design system and provide examples.

**Key Tasks:**
- Create `docs/design-system.md`
- Create example files
- Update README.md

**Status:** ⏳ Pending

## Quick Links

- [Tasks List](tasks.json) - Machine-readable task list
- [Progress](PROGRESS.md) - Current progress summary
- [Phase 1 Details](phases/phase-1.md)
- [Phase 2 Details](phases/phase-2.md)
- [Phase 3 Details](phases/phase-3.md)
- [Phase 4 Details](phases/phase-4.md)
- [Phase 5 Details](phases/phase-5.md)
- [Phase 6 Details](phases/phase-6.md)

## How to Use This System

1. **Check Progress:** See `PROGRESS.md` for current status
2. **View Tasks:** See `tasks.json` for detailed task list
3. **Phase Details:** See `phases/phase-*.md` for phase-specific information
4. **Update Progress:** Edit `PROGRESS.md` and `tasks.json` as work progresses

## Success Criteria

- ✅ All 10 built-in components work in vanilla and React targets
- ✅ Design tokens are used consistently across components
- ✅ Natural language patterns generate correct component code
- ✅ Component variants render correctly
- ✅ Task tracking system is in place and up-to-date
- ✅ Documentation is complete with examples
- ✅ All tests pass
- ✅ No breaking changes to existing functionality
