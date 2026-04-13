/**
 * Grammar Loader
 * Loads and parses user-defined grammar.yml files.
 * Merges custom rules with built-in grammar.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// ============================================================
// Grammar Rule Types
// ============================================================

export interface GrammarRule {
  name: string;
  patterns: string[];
  template: string;
}

export interface GrammarSection {
  description: string;
  rules: GrammarRule[];
}

export interface GrammarConfig {
  component_creation: GrammarSection;
  state_rules: GrammarSection;
  layout_rules: GrammarSection;
  style_rules: GrammarSection;
  handler_rules: GrammarSection;
  api_rules: GrammarSection;
  conditional_rules: GrammarSection;
  loop_rules: GrammarSection;
  custom_rules: GrammarSection;
}

// ============================================================
// Simple YAML Parser (no external dependency)
// ============================================================

export function loadGrammar(configPath?: string): GrammarConfig {
  const path = configPath || resolve(process.cwd(), "grammar.yml");

  if (!existsSync(path)) {
    return getBuiltInGrammar();
  }

  const content = readFileSync(path, "utf-8");
  return parseGrammarYaml(content);
}

function parseGrammarYaml(content: string): GrammarConfig {
  // Simple line-based YAML parser for HJX grammar format
  const lines = content.split("\n");
  const config: any = {};
  let currentSection: string | null = null;
  let currentRule: any = null;
  let currentArray: string | null = null;
  let inTemplate = false;
  let templateLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Detect section-level key (no leading whitespace, ends with colon)
    if (line.match(/^[a-z_]+:\s*$/)) {
      const key = trimmed.slice(0, -1);
      currentSection = key;
      config[key] = {};
      currentRule = null;
      currentArray = null;
      inTemplate = false;
      continue;
    }

    // Detect description
    if (trimmed.startsWith("description:")) {
      if (currentSection && !currentRule) {
        config[currentSection].description = trimmed.slice("description:".length).trim().replace(/^["']|["']$/g, "");
      }
      continue;
    }

    // Detect rules array
    if (trimmed === "rules:") {
      if (currentSection) {
        config[currentSection].rules = [];
        currentArray = "rules";
      }
      continue;
    }

    // Detect rule start (- name: "...")
    const ruleNameMatch = trimmed.match(/- name:\s*(.+)$/);
    if (ruleNameMatch && currentArray && currentSection) {
      const name = ruleNameMatch[1].trim().replace(/^["']|["']$/g, "");
      currentRule = { name, patterns: [], template: "" };
      if (!config[currentSection].rules) config[currentSection].rules = [];
      config[currentSection].rules.push(currentRule);
      inTemplate = false;
      templateLines = [];
      continue;
    }

    // Detect patterns array
    if (trimmed === "patterns:") {
      if (currentRule) {
        currentRule.patterns = [];
      }
      continue;
    }

    // Detect template
    if (trimmed.startsWith("template:")) {
      if (currentRule) {
        const inlineTemplate = trimmed.slice("template:".length).trim();
        if (inlineTemplate && inlineTemplate !== "|") {
          currentRule.template = inlineTemplate.replace(/^["']|["']$/g, "");
          inTemplate = false;
        } else {
          inTemplate = true;
          templateLines = [];
        }
      }
      continue;
    }

    // Parse pattern list item
    if (trimmed.startsWith("- ") && currentRule && !inTemplate) {
      currentRule.patterns.push(trimmed.slice(2).replace(/^["']|["']$/g, ""));
      continue;
    }

    // Parse template block content
    if (inTemplate && currentRule) {
      if (line.startsWith("    ") || line.startsWith("\t")) {
        templateLines.push(line.replace(/^    |\t/g, ""));
      } else {
        currentRule.template = templateLines.join("\n").trim();
        inTemplate = false;
      }
      continue;
    }
  }

  // Finalize any open template
  if (inTemplate && currentRule && templateLines.length > 0) {
    currentRule.template = templateLines.join("\n").trim();
  }

  return config as GrammarConfig;
}

// ============================================================
// Built-in Grammar (Default)
// ============================================================

function getBuiltInGrammar(): GrammarConfig {
  // Return empty config (rules are defined in flow_engine.ts)
  return {
    component_creation: { description: "Built-in component creation rules", rules: [] },
    state_rules: { description: "Built-in state rules", rules: [] },
    layout_rules: { description: "Built-in layout rules", rules: [] },
    style_rules: { description: "Built-in style rules", rules: [] },
    handler_rules: { description: "Built-in handler rules", rules: [] },
    api_rules: { description: "Built-in API rules", rules: [] },
    conditional_rules: { description: "Built-in conditional rules", rules: [] },
    loop_rules: { description: "Built-in loop rules", rules: [] },
    custom_rules: { description: "User custom rules", rules: [] },
  };
}

// ============================================================
// Grammar Rule Application
// Converts grammar rules to flow patterns
// ============================================================

export interface AppliedRule {
  regex: RegExp;
  template: string;
  name: string;
}

export function applyGrammar(config: GrammarConfig): AppliedRule[] {
  const rules: AppliedRule[] = [];

  for (const section of Object.values(config)) {
    if (!section.rules) continue;

    for (const rule of section.rules) {
      for (const pattern of rule.patterns) {
        // Convert grammar pattern to regex
        // Replace {{N}} with capture groups
        // Replace {{N|filter}} with capture groups (filter applied later)
        let regexStr = pattern
          // Escape regex special chars
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          // Convert {{N}} or {{N|filters}} to capture groups
          .replace(/\{\{(\d+)(?:\|[^\}]+)?\}\}/g, "([^\\s]+)")
          // Handle quoted strings
          .replace(/["']/g, '["\']?');

        try {
          const regex = new RegExp(regexStr, "i");
          rules.push({
            regex,
            template: rule.template,
            name: rule.name,
          });
        } catch (e) {
          console.warn(`Invalid grammar pattern: ${pattern}`);
        }
      }
    }
  }

  return rules;
}

// ============================================================
// Template Processing
// Applies filters to capture groups
// ============================================================

export function processTemplate(template: string, match: RegExpMatchArray): string {
  let result = template;

  // Replace {{N}} and {{N|filters}}
  result = result.replace(/\{\{(\d+)(?:\|([^\}]+))?\}\}/g, (_, num, filters) => {
    const value = match[parseInt(num)] || "";
    if (!filters) return value;

    // Apply filters
    return applyFilters(value, filters.split("|"));
  });

  return result;
}

function applyFilters(value: string, filters: string[]): string {
  for (const filter of filters) {
    switch (filter.trim()) {
      case "capitalize":
        value = value.charAt(0).toUpperCase() + value.slice(1);
        break;
      case "lowercase":
        value = value.toLowerCase();
        break;
      case "uppercase":
        value = value.toUpperCase();
        break;
      case "nospace":
        value = value.replace(/\s+/g, "");
        break;
      case "camelcase":
        value = value.replace(/[\s_-]+(.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (_, c) => c.toLowerCase());
        break;
      case "kebabcase":
        value = value.replace(/\s+/g, "-").replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-+|-+$/g, "");
        break;
      case "snakecase":
        value = value.replace(/\s+/g, "_").replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_+|_+$/g, "");
        break;
      case "trim":
        value = value.trim();
        break;
    }
  }
  return value;
}
