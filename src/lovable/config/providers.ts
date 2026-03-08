export interface ProviderConfig {
  provider: 'groq' | 'openrouter' | 'ollama';
  model: string;
  maxTokens: number;
  temperature: number;
  apiKey?: string;
  baseURL?: string;
}

export const providerConfigs: Record<string, ProviderConfig> = {
  groq: {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    maxTokens: 4096,
    temperature: 0.3,
  },
  groqFast: {
    provider: 'groq',
    model: 'llama-3.1-8b-instant',
    maxTokens: 2048,
    temperature: 0.3,
  },
  openrouter: {
    provider: 'openrouter',
    model: 'anthropic/claude-3.5-sonnet',
    maxTokens: 8192,
    temperature: 0.3,
  },
  openrouterFast: {
    provider: 'openrouter',
    model: 'google/gemini-flash-1.5',
    maxTokens: 4096,
    temperature: 0.3,
  },
  ollama: {
    provider: 'ollama',
    model: 'llama3.3:70b',
    maxTokens: 4096,
    temperature: 0.3,
    baseURL: process.env.OLLAMA_HOST || 'http://localhost:11434',
  },
  ollamaSmall: {
    provider: 'ollama',
    model: 'llama3.2:3b',
    maxTokens: 2048,
    temperature: 0.3,
    baseURL: process.env.OLLAMA_HOST || 'http://localhost:11434',
  },
};

export const defaultProvider = process.env.PROVIDER || 'groq';

export const providerPriority = [
  'groq',
  'ollama',
  'openrouter',
];

export const speedRanking = [
  { provider: 'groq', model: 'llama-3.3-70b-versatile', speed: '~150 tok/s' },
  { provider: 'groq', model: 'llama-3.1-8b-instant', speed: '~200 tok/s' },
  { provider: 'ollama', model: 'llama3.2:3b', speed: '~80 tok/s' },
  { provider: 'ollama', model: 'llama3.3:70b', speed: '~60 tok/s' },
  { provider: 'openrouter', model: 'google/gemini-flash-1.5', speed: '~50 tok/s' },
  { provider: 'openrouter', model: 'anthropic/claude-3.5-sonnet', speed: '~40 tok/s' },
];
