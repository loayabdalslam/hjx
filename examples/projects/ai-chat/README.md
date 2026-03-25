# AI Chat Application — Full-Stack HJX Application

A production-ready AI chat application with multiple conversation threads,
real-time streaming responses, conversation history, and provider switching.

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     AI Chat Application                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐  ┌──────────────────┐  ┌────────────────┐   │
│  │  Sidebar      │  │  Chat Window     │  │  Settings      │   │
│  │  (Threads,    │  │  (Messages,      │  │  (Provider,    │   │
│  │   Search)     │  │   Input, Stream) │  │   Model, Key)  │   │
│  └──────┬───────┘  └────────┬─────────┘  └───────┬────────┘   │
│         │                   │                     │            │
│  ┌──────┴───────────────────┴─────────────────────┴─────────┐  │
│  │              Server-Driven Runtime                        │  │
│  │    WebSocket: real-time message streaming                 │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                      │
│  ┌──────────────────────┴───────────────────────────────────┐  │
│  │                    AI Provider Layer                      │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐   │  │
│  │  │  Groq     │  │  OpenRouter  │  │  Ollama (local)  │   │  │
│  │  │  Llama3   │  │  Claude/GPT  │  │  Any local model │   │  │
│  │  └──────────┘  └──────────────┘  └──────────────────┘   │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                      │
│  ┌──────────────────────┴───────────────────────────────────┐  │
│  │                   Database (SQLite)                       │  │
│  │  conversations | messages | settings | usage_stats        │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## Components

| File | Purpose |
|------|---------|
| `app.hjx` | Root app with layout and routing |
| `chat-window.hjx` | Main chat interface with streaming |
| `sidebar.hjx` | Conversation list with search |
| `message-bubble.hjx` | Individual message display |
| `chat-input.hjx` | Message input with send button |
| `settings-panel.hjx` | Provider/model/API configuration |
| `welcome-screen.hjx` | Empty state with suggestions |
| `components/TypingIndicator.hjx` | Animated typing dots |
| `components/CodeBlock.hjx` | Code syntax highlighting |
| `components/MarkdownRenderer.hjx` | Markdown message rendering |

## API Contract

```bash
# Conversations
GET    /api/conversations
POST   /api/conversations          { title }
GET    /api/conversations/:id/messages
DELETE /api/conversations/:id

# Messages
POST   /api/conversations/:id/messages    { content, stream: true }
       → WebSocket stream of tokens

# Settings
GET    /api/settings
PUT    /api/settings              { provider, model, apiKey }

# Usage
GET    /api/usage/stats           { totalTokens, totalCost, dailyUsage }
```

## Run

```bash
hjx dev examples/projects/ai-chat/app.hjx --out dist-chat --port 3001
```
