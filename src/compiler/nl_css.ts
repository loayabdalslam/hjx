/**
 * Natural Language CSS to CSS converter.
 * Translates human-readable style descriptions to proper CSS.
 */

import { HJXStyleRule, HJXBreakpoint } from "../types.js";
import { scopeCss } from "./vanilla_scope_css.js";
import { defaultTokens, getTheme, mergeTokens, generatePresets, getToken } from "../design-system/index.js";

// Property name mapping: natural language -> CSS property
const PROPERTY_MAP: Record<string, string> = {
  "padding": "padding",
  "margin": "margin",
  "margin top": "margin-top",
  "margin bottom": "margin-bottom",
  "margin left": "margin-left",
  "margin right": "margin-right",
  "border": "border",
  "border radius": "border-radius",
  "border top": "border-top",
  "border bottom": "border-bottom",
  "border left": "border-left",
  "border right": "border-right",
  "background": "background",
  "color": "color",
  "font size": "font-size",
  "font weight": "font-weight",
  "font family": "font-family",
  "font style": "font-style",
  "text align": "text-align",
  "text decoration": "text-decoration",
  "text transform": "text-transform",
  "line height": "line-height",
  "letter spacing": "letter-spacing",
  "word spacing": "word-spacing",
  "width": "width",
  "max width": "max-width",
  "min width": "min-width",
  "height": "height",
  "max height": "max-height",
  "min height": "min-height",
  "display": "display",
  "position": "position",
  "top": "top",
  "left": "left",
  "right": "right",
  "bottom": "bottom",
  "z index": "z-index",
  "opacity": "opacity",
  "overflow": "overflow",
  "overflow x": "overflow-x",
  "overflow y": "overflow-y",
  "cursor": "cursor",
  "transition": "transition",
  "transform": "transform",
  "animation": "animation",
  "box shadow": "box-shadow",
  "text shadow": "text-shadow",
  "outline": "outline",
  "outline offset": "outline-offset",
  "object fit": "object-fit",
  "aspect ratio": "aspect-ratio",
  "flex direction": "flex-direction",
  "flex wrap": "flex-wrap",
  "flex grow": "flex-grow",
  "flex shrink": "flex-shrink",
  "flex basis": "flex-basis",
  "justify content": "justify-content",
  "align items": "align-items",
  "align content": "align-content",
  "align self": "align-self",
  "gap": "gap",
  "row gap": "row-gap",
  "column gap": "column-gap",
  "grid template columns": "grid-template-columns",
  "grid template rows": "grid-template-rows",
  "grid column": "grid-column",
  "grid row": "grid-row",
  "grid gap": "grid-gap",
  "place items": "place-items",
  "place content": "place-content",
};

// Keyword value mapping: natural keyword -> CSS value
const VALUE_MAP: Record<string, string> = {
  // Display
  "flex": "flex",
  "grid": "grid",
  "block": "block",
  "inline block": "inline-block",
  "inline": "inline",
  "none": "none",

  // Position
  "relative": "relative",
  "absolute": "absolute",
  "fixed": "fixed",
  "sticky": "sticky",
  "static": "static",

  // Flex
  "row": "row",
  "column": "column",
  "wrap": "wrap",
  "nowrap": "nowrap",
  "center": "center",
  "space between": "space-between",
  "space around": "space-around",
  "space evenly": "space-evenly",
  "stretch": "stretch",
  "baseline": "baseline",
  "flex start": "flex-start",
  "flex end": "flex-end",

  // Font weight
  "normal": "normal",
  "bold": "bold",
  "lighter": "lighter",

  // Text
  "left": "left",
  "right": "right",
  "underline": "underline",
  "line through": "line-through",
  "uppercase": "uppercase",
  "lowercase": "lowercase",
  "capitalize": "capitalize",

  // Border
  "solid": "solid",
  "dashed": "dashed",
  "dotted": "dotted",
  "double": "double",
  "groove": "groove",
  "ridge": "ridge",

  // Cursor
  "pointer": "pointer",
  "default": "default",
  "text": "text",
  "move": "move",
  "not allowed": "not-allowed",

  // Overflow
  "hidden": "hidden",
  "visible": "visible",
  "scroll": "scroll",
  "auto": "auto",

  // Object fit
  "cover": "cover",
  "contain": "contain",
  "fill": "fill",

  // Font family
  "sans serif": "sans-serif",
  "serif": "serif",
  "monospace": "monospace",

  // Box shadow presets
  "light": "0 2px 8px rgba(0,0,0,0.1)",
  "medium": "0 4px 12px rgba(0,0,0,0.15)",
  "heavy": "0 8px 24px rgba(0,0,0,0.2)",
};

// Shortcuts/presets that expand to multiple properties
const SHORTCUTS: Record<string, string[]> = {
  "card": ["padding: 16px", "background: white", "border-radius: 12px", "box-shadow: 0 2px 8px rgba(0,0,0,0.1)"],
  "button primary": ["padding: 10px 16px", "background: #007bff", "color: white", "border: none", "border-radius: 8px", "cursor: pointer", "font-weight: 600"],
  "button secondary": ["padding: 10px 16px", "background: white", "color: #333", "border: 1px solid #ddd", "border-radius: 8px", "cursor: pointer"],
  "button ghost": ["padding: 10px 16px", "background: transparent", "color: #007bff", "border: none", "cursor: pointer"],
  "input field": ["padding: 10px 14px", "border: 1px solid #ddd", "border-radius: 8px", "font-size: 14px", "width: 100%"],
  "container": ["max-width: 1200px", "margin: 0 auto", "padding: 0 20px"],
  "center": ["display: flex", "justify-content: center", "align-items: center"],
  "flex col": ["display: flex", "flex-direction: column"],
  "flex row": ["display: flex", "flex-direction: row"],
  "flex wrap": ["display: flex", "flex-wrap: wrap"],
  "grid 2": ["display: grid", "grid-template-columns: repeat(2, 1fr)", "gap: 16px"],
  "grid 3": ["display: grid", "grid-template-columns: repeat(3, 1fr)", "gap: 16px"],
  "grid 4": ["display: grid", "grid-template-columns: repeat(4, 1fr)", "gap: 16px"],
  "full width": ["width: 100%"],
  "full height": ["height: 100vh"],
  "rounded": ["border-radius: 9999px"],
  "rounded full": ["border-radius: 50%"],
  "no border": ["border: none"],
  "border none": ["border: none"],
  "text center": ["text-align: center"],
  "text left": ["text-align: left"],
  "text right": ["text-align: right"],
};

// Default breakpoints
const DEFAULT_BREAKPOINTS: Record<string, string> = {
  "@mobile": "max-width: 480px",
  "@tablet": "max-width: 768px",
  "@desktop": "min-width: 1024px",
};

/**
 * Parse a natural language property line and return CSS declaration.
 * Returns null if it's a shortcut (handled separately).
 */
function parsePropertyLine(line: string, presets: Record<string, string>): string | null {
  const trimmed = line.trim();
  if (!trimmed) return "";

  // Check presets from design system
  if (presets[trimmed.toLowerCase()]) {
    return presets[trimmed.toLowerCase()].trim();
  }

  // Check shortcuts (legacy)
  for (const [shortcut, expansions] of Object.entries(SHORTCUTS)) {
    if (trimmed.toLowerCase() === shortcut) {
      return expansions.join(";\n  ");
    }
  }

  // Find matching CSS property
  let matchedProperty: string | null = null;
  let matchedValue = "";

  // Sort properties by length (longest first) to match multi-word properties first
  const sortedProps = Object.entries(PROPERTY_MAP).sort((a, b) => b[0].length - a[0].length);

  for (const [nlProp, cssProp] of sortedProps) {
    if (trimmed.toLowerCase().startsWith(nlProp)) {
      matchedProperty = cssProp;
      const valuePart = trimmed.slice(nlProp.length).trim();
      matchedValue = translateValue(valuePart, presets);
      break;
    }
  }

  if (!matchedProperty) {
    // Unknown property, return as-is (might be raw CSS)
    return trimmed.includes(":") ? trimmed : null;
  }

  return `${matchedProperty}: ${matchedValue}`;
}

/**
 * Translate a natural language value to CSS value.
 */
function translateValue(value: string, presets: Record<string, string>): string {
  const trimmed = value.trim().toLowerCase();

  // Resolve design tokens (e.g. colors.primary)
  if (trimmed.includes('.')) {
    const tokenValue = getToken(trimmed);
    if (tokenValue) return tokenValue;
  }

  // Check value map
  if (VALUE_MAP[trimmed]) {
    return VALUE_MAP[trimmed];
  }

  // Special handling for "repeat X Y" pattern
  const repeatMatch = trimmed.match(/^repeat\s+(\d+)\s+(.+)$/);
  if (repeatMatch) {
    return `repeat(${repeatMatch[1]}, ${repeatMatch[2]})`;
  }

  // Special handling for "linear gradient" pattern
  if (trimmed.startsWith("linear gradient")) {
    const gradientPart = trimmed.slice("linear gradient".length).trim();
    return `linear-gradient(${gradientPart.replace(/\s*,\s*/g, ", ")})`;
  }

  // Return as-is if it looks like a CSS value (number, color, etc.)
  return value;
}

/**
 * Convert HJX natural language style rules to CSS string.
 */
export function nlCssToCss(
  rules: HJXStyleRule[],
  rawCss: string,
  scope: string,
  breakpoints: HJXBreakpoint[] = [],
  designSystem?: { theme?: 'light' | 'dark', tokens?: Record<string, any> }
): string {
  const cssParts: string[] = [];

  // Setup design system
  const theme = getTheme(designSystem?.theme || 'light');
  const tokens = designSystem?.tokens ? mergeTokens(theme, designSystem.tokens) : theme;
  const presets = generatePresets(tokens);

  // Add raw CSS as-is
  if (rawCss) {
    cssParts.push(scopeCss(rawCss, scope));
  }

  // Build custom breakpoints map
  const bpMap: Record<string, string> = { ...DEFAULT_BREAKPOINTS };
  for (const bp of breakpoints) {
    bpMap[`@${bp.name}`] = `max-width: ${bp.value}`;
  }

  // Process each rule
  for (const rule of rules) {
    const properties: string[] = [];
    for (const propLine of rule.properties) {
      if (!propLine) continue;
      const cssDecl = parsePropertyLine(propLine, presets);
      if (cssDecl !== null) {
        properties.push(cssDecl);
      }
    }

    if (properties.length === 0) continue;

    // Build selector
    let selector = `${rule.selector}`;
    if (rule.pseudo) {
      selector += rule.pseudo;
    }

    // Scope the selector
    selector = `[data-hjx-scope="${scope}"] ${selector}`;

    if (rule.media) {
      // Wrap in media query
      const mediaQuery = bpMap[rule.media] || `max-width: 768px`;
      cssParts.push(`@media (${mediaQuery}) {\n  ${selector} {\n    ${properties.join(";\n    ")};\n  }\n}`);
    } else {
      cssParts.push(`${selector} {\n  ${properties.join(";\n  ")};\n}`);
    }
  }

  return cssParts.join("\n\n");
}
