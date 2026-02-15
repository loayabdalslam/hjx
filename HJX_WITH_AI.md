# HJX with AI - Building AI-Powered UIs

Guide for integrating HJX with AI/LLMs (Large Language Models) like OpenAI, Anthropic Claude, Google Gemini, etc.

---

## Use Cases

### 1. **AI Chat Interface**
Build a chatbot UI, send messages to Claude/GPT, stream responses, display typing indicators.

### 2. **AI Code Generator**
UI for code generation → displays results in a code editor.

### 3. **AI Content Assistant**
Form for blog post/article topics → generates content with streaming.

### 4. **Real-Time AI Analysis**
Drop a file, send to AI, display analysis results and charts.

### 5. **Multi-Step AI Workflow**
Step-by-step form → each step calls different AI model.

---

## Architecture: Client vs Server

### Option A: Client-Side Only ❌ (Not Recommended)
```
Browser → AI API (OpenAI/Anthropic) directly
```
**Problem:** Exposes API keys to browser (security risk).

### Option B: Backend Proxy ✅ (Recommended)
```
Browser (HJX app) → Your Backend Server → AI API
```
**Benefit:** API keys stay secret on server, better rate limiting.

---

## Example 1: Simple AI Chat UI

### 1. Write the HJX component

**File:** `examples/ai-chat.hjx`

```hjx
component ChatApp

state:
  messages = []
  userInput = ""
  isLoading = false
  errorMsg = ""

layout:
  view.chat-container:
    view.header:
      text.title: "AI Chat Assistant"

    view.messages-box:
      for (msg in messages):
        view.message-item:
          if (msg.role === "user"):
            view.msg-user:
              text: "{{msg.content}}"
          else:
            view.msg-assistant:
              text: "{{msg.content}}"
      
      if (isLoading):
        view.typing-indicator:
          text: "AI is thinking..."

    if (errorMsg):
      view.error-box:
        text: "{{errorMsg}}"

    view.input-section:
      input.user-input (bind value <-> userInput):
      button.send-btn (on click -> sendMessage): "Send"

style:
  .chat-container {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 16px;
    font-family: system-ui, sans-serif;
  }
  .header {
    padding: 16px 0;
    border-bottom: 1px solid #ddd;
    margin-bottom: 16px;
  }
  .title {
    font-size: 24px;
    font-weight: bold;
  }
  .messages-box {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 16px;
    padding: 16px 0;
  }
  .message-item {
    margin-bottom: 12px;
    display: flex;
  }
  .msg-user {
    align-self: flex-end;
    background: #007bff;
    color: white;
    padding: 12px 16px;
    border-radius: 12px;
    max-width: 70%;
    word-wrap: break-word;
  }
  .msg-assistant {
    align-self: flex-start;
    background: #f0f0f0;
    color: black;
    padding: 12px 16px;
    border-radius: 12px;
    max-width: 70%;
    word-wrap: break-word;
  }
  .typing-indicator {
    color: #999;
    font-style: italic;
    padding: 12px;
  }
  .error-box {
    background: #ffebee;
    color: #c62828;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 12px;
  }
  .input-section {
    display: flex;
    gap: 8px;
  }
  .user-input {
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
  }
  .send-btn {
    padding: 12px 24px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
  }
  .send-btn:hover {
    background: #0056b3;
  }

handlers:
  sendMessage:
    log "sendMessage called"
```

### 2. Build the HJX app

```bash
npm run build
node dist/cli.js build examples/ai-chat.hjx --out dist-chat
```

### 3. Create a backend to handle AI calls

**File:** `backend/server.js` (Node.js + Express example)

```javascript
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// Endpoint to send message to Claude
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: 'You are a helpful assistant.',
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    // Extract assistant response
    const assistantMessage = data.content[0]?.text || '';

    res.json({ content: assistantMessage });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

app.listen(3000, () => console.log('Backend listening on port 3000'));
```

### 4. Connect HJX frontend to backend

Update the handler in `ai-chat.hjx`:

```hjx
handlers:
  sendMessage:
    # Add message to conversation
    set messages = [...messages, {"role": "user", "content": userInput}]
    set userInput = ""
    set isLoading = true
    set errorMsg = ""
    # POST to backend (note: HJX handlers don't support async directly yet)
```

**Since HJX handlers don't support async/await yet**, you need to add custom JavaScript to the HTML:

In `dist-chat/index.html`, after the footer, add:

```html
<script>
  // Reference the store and handlers from the compiled app
  window.sendUserMessage = async function() {
    const app = window.__hjx_app;
    if (!app) return;
    
    const store = app.store;
    const state = store.get();
    
    if (!state.userInput.trim()) return;
    
    // Update UI to show user message and loading state
    store.set({
      messages: [...state.messages, { role: 'user', content: state.userInput }],
      userInput: '',
      isLoading: true,
      errorMsg: ''
    });

    try {
      // Call backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: state.messages })
      });

      const data = await response.json();

      if (!response.ok) {
        store.set({ errorMsg: data.error || 'Error communicating with AI' });
      } else {
        // Add AI response
        const updatedMessages = [
          ...state.messages,
          { role: 'assistant', content: data.content }
        ];
        store.set({ messages: updatedMessages });
      }
    } catch (error) {
      store.set({ errorMsg: 'Network error: ' + error.message });
    } finally {
      store.set({ isLoading: false });
    }
  };
</script>
```

Then update the handler to call this:

```hjx
handlers:
  sendMessage:
    log "Message sent"
```

And change the button to trigger it:

```hjx
button.send-btn (on click -> sendMessage): "Send"
```

---

## Example 2: AI Code Generator UI

**File:** `examples/code-generator.hjx`

```hjx
component CodeGenerator

state:
  prompt = ""
  language = "javascript"
  generatedCode = ""
  isLoading = false
  error = ""

layout:
  view.container:
    view.header:
      text.title: "AI Code Generator"
    
    view.form-section:
      text.label: "What should I code?"
      input.prompt-input (bind value <-> prompt):
      
      text.label: "Language:"
      select.language-select:
        text.option: "JavaScript"
        text.option: "Python"
        text.option: "TypeScript"
      
      button.generate-btn (on click -> generate): "Generate Code"
    
    if (error):
      view.error-box:
        text: "Error: {{error}}"
    
    if (generatedCode):
      view.code-section:
        text.code-label: "Generated Code:"
        view.code-block:
          text: "{{generatedCode}}"
        button.copy-btn (on click -> copyCode): "Copy to Clipboard"
    
    if (isLoading):
      view.loading:
        text: "Generating..."

style:
  .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
  .form-section { margin-bottom: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
  .label { font-weight: bold; margin-bottom: 8px; }
  .prompt-input { width: 100%; padding: 12px; margin-bottom: 16px; border: 1px solid #ddd; border-radius: 4px; }
  .code-section { background: #f5f5f5; padding: 16px; border-radius: 8px; }
  .code-block { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 4px; font-family: monospace; overflow-x: auto; }
  .error-box { background: #ffebee; color: #c62828; padding: 12px; border-radius: 4px; margin-bottom: 12px; }

handlers:
  generate:
    log "Generate clicked"
  copyCode:
    log "Copy clicked"
```

---

## Example 3: Streaming Responses (Advanced)

For real-time streaming from Claude/OpenAI, use Server-Sent Events (SSE):

### Backend (Node.js):
```javascript
app.post('/api/chat-stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const { messages } = req.body;

  try {
    const stream = await anthropic.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: messages,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});
```

### Frontend (JavaScript in HTML):
```javascript
window.sendUserMessageStream = async function() {
  const app = window.__hjx_app;
  const store = app.store;
  const state = store.get();

  store.set({
    messages: [...state.messages, { role: 'user', content: state.userInput }],
    userInput: '',
    isLoading: true,
  });

  let assistantMessage = '';

  try {
    const response = await fetch('/api/chat-stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: state.messages })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          if (data.text) {
            assistantMessage += data.text;
            // Update UI in real-time
            store.set({
              messages: [
                ...state.messages,
                { role: 'assistant', content: assistantMessage }
              ]
            });
          }
        }
      }
    }
  } catch (error) {
    store.set({ error: error.message });
  } finally {
    store.set({ isLoading: false });
  }
};
```

---

## Best Practices

### 1. **Never expose API keys in frontend code**
```javascript
// ❌ WRONG - exposes key
const response = await fetch('https://api.openai.com/v1/chat', {
  headers: { 'Authorization': 'Bearer ' + OPENAI_KEY }
});

// ✅ CORRECT - key stays on backend
const response = await fetch('/api/chat', { /* ... */ });
```

### 2. **Validate user input on both frontend and backend**
```hjx
handlers:
  sendMessage:
    set userInput = ""  # Clear after sending
```

### 3. **Show loading states**
```hjx
state:
  isLoading = false

layout:
  if (isLoading):
    text: "AI is thinking..."
```

### 4. **Handle errors gracefully**
```hjx
state:
  errorMsg = ""

layout:
  if (errorMsg):
    view.error:
      text: "{{errorMsg}}"
```

### 5. **Rate limit and cost control**
- Add delays between messages
- Limit message history
- Use cheaper models for simple tasks

---

## Deployment Checklist

- [ ] API keys in environment variables (not hardcoded)
- [ ] CORS properly configured on backend
- [ ] Rate limiting enabled
- [ ] Error handling for API failures
- [ ] Loading states for UX
- [ ] Message history limits (don't send infinite context)
- [ ] User authentication (if multi-user)
- [ ] Logging for debugging

---

## Supported AI APIs

All major AI providers work with HJX:

| Provider | API | Model | Cost |
|----------|-----|-------|------|
| **Anthropic** | REST | Claude 3.5 Sonnet | $3/M tokens |
| **OpenAI** | REST | GPT-4, GPT-3.5 | $5-15/M tokens |
| **Google** | REST | Gemini 2.0 | $0.075/M tokens |
| **Hugging Face** | REST | Open models | Free (self-hosted) |
| **Ollama** | Local | Llama, Mistral | Free (local) |

---

## Future: Native AI Support in HJX

Roadmap for potential built-in AI features:

```hjx
# Hypothetical future syntax
handlers:
  askAI:
    ai-call "Claude" message="Generate a poem" -> result
    set poem = result

# or streaming
  streamResponse:
    ai-stream "Claude" message=userInput -> chunk
    set output = output + chunk
```

Currently: Use custom JavaScript (as shown above).

---

## Resources

- [Anthropic Claude API](https://docs.anthropic.com/)
- [OpenAI API](https://platform.openai.com/docs/)
- [Google Gemini API](https://ai.google.dev/)
- [HJX GitHub](https://github.com/loayabdalslam/hjx)

