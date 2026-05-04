# Intent — (Intent Coding) 🧠

> **Unified AI-Powered Programming Language**
> Write your intent in plain English (or Arabic), and Intent converts it to real, runnable code in any language.

---

## What is Intent Coding?

**Intent Coding** is the first implementation of *True Intent Control*. While "Vibe Coding" relies on luck and imprecise prompting, Intent Coding uses a structured runtime to translate your exact mental model into executable, verifiable code. 

**Intent** (formerly Hjx) is the engine for this movement. It is a **runtime for AI-generated code**. Instead of writing code, you describe your **Intent**. The system feeds this to high-performance models (like `gemma2:27b` or `gemma4`) and executes the results within a controlled environment.

```
# hello.hjx
@target python

print hello world to the terminal
print the current date and time
```

---

## Usage

### 1. CLI Usage
```bash
hjx run hello.hjx
```

### 2. Programmatic API (Library)
You can now use `hjx` directly in your Node.js/Next.js/Vite projects:

```javascript
import { runHjx } from 'hjx';

const { output } = await runHjx("x = 10; y = 20; return x + y");
console.log(output); // 30
```

---

### 3. Production Caching (Run Once, Deploy Everywhere)
Intent is designed for production. It uses a smart caching layer to ensure you only call the AI provider during development.

```javascript
// During Build / Dev
const { output, cached } = await runHjx(source, { cache: true });
// Subsequent runs will use .intent-cache/ folder
```

---

## Production-Ready Examples

We have provided several full-scale project architectures in the `examples/` directory:

1.  **[Next.js Dynamic Logic Server](./examples/nextjs-hjx-server)**: Featuring a `prebuild.js` script to warm up the AI cache before deployment.
2.  **[Vite + React Integration](./examples/vite-intent-app)**: Demonstrates a Vite Plugin that treats `.hjx` files as standard JS modules.
3.  **[AI Knowledge Base](./examples/ai-knowledge-base)**: Automated SEO and metadata optimization at build time.
4.  **[Dynamic Pricing Engine](./examples/dynamic-pricing-engine)**: Complex regional business rules defined in natural language.
5.  **[Smart Form Validator](./examples/smart-form-validator)**: Sophisticated validation logic used in React forms.

## Production Architecture: The "Intent-to-Static" Workflow

To make Intent production-ready, we follow a simple principle: **AI generates in Dev, Static runs in Prod.**

1.  **Development**: You write `.hjx` files. The Intent Runtime calls your AI provider (e.g., `gemma4:31b-cloud`) and generates high-quality code.
2.  **Caching**: The generated code and outputs are stored in `.intent-cache/`.
3.  **Build Time**: During `next build` or `vite build`, the caching layer ensures all logic is frozen. No AI calls happen during the build or in the final production bundle.
4.  **Runtime**: Your application imports the cached logic. It runs at native speed (JS/Python) with zero latency and zero AI costs.

---

## Installation

### Requirements
- Node.js >= 18
- At least one AI provider (see below)

### Install

```bash
git clone https://github.com/you/hjx
cd hjx
npm install
npm link        # makes `hjx` available globally
```

---

## AI Providers

Hjx supports multiple AI providers. Configure via `.hjxrc` or CLI flags.

| Provider | Flag | Requires |
|----------|------|---------|
| **Ollama** (default, local) | `--provider ollama` | Ollama running locally |
| **Claude** (Anthropic) | `--provider claude` | `ANTHROPIC_API_KEY` |
| **GPT** (OpenAI) | `--provider gpt` | `OPENAI_API_KEY` |
| **Gemini** (Google) | `--provider gemini` | `GEMINI_API_KEY` |

### Setup Ollama (recommended, 100% offline)

```bash
# Install Ollama from https://ollama.ai
ollama pull codellama   # or mistral, deepseek-coder, etc.
```

### Setup Claude / GPT / Gemini

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...
export GEMINI_API_KEY=AIza...
```

---

## Hjx File Format (`.hjx`)

```hjx
## This is a comment

@target python           # required: target language
@description My program  # optional: short description

# Single-line intent:
create a function that sorts a list of numbers

# Multi-line intent block:
do {
  read a CSV file called data.csv
  calculate the average of the second column
  print the result formatted with 2 decimal places
}
```

### Supported target languages

`python` · `javascript` · `typescript` · `rust` · `go` · `java` · `kotlin` · `cpp` · `c` · `sql`

---

## CLI Commands

### `hjx run <file.hjx>`

Translate and immediately execute the file.

```bash
hjx run hello.hjx
hjx run script.hjx --provider claude --target javascript
hjx run script.hjx --explain    # also show AI explanation
hjx run script.hjx --no-run     # generate only, don't execute
```

### `hjx compile <file.hjx>`

Translate only — show generated code without running it.

```bash
hjx compile script.hjx
hjx compile script.hjx -t go   # override target language
```

### `hjx repl`

Interactive mode — type intent, get code, run it, repeat.

```bash
hjx repl
hjx repl --provider gpt --target javascript
```

REPL commands:

| Command | Action |
|---------|--------|
| `:help` | Show commands |
| `:target <lang>` | Change target language |
| `:history` | Show last 10 entries |
| `:clear` | Clear screen |
| `:exit` | Quit |

### `hjx explain <file.hjx>`

Generate code and provide a plain-English explanation.

```bash
hjx explain script.hjx
```

### `hjx history`

Show translation history.

```bash
hjx history          # last 20 entries
hjx history -n 50    # last 50 entries
hjx history clear    # clear all history
```

---

## Configuration

Create a `.hjxrc` file in your project or home directory:

```json
{
  "provider": "ollama",
  "ollamaUrl": "http://localhost:11434",
  "ollamaModel": "codellama",
  "target": "python",
  "run": true,
  "explain": false,
  "timeout": 30000
}
```

Copy the example: `cp .hjxrc.example .hjxrc`

### Environment variables

| Variable | Description |
|----------|-------------|
| `HJX_PROVIDER` | Default provider |
| `HJX_TARGET` | Default target language |
| `HJX_OLLAMA_URL` | Ollama server URL |
| `HJX_OLLAMA_MODEL` | Ollama model name |
| `HJX_MODEL` | Model override (any provider) |
| `ANTHROPIC_API_KEY` | Claude API key |
| `OPENAI_API_KEY` | OpenAI API key |
| `GEMINI_API_KEY` | Gemini API key |

---

## Examples

### Example 1 — Hello World

```hjx
@target python
print hello world with a timestamp
```

```bash
hjx run examples/hello.hjx
```

### Example 2 — Fibonacci (JavaScript)

```hjx
@target javascript
create a recursive fibonacci function
print fibonacci numbers from 0 to 15
```

### Example 3 — Data Processing

```hjx
@target python
@description Student score analyzer

do {
  create a list of 10 random student scores between 50 and 100
  calculate average, highest, and lowest score
  print a summary report
  classify each student as pass or fail
}
```

---

## History

Hjx saves every translation to `~/.hjx/history.json`. You can inspect it directly or use `hjx history`.

---

## Architecture

```
.hjx file → Parser → AI Router → Code Generator → Executor → Output
                        ↓
               Ollama / Claude / GPT / Gemini
```

---

---

## Real-World Projects & Integrations

- **[Next.js Dynamic Logic](./examples/nextjs-hjx-server)**: Using HJX as a backend logic layer for React apps.

## License

MIT
