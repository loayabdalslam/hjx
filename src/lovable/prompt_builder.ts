import { providerConfigs, defaultProvider } from './config/providers';

export interface GenerationOptions {
  prompt: string;
  provider?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export const HJX_SYSTEM_PROMPT = `You are an expert HJX developer. Generate clean, complete HJX code.

HJX Syntax:
- component <Name>
- state: (reactive variables: number, string, boolean, arrays, objects)
- layout: (UI tree with view, text, button, input, if, for)
- style: (scoped CSS)
- handlers: (event handlers with set and log statements)

Example:
component Counter
state:
  count = 0

layout:
  view.container:
    text: "{{count}}"
    button (on click -> inc): "Increment"

style:
  .container { text-align: center; padding: 20px; }

handlers:
  inc:
    set count = count + 1

Generate the complete HJX file for the user's request. Include all necessary state, layout, styling, and handlers.`;

export const QUALITY_SYSTEM_PROMPT = `You are an expert HJX developer. Generate production-ready HJX code.

Requirements:
- UX best practices
- Responsive design
- Accessibility
- Error handling
- Loading states
- Edge cases

HJX Syntax:
- component <Name>
- state: (reactive variables)
- layout: (UI tree)
- style: (CSS)
- handlers: (event handlers)

Generate a complete, production-ready HJX application.`;

export function buildGenerationPrompt(userPrompt: string, options: {
  quality?: boolean;
  context?: string;
} = {}): string {
  const systemPrompt = options.quality ? QUALITY_SYSTEM_PROMPT : HJX_SYSTEM_PROMPT;
  
  let fullPrompt = systemPrompt + '\n\n';
  
  if (options.context) {
    fullPrompt += `Context:\n${options.context}\n\n`;
  }
  
  fullPrompt += `User Request:\n${userPrompt}`;
  
  return fullPrompt;
}

export function buildQuickPrompt(userPrompt: string): string {
  return `Generate HJX code for: ${userPrompt}

Use this minimal format:
component <Name>
state:
  [variables]

layout:
  [UI tree]

style:
  [CSS]

handlers:
  [handlers]`;
}

export const EXAMPLE_PROMPTS = {
  todo: 'Create a todo app with categories and dark mode toggle',
  counter: 'A simple counter with increment/decrement buttons',
  chat: 'AI chat interface with message history',
  form: 'Contact form with validation',
  dashboard: 'Dashboard with charts and data tables',
  blog: 'Blog post reader with comments',
  ecommerce: 'Product listing with add to cart',
};
