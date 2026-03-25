# HJX NLP Studio

A full-stack web application powered by the HJX NLP engine. Write HJX code using natural language, get real-time error detection, code completion, and semantic search.

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    HJX NLP Studio                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                    Frontend (HJX)                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │  │
│  │  │  Code    │  │  NL      │  │  Preview │  │ Errors │ │  │
│  │  │  Editor  │  │  Prompt  │  │  Panel   │  │ Panel  │ │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬────┘ │  │
│  │       │             │             │             │       │  │
│  │  ┌────┴─────────────┴─────────────┴─────────────┴────┐  │  │
│  │  │              WebSocket / REST API                  │  │  │
│  │  └─────────────────────┬─────────────────────────────┘  │  │
│  └────────────────────────┼────────────────────────────────┘  │
│                           │                                    │
│  ┌────────────────────────┴────────────────────────────────┐  │
│  │                    Backend (Node.js)                     │  │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐           │  │
│  │  │  Generate │  │  Analyze  │  │  Complete │           │  │
│  │  │  /api/nlp │  │  /api/nlp │  │  /api/nlp │           │  │
│  │  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘           │  │
│  │        │              │              │                   │  │
│  │  ┌─────┴──────────────┴──────────────┴──────────────┐   │  │
│  │  │              HJX NLP Engine                       │   │  │
│  │  │  Intent · Entities · Relations · Templates        │   │  │
│  │  │  Error Detection · Completion · Embeddings        │   │  │
│  │  └───────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# From the hjx project root
npm install

# Start the NLP Studio
node examples/nlp-ide/server/index.js

# Open http://localhost:3200
```

## Features

| Feature | Description |
|---------|-------------|
| **NL → Code** | Describe what you want, get HJX code |
| **Error Detection** | Real-time syntax and semantic analysis |
| **Auto-Correct** | One-click fix for common errors |
| **Code Completion** | Context-aware suggestions |
| **Similarity Search** | Find similar components |
| **Feature Analysis** | View component metrics |
| **Format** | Canonical code formatting |

## API

```bash
POST /api/nlp/generate    { description } → { code, method, confidence }
POST /api/nlp/analyze     { code } → { intent, entities, errors, features }
POST /api/nlp/complete    { code, line, column } → { completions }
POST /api/nlp/fix         { code } → { corrected, changes }
POST /api/nlp/format      { code } → { formatted }
POST /api/nlp/search      { query } → { results }
```
