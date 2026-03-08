# Server-Driven Mode

HJX includes a server-driven rendering mode where state lives on the server and UI updates are pushed to the browser via WebSocket.

## How It Works

```
Browser ←──WebSocket──→ Node.js Server
  │                        │
  ├─ Renders HTML           ├─ Manages state
  ├─ Sends events           ├─ Runs handlers
  └─ Applies patches        └─ Pushes state patches
```

1. The **dev server** compiles your `.hjx` file and serves it
2. The browser connects via **WebSocket** to `/hjx`
3. **State lives on the server** — the server sends the initial state on connection
4. When the user interacts (clicks, types), **events** are sent to the server
5. The server **runs handlers**, updates state, and pushes **patches** back
6. The browser applies patches to update the UI in real-time

## Using Server-Driven Mode

Server-driven mode is automatically activated when you use the `dev` command:

```bash
node dist/cli.js dev examples/dashboard.hjx --out dist-app --port 5173
```

## The `script:` Block

The `script:` block runs on the server. Export an `init(store)` function to run background logic:

```yaml
component Dashboard

state:
  uptime = 0
  serverTime = ""
  cpuUsage = 45

script:
  export function init(store) {
    setInterval(() => {
      store.set({
        uptime: store.get("uptime") + 1,
        serverTime: new Date().toLocaleTimeString(),
        cpuUsage: Math.floor(Math.random() * 20) + 30
      });
    }, 1000);
  }

layout:
  view.dashboard:
    text: "Uptime: {{uptime}}s"
    text: "Time: {{serverTime}}"
    text: "CPU: {{cpuUsage}}%"
```

### Store API

The `store` object passed to `init()` provides:

| Method | Description |
|--------|-------------|
| `store.get()` | Returns the full state object |
| `store.get(key)` | Returns a specific state value |
| `store.set(patch)` | Merges a patch into state and pushes updates to the client |

## Server Sessions

Each WebSocket connection creates a **ServerSession** that:

- Maintains its own state instance
- Compiles and loads handler functions
- Supports **child component sessions** for composed components
- Automatically cleans up on disconnect

## Build vs Dev

| Feature | `build` | `dev` |
|---------|---------|-------|
| Output | Static HTML/CSS/JS | Served via HTTP |
| State | Client-side only | Server-managed |
| `script:` block | Not executed | Runs on server |
| Live updates | No | Via WebSocket |
| Hot reload | No | Yes (file watching) |

## When to Use

- **`build`**: Static sites, deployments, no server needed
- **`dev`**: Real-time dashboards, interactive prototyping, server-side logic

---

**Next:** [Ecosystem →](/guide/ecosystem)
