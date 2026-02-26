# HJX-Lovable: AI-Powered HJX Code Generator

## Project Overview

HJX-Lovable is an AI-powered web development platform that generates full-stack HJX applications. It combines the simplicity of HJX with the power of LLMs to create websites, web apps, and interactive UIs from natural language descriptions.

## Tech Stack

- **Language**: TypeScript + Node.js
- **AI Providers**: Groq, OpenRouter, Ollama (local)
- **Frontend**: HJX (self-hosted!)
- **Build**: TypeScript compiler
- **Package Manager**: npm

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HJX-Lovable                              │
├─────────────────────────────────────────────────────────────┤
│  User Input (Natural Language)                             │
│         ↓                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  AI Orchestrator (Provider Selection & Fallback)    │   │
│  │  - Fastest: Groq (Llama-3.3-70B)                     │   │
│  │  - Multi-model: OpenRouter (200+ models)             │   │
│  │  - Local: Ollama (Llama, Qwen, DeepSeek)             │   │
│  └─────────────────────────────────────────────────────┘   │
│         ↓                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  HJX Code Generator                                  │   │
│  │  - Prompt engineering → HJX syntax                   │   │
│  │  - Component composition                             │   │
│  │  - Style generation                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│         ↓                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  HJX Compiler Pipeline                               │   │
│  │  1. Parse (HJX → AST)                                │   │
│  │  2. Compile (AST → HTML/CSS/JS)                      │   │
│  │  3. Bundle (Output generation)                       │   │
│  └─────────────────────────────────────────────────────┘   │
│         ↓                                                   │
│  Live Preview / Export                                      │
└─────────────────────────────────────────────────────────────┘
```

## Configuration

### AI Providers Setup

Create `.env` in project root:

```bash
# Groq (FASTEST - recommended for speed)
GROQ_API_KEY=your_groq_key

# OpenRouter (Best model selection)
OPENROUTER_API_KEY=your_openrouter_key

# Ollama (Local - free, private)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.3:70b
```

### Provider Priority (Speed)

| Priority | Provider | Model | Speed | Best For |
|----------|----------|-------|-------|----------|
| 1 | Groq | Llama-3.3-70B | ~150 tok/s | Real-time generation |
| 2 | Ollama (RTX 4090) | Llama-3.3-70b | ~60 tok/s | Free local dev |
| 3 | OpenRouter | Claude-3.5 | ~40 tok/s | Quality output |

### Model Selection

```typescript
// config/models.ts
export const models = {
  // Fastest - Groq
  groq: {
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    maxTokens: 4096,
  },
  
  // Best quality - OpenRouter
  openrouter: {
    provider: 'openrouter',
    model: 'anthropic/claude-3.5-sonnet',
    maxTokens: 8192,
  },
  
  // Local - Ollama
  ollama: {
    provider: 'ollama',
    model: 'llama3.3:70b',
    maxTokens: 4096,
  },
};
```

## Commands

```bash
# Install dependencies
npm install

# Build the core compiler
npm run build

# Start the Lovable clone server
npm run dev

# Generate code from prompt (CLI)
node dist/cli.js generate "Create a todo app with dark mode"

# Start with specific provider
PROVIDER=groq npm run dev
```

## Project Structure

```
src/
├── cli.ts                      # CLI entry point
├── lovable/
│   ├── index.ts               # Main orchestrator
│   ├── orchestrator.ts        # AI provider selection
│   ├── providers/
│   │   ├── groq.ts            # Groq provider
│   │   ├── openrouter.ts      # OpenRouter provider
│   │   └── ollama.ts          # Ollama provider
│   ├── prompt_builder.ts      # HJX prompt engineering
│   └── code_generator.ts      # Generation logic
├── compiler/                   # (from parent)
│   ├── vanilla.ts
│   ├── server_driven.ts
│   └── ...
└── parser.ts                   # (from parent)
```

## API Endpoints

### POST /api/generate

Generate HJX code from natural language:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a todo app with categories"}'
```

Response:
```json
{
  "hjx": "component TodoApp\n\nstate:\n  todos = []\n  newTodo = \"\"\n  ...\n",
  "html": "<!DOCTYPE html>...",
  "css": "...",
  "js": "..."
}
```

### POST /api/compile

Compile existing HJX to HTML/CSS/JS:

```bash
curl -X POST http://localhost:3000/api/compile \
  -H "Content-Type: application/json" \
  -d '{"hjx": "component Counter..."}'
```

### GET /api/preview/:id

Get preview of generated project.

## Generation Prompts

### System Prompt (Fast Generation)

```
You are an expert HJX developer. Generate clean, complete HJX code.

HJX Syntax:
- component <Name>
- state: (reactive variables)
- layout: (UI tree with view, text, button, input, if, for)
- style: (CSS)
- handlers: (event handlers)

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

Generate the complete HJX file for: {USER_PROMPT}
```

### Quality Prompt (Best Output)

```
Analyze the requirements thoroughly. Consider:
- UX best practices
- Responsive design
- Accessibility
- Error handling
- Edge cases

Generate a production-ready HJX application.
```

## Performance Optimization

### Caching Strategy

```typescript
// Cache frequent prompts
const promptCache = new Map<string, string>();

async function generateWithCache(prompt: string): Promise<string> {
  const hash = crypto.createHash('md5').update(prompt).digest('hex');
  
  if (promptCache.has(hash)) {
    return promptCache.get(hash)!;
  }
  
  const result = await generate(prompt);
  promptCache.set(hash, result);
  
  return result;
}
```

### Streaming Response

```typescript
// Stream tokens for faster perceived performance
app.post('/api/generate/stream', async (req, res) => {
  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });

  res.setHeader('Content-Type', 'text/event-stream');
  
  for await (const chunk of stream) {
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
  }
  
  res.end();
});
```

## Error Handling

```typescript
// Provider fallback chain
async function generateWithFallback(prompt: string): Promise<string> {
  const providers = ['groq', 'ollama', 'openrouter'];
  
  for (const provider of providers) {
    try {
      return await generateWithProvider(provider, prompt);
    } catch (error) {
      console.error(`${provider} failed:`, error);
      continue;
    }
  }
  
  throw new Error('All providers failed');
}
```

## Testing

```bash
# Run generation tests
npm test

# Test specific provider
PROVIDER=groq npm test

# Benchmark generation speed
npm run benchmark:generate
```

## Deployment

```bash
# Production build
npm run build

# Start production server
NODE_ENV=production npm start
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PROVIDER` | No | groq | AI provider to use |
| `GROQ_API_KEY` | For Groq | - | Groq API key |
| `OPENROUTER_API_KEY` | For OpenRouter | - | OpenRouter API key |
| `OLLAMA_HOST` | For Ollama | localhost:11434 | Ollama server |
| `PORT` | No | 3000 | Server port |
| `CACHE_ENABLED` | No | true | Enable prompt caching |

## Tips for Speed

1. **Use Groq** - It's the fastest for code generation
2. **Enable streaming** - Perceived speed improves
3. **Cache prompts** - Avoid regenerating similar code
4. **Use Ollama locally** - Zero latency after model loads
5. **Optimize prompts** - Shorter prompts = faster generation
