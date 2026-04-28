/**
 * HJX Design System - CSS Presets
 *
 * Pre-built CSS style presets that can be used in natural language CSS.
 * These presets map to design tokens and provide common component styles.
 */

import { DesignTokens, defaultTokens } from './tokens.js';

export interface CSSPreset {
  name: string;
  description: string;
  css: string;
}

export function generatePresets(tokens: DesignTokens = defaultTokens): Record<string, string> {
  return {
    // Container presets
    container: `
      max-width: 1200px;
      margin: 0 auto;
      padding: ${tokens.spacing.lg};
    `,
    'container-sm': `
      max-width: 640px;
      margin: 0 auto;
      padding: ${tokens.spacing.md};
    `,
    'container-lg': `
      max-width: 1400px;
      margin: 0 auto;
      padding: ${tokens.spacing.xl};
    `,

    // Card presets
    card: `
      padding: ${tokens.spacing.lg};
      background: ${tokens.colors.surface};
      border-radius: ${tokens.borderRadius.md};
      box-shadow: ${tokens.shadows.md};
      border: 1px solid ${tokens.colors.outline};
    `,
    'card-elevated': `
      padding: ${tokens.spacing.lg};
      background: ${tokens.colors.surface};
      border-radius: ${tokens.borderRadius.md};
      box-shadow: ${tokens.shadows.lg};
    `,
    'card-flat': `
      padding: ${tokens.spacing.lg};
      background: ${tokens.colors.surfaceVariant};
      border-radius: ${tokens.borderRadius.md};
      border: 1px solid ${tokens.colors.outline};
    `,

    // Button presets
    'button-primary': `
      padding: ${tokens.spacing.sm} ${tokens.spacing.lg};
      background: ${tokens.colors.primary};
      color: white;
      border: none;
      border-radius: ${tokens.borderRadius.md};
      font-weight: 600;
      cursor: pointer;
      transition: ${tokens.transitions.normal};
    `,
    'button-secondary': `
      padding: ${tokens.spacing.sm} ${tokens.spacing.lg};
      background: ${tokens.colors.secondary};
      color: white;
      border: none;
      border-radius: ${tokens.borderRadius.md};
      font-weight: 600;
      cursor: pointer;
      transition: ${tokens.transitions.normal};
    `,
    'button-outline': `
      padding: ${tokens.spacing.sm} ${tokens.spacing.lg};
      background: transparent;
      color: ${tokens.colors.primary};
      border: 2px solid ${tokens.colors.primary};
      border-radius: ${tokens.borderRadius.md};
      font-weight: 600;
      cursor: pointer;
      transition: ${tokens.transitions.normal};
    `,
    'button-ghost': `
      padding: ${tokens.spacing.sm} ${tokens.spacing.lg};
      background: transparent;
      color: ${tokens.colors.primary};
      border: none;
      border-radius: ${tokens.borderRadius.md};
      font-weight: 600;
      cursor: pointer;
      transition: ${tokens.transitions.normal};
    `,
    'button-danger': `
      padding: ${tokens.spacing.sm} ${tokens.spacing.lg};
      background: ${tokens.colors.error};
      color: white;
      border: none;
      border-radius: ${tokens.borderRadius.md};
      font-weight: 600;
      cursor: pointer;
      transition: ${tokens.transitions.normal};
    `,

    // Input presets
    'input-field': `
      padding: ${tokens.spacing.sm} ${tokens.spacing.md};
      border: 1px solid ${tokens.colors.outline};
      border-radius: ${tokens.borderRadius.md};
      font-size: 16px;
      font-family: inherit;
      transition: ${tokens.transitions.normal};
    `,
    'input-field-lg': `
      padding: ${tokens.spacing.md} ${tokens.spacing.lg};
      border: 1px solid ${tokens.colors.outline};
      border-radius: ${tokens.borderRadius.md};
      font-size: 16px;
      font-family: inherit;
      transition: ${tokens.transitions.normal};
    `,

    // Form presets
    form: `
      display: flex;
      flex-direction: column;
      gap: ${tokens.spacing.lg};
    `,
    'form-group': `
      display: flex;
      flex-direction: column;
      gap: ${tokens.spacing.sm};
    `,

    // Modal presets
    modal: `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${tokens.colors.surface};
      border-radius: ${tokens.borderRadius.lg};
      box-shadow: ${tokens.shadows.xl};
      padding: ${tokens.spacing.xl};
      max-width: 500px;
      width: 90%;
      z-index: 1000;
    `,
    'modal-backdrop': `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
    `,

    // Alert presets
    'alert-info': `
      padding: ${tokens.spacing.md} ${tokens.spacing.lg};
      background: ${tokens.colors.infoLight};
      color: ${tokens.colors.info};
      border-left: 4px solid ${tokens.colors.info};
      border-radius: ${tokens.borderRadius.md};
    `,
    'alert-success': `
      padding: ${tokens.spacing.md} ${tokens.spacing.lg};
      background: ${tokens.colors.successLight};
      color: ${tokens.colors.success};
      border-left: 4px solid ${tokens.colors.success};
      border-radius: ${tokens.borderRadius.md};
    `,
    'alert-warning': `
      padding: ${tokens.spacing.md} ${tokens.spacing.lg};
      background: ${tokens.colors.warningLight};
      color: ${tokens.colors.warning};
      border-left: 4px solid ${tokens.colors.warning};
      border-radius: ${tokens.borderRadius.md};
    `,
    'alert-error': `
      padding: ${tokens.spacing.md} ${tokens.spacing.lg};
      background: ${tokens.colors.errorLight};
      color: ${tokens.colors.error};
      border-left: 4px solid ${tokens.colors.error};
      border-radius: ${tokens.borderRadius.md};
    `,

    // Badge presets
    badge: `
      display: inline-block;
      padding: 2px ${tokens.spacing.sm};
      background: ${tokens.colors.primary};
      color: white;
      border-radius: ${tokens.borderRadius.full};
      font-size: 12px;
      font-weight: 600;
    `,
    'badge-secondary': `
      display: inline-block;
      padding: 2px ${tokens.spacing.sm};
      background: ${tokens.colors.secondary};
      color: white;
      border-radius: ${tokens.borderRadius.full};
      font-size: 12px;
      font-weight: 600;
    `,

    // Flexbox utilities
    'flex-center': `
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    'flex-between': `
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
    'flex-column': `
      display: flex;
      flex-direction: column;
    `,

    // Grid utilities
    'grid-2': `
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: ${tokens.spacing.lg};
    `,
    'grid-3': `
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: ${tokens.spacing.lg};
    `,
    'grid-4': `
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: ${tokens.spacing.lg};
    `,

    // Text utilities
    'text-center': `text-align: center;`,
    'text-right': `text-align: right;`,
    'text-bold': `font-weight: 700;`,
    'text-muted': `color: ${tokens.colors.textSecondary};`,

    // Spacing utilities
    'p-sm': `padding: ${tokens.spacing.sm};`,
    'p-md': `padding: ${tokens.spacing.md};`,
    'p-lg': `padding: ${tokens.spacing.lg};`,
    'p-xl': `padding: ${tokens.spacing.xl};`,
    'm-sm': `margin: ${tokens.spacing.sm};`,
    'm-md': `margin: ${tokens.spacing.md};`,
    'm-lg': `margin: ${tokens.spacing.lg};`,
    'm-xl': `margin: ${tokens.spacing.xl};`,

    // Shadow utilities
    'shadow-sm': `box-shadow: ${tokens.shadows.sm};`,
    'shadow-md': `box-shadow: ${tokens.shadows.md};`,
    'shadow-lg': `box-shadow: ${tokens.shadows.lg};`,
    'shadow-xl': `box-shadow: ${tokens.shadows.xl};`,

    // Border radius utilities
    'rounded-sm': `border-radius: ${tokens.borderRadius.sm};`,
    'rounded-md': `border-radius: ${tokens.borderRadius.md};`,
    'rounded-lg': `border-radius: ${tokens.borderRadius.lg};`,
    'rounded-full': `border-radius: ${tokens.borderRadius.full};`,
  };
}

export function getPreset(name: string, tokens: DesignTokens = defaultTokens): string | undefined {
  const presets = generatePresets(tokens);
  return presets[name];
}

export function isPreset(name: string, tokens: DesignTokens = defaultTokens): boolean {
  return name in generatePresets(tokens);
}

export function combinePresets(names: string[], tokens: DesignTokens = defaultTokens): string {
  const presets = generatePresets(tokens);
  return names
    .map((name) => presets[name])
    .filter((css) => css !== undefined)
    .join('\n');
}

export const designPresets = generatePresets();

export default designPresets;
