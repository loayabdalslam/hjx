# Server-Driven Mode

HJX supports a server-driven mode where the server manages state and sends updates to the client via WebSocket.

## Overview

In server-driven mode:
- State lives on the server
- Events are sent to the server via WebSocket
- Server responds with state updates
- Client automatically re-renders

## When to Use

- Complex state logic that should stay on the server
- Real-time applications with shared state
- Applications requiring server-side validation
- When you want centralized state management

## Running in Server-Driven Mode

```bash
node dist/cli.js dev examples/counter.hjx --out dist-app --port 5172
```

The dev server automatically enables WebSocket communication.

## Architecture

### Client Side

The client connects to the server via WebSocket:

```javascript
const ws = new WebSocket("ws://localhost:5172/hjx");
```

Messages are JSON:

```javascript
// Client sends:
{ type: "event", handler: "increment", args: [] }

// Server responds:
{ type: "update", state: { count: 1 } }
```

### Server Side

The server (`server_session.ts`) manages component state:

- Parses the HJX component
- Maintains state in memory
- Handles events by executing handlers
- Broadcasts updates to connected clients

## State Synchronization

1. Initial load: Server sends full state
2. Event: Client sends event to server
3. Processing: Server executes handler
4. Update: Server sends new state to all clients
5. Render: Client updates UI

## Example

```hjx
component Counter

state:
  count = 0

layout:
  view:
    text: "Count: {{count}}"
    button (on click -> increment): "+"

handlers:
  increment:
    set count = count + 1
```

In server-driven mode, when the user clicks the button:
1. Client sends `{ type: "event", handler: "increment" }`
2. Server executes handler, updates count
3. Server sends `{ type: "update", state: { count: 1 } }`
4. Client re-renders with new count

## Comparison

| Feature | Vanilla | Server-Driven |
|---------|---------|---------------|
| State location | Client | Server |
| Events | Local execution | WebSocket |
| Real-time sync | No | Yes |
| Complexity | Lower | Higher |
| Dependencies | None | WebSocket |

## Use Cases

### Chat Application

```hjx
component Chat

state:
  messages = []

layout:
  view.chat:
    for (msg in messages):
      view.message: "{{msg.text}}"

handlers:
  sendMessage:
    set messages = messages + [inputText]
```

### Live Dashboard

Multiple clients viewing the same dashboard see real-time updates.

### Collaborative Editing

Multiple users editing the same document see each other's changes.

## Performance Considerations

- WebSocket overhead for each event
- Server must maintain state for each session
- Consider vanilla mode for simple, client-only apps

## Security

The server executes handlers from client events. Ensure:
- Validate all input
- Sanitize data before storage
- Use authentication if needed
