# Phase 1: Design System Foundation

## Overview
Create core design tokens and presets, then integrate them into the compiler.

## Tasks

### Task 1-1: Create Design Tokens
**Status:** Pending  
**Priority:** High  
**Estimated:** 2 hours

Create `src/design-system/tokens.ts` with:
- Color palette (primary, secondary, success, error, warning, info, neutral)
- Spacing scale (xs, sm, md, lg, xl, 2xl)
- Typography (font sizes, weights, line heights)
- Shadows (sm, md, lg, xl)
- Border radius (sm, md, lg, full)
- Transitions (fast, normal, slow)
- Breakpoints (mobile, tablet, desktop)

### Task 1-2: Create Design Presets
**Status:** Pending  
**Priority:** High  
**Estimated:** 1.5 hours  
**Depends on:** Task 1-1

Create `src/design-system/presets.ts` with:
- Button presets (primary, secondary, danger, outline, ghost)
- Card presets (elevated, flat, outlined)
- Input presets (text, email, password, textarea)
- Container preset
- Form preset
- Modal preset

### Task 1-3: Integrate into nl_css.ts
**Status:** Pending  
**Priority:** High  
**Estimated:** 1.5 hours  
**Depends on:** Task 1-1

Update `src/compiler/nl_css.ts` to:
- Import design tokens
- Resolve token references in CSS
- Support token variables in natural language CSS
- Map preset names to token values

### Task 1-4: Add Parser Support
**Status:** Pending  
**Priority:** Medium  
**Estimated:** 1 hour  
**Depends on:** Task 1-1

Update `src/parser.ts` to:
- Parse `design-system:` block
- Allow theme selection
- Allow token overrides

## Verification

- [ ] `npm run build` succeeds
- [ ] Design tokens are accessible in CSS
- [ ] Presets resolve correctly
- [ ] Parser handles design-system block
- [ ] Tests pass

## Notes

- Design tokens should follow Material Design 3 guidelines
- Presets should be composable
- Tokens should be easily overridable
