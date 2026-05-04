# Intent Coding (hjx): A Verifiable Runtime for Intent-to-Static Logic

Intent Coding (hjx) is a production-grade library designed to transition software development from non-deterministic AI prompting (Vibe Coding) to a verifiable, cached, and audited "Intent-to-Static" (I2S) architecture. It enables developers to define business logic in natural language while ensuring that the runtime executes static, high-performance code with zero AI latency and zero token costs in production environments.

---

## Technical Problem: The Limitations of Vibe Coding
Modern AI-driven development often suffers from:
1. **Non-Determinism**: AI models may produce different outputs for the same prompt, leading to unstable production logic.
2. **Latency**: Real-time AI inference is too slow for high-performance web applications.
3. **Cost**: Continuous API calls to LLM providers are prohibitively expensive at scale.
4. **Security**: Executing un-audited AI output directly in production poses significant security risks.

## The Solution: Intent-to-Static (I2S) Architecture
Intent Coding solves these challenges by introducing a caching and verification layer between the intent and the execution.

### Architectural Workflow
1. **Definition**: Developers write Intent Blocks in `.hjx` files.
2. **Translation**: The Intent Engine translates natural language into static target code (JavaScript, Python, etc.).
3. **Verification**: Generated code is stored in `.intent-cache` for developer audit and verification.
4. **Execution**: The production runtime executes the cached static code directly, bypassing the AI provider entirely.

---

## Core Components

### 1. Intent Parser
The parser processes `.hjx` files, extracting metadata directives and intent blocks.
- **Directives**: Configures the target language, AI provider, and model version.
- **Intent Blocks**: Encapsulates the natural language description of the logic.

### 2. Code Generation Engine
A specialized prompt-engineering layer that converts intents into clean, idiomatic code. It supports multiple languages including JavaScript, Python, Rust, and Go.

### 3. Persistent Caching Layer
Uses MD5 hashing to ensure that identical intents always resolve to the same static code. This layer is designed to be warmed up during the CI/CD build phase.

---

## Comprehensive Example Walkthroughs

### 1. Dynamic Pricing Engine
**Source: `examples/dynamic-pricing-engine/logic/pricing.hjx`**
```javascript
target: javascript
provider: ollama
model: gemma4:e4b

# Calculate price based on region and loyalty
# If region is EU, add 20% VAT.
# If loyalty > 2 years, apply 15% discount.
```
**Expected Output:**
```json
{
  "currency": "EUR",
  "subtotal": 100,
  "discount_applied": 15,
  "tax_applied": 20,
  "total": 102.00
}
```
**Technical Significance**: Demonstrates how complex, conditional business rules can be maintained in natural language while executing as high-speed JavaScript.

### 2. Intelligent Data Processing (Student Analysis)
**Source: `examples/students.hjx`**
```javascript
# Process student scores, calculate averages, and classify results.
```
**Expected Output:**
```json
{
  "average": 67.33,
  "stats": { "max": 90, "min": 42 },
  "detailed": [
    { "score": 85, "status": "Pass" },
    { "score": 42, "status": "Fail" }
  ]
}
```
**Technical Significance**: Proves the engine's ability to handle array manipulation and object construction without manual boilerplate.

### 3. Automated SEO Optimization
**Source: `examples/ai-knowledge-base/logic/optimize-article.hjx`**
```javascript
# Extract 5 keywords and generate a meta-description from raw text.
```
**Expected Output:**
```json
{
  "seo": {
    "title": "Intent Coding: The Production-Ready Alternative",
    "meta": "A technical deep-dive into the I2S architecture...",
    "keywords": ["Architecture", "Production", "Verification"]
  }
}
```
**Technical Significance**: Showcases the integration of natural language understanding into standard data pipelines.

---

## Framework Integration Guides

### Next.js Integration
Intent Coding is fully compatible with Next.js Server Components.
- **Prebuild Warming**: Run `node scripts/prebuild.js` in your CI/CD to generate the logic cache.
- **Zero-Latency API**: The `runHjx` function retrieves the cached logic instantly during the request lifecycle.

### Vite Integration
A custom Vite plugin allows `.hjx` files to be imported as standard modules.
```javascript
import pricingLogic from './logic/pricing.hjx';
// During build, this is replaced by the generated JavaScript.
```

---

## Production Deployment Best Practices
1. **Deterministic Models**: Always specify a fixed model version in your directives.
2. **Audit Logs**: Maintain the `.intent-cache` directory in version control to audit logic changes over time.
3. **CI/CD Integration**: Ensure the prebuild script runs before the main application build to prevent cache misses in production.
4. **Security Sandboxing**: The executor runs code in an isolated environment; ensure appropriate resource limits are set.

---

## Installation and Usage

### CLI Usage
```bash
npm install -g hjx-intent-coding
hjx run examples/hello.hjx
```

### Programmatic API
```javascript
import { runHjx } from 'hjx-intent-coding';

const result = await runHjx(source, { cache: true });
console.log(result.output);
```

---

## License
Licensed under the MIT License. Developed for verifiable AI-assisted engineering.

(C) 2026 Intent Coding Systems.
