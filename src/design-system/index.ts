/**
 * HJX Design System - Main Export
 *
 * Exports all design system components, tokens, and utilities.
 */

export { designTokens, getToken, getTokens, tokenToCssVar, generateCssVariables } from './tokens.js';
export type { DesignTokens, ColorTokens, SpacingTokens, TypographyTokens, ShadowTokens, BorderRadiusTokens, TransitionTokens, BreakpointTokens, TypographyValue } from './tokens.js';

export { designPresets, getPreset, combinePresets } from './presets.js';
export type { CSSPreset } from './presets.js';

// Re-export commonly used items
export { defaultTokens, lightTheme, darkTheme, getTheme, mergeTokens } from './tokens.js';
export { generatePresets, isPreset } from './presets.js';
