# HJX + Next.js Integration

This example demonstrates how to use `hjx` as a programmatic library within a Next.js application to handle dynamic business logic.

## Why use HJX in Next.js?
1. **Natural Language Rules**: Allow non-technical stakeholders to define business logic in `.hjx` files.
2. **AI-Driven Logic**: Dynamically generate complex algorithms or data transformations using LLMs.
3. **Decoupled Architecture**: Separate "intent" (what should happen) from "implementation" (the generated JS/Python code).

## Project Structure
- `logic/`: Contains `.hjx` files defining business rules.
- `app/api/hjx/route.js`: A Next.js API Route that reads `.hjx` files and executes them using the `runHjx` API.
- `app/page.js`: A React component that fetches the result and displays it.

## Setup Instructions

1. **Install HJX**:
   ```bash
   # From your project root
   npm install ../../ # Points to the local hjx package
   ```

2. **Configure Provider**:
   Ensure you have an AI provider configured (e.g., Ollama running locally or an environment variable for OpenAI/Claude).

3. **Run the Dev Server**:
   ```bash
   npm run dev
   ```

4. **Visit the Page**:
   Open `http://localhost:3000` to see the dynamic discount calculator in action.

## Core Integration Snippet

```javascript
import { runHjx } from 'hjx';

const result = await runHjx(source, {
  provider: 'ollama',
  target: 'javascript'
});

console.log(result.output); // The result of your logic!
```
