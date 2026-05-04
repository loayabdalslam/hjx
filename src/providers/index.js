/**
 * Hjx AI Provider Router
 * Supports: Ollama (local), Claude (Anthropic), GPT (OpenAI), Gemini (Google)
 */

import fetch from 'node-fetch';

// ─── Base Provider ────────────────────────────────────────────────────────────

class BaseProvider {
  constructor(config) {
    this.config = config;
  }
  async complete(_prompt) {
    throw new Error('Not implemented');
  }
  get name() {
    return 'base';
  }
}

// ─── Ollama (local) ───────────────────────────────────────────────────────────

class OllamaProvider extends BaseProvider {
  get name() { return 'ollama'; }

  async complete(prompt) {
    const url = this.config.ollamaUrl || 'http://localhost:11434';
    const model = this.config.ollamaModel || this.config.model || 'codellama';

    const res = await fetch(`${url}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: { temperature: 0.2 },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Ollama error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.response?.trim() || '';
  }
}

// ─── Anthropic Claude ─────────────────────────────────────────────────────────

class ClaudeProvider extends BaseProvider {
  get name() { return 'claude'; }

  async complete(prompt) {
    const apiKey = this.config.apiKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-haiku-20240307',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Claude error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.content?.[0]?.text?.trim() || '';
  }
}

// ─── OpenAI GPT ───────────────────────────────────────────────────────────────

class GPTProvider extends BaseProvider {
  get name() { return 'gpt'; }

  async complete(prompt) {
    const apiKey = this.config.apiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY not set');

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-4o-mini',
        temperature: 0.2,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  }
}

// ─── Google Gemini ────────────────────────────────────────────────────────────

class GeminiProvider extends BaseProvider {
  get name() { return 'gemini'; }

  async complete(prompt) {
    const apiKey = this.config.apiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');

    const model = this.config.model || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────

const PROVIDERS = {
  ollama: OllamaProvider,
  claude: ClaudeProvider,
  gpt: GPTProvider,
  openai: GPTProvider,
  gemini: GeminiProvider,
};

export function createProvider(config = {}) {
  const providerName = (config.provider || 'ollama').toLowerCase();
  const ProviderClass = PROVIDERS[providerName];

  if (!ProviderClass) {
    throw new Error(
      `Unknown provider: "${providerName}"\n` +
      `Available: ${Object.keys(PROVIDERS).join(', ')}`
    );
  }

  return new ProviderClass(config);
}

export { PROVIDERS };
