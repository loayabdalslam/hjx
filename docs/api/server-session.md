# Server Session API

The server session provides WebSocket-based state synchronization for server-driven mode.

## Overview

The server session:
1. Manages WebSocket connections
2. Maintains shared state
3. Broadcasts updates to clients
4. Handles client events

## Usage

```javascript
import { createServer } from './dist/server_session.js';

const server = createServer({
  port: 8080,
  component: './dashboard.hjx'
});

server.start();
```

## Server Options

```typescript
interface ServerOptions {
  port: number;
  component: string;
  host?: string;
  maxConnections?: number;
}
```

## Functions

### createServer(options: ServerOptions): Server

Create a new server instance.

```javascript
const server = createServer({
  port: 8080,
  component: './app.hjx'
});
```

### server.start(): void

Start the server.

```javascript
server.start();
```

### server.stop(): void

Stop the server.

```javascript
server.stop();
```

### server.broadcast(event: string, data: any): void

Broadcast to all connected clients.

```javascript
server.broadcast('update', { count: 42 });
```

### server.getClients(): Client[]

Get all connected clients.

```javascript
const clients = server.getClients();
console.log(clients.length, 'connected');
```

## Client Connection

Clients connect via WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (event) => {
  const { type, state } = JSON.parse(event.data);
  if (type === 'state-update') {
    console.log('New state:', state);
  }
};
```

## Message Types

### Client → Server

```javascript
// Invoke handler
{
  type: 'invoke',
  handler: 'increment',
  args: []
}

// Subscribe
{
  type: 'subscribe',
  component: 'Counter'
}
```

### Server → Client

```javascript
// State update
{
  type: 'state-update',
  state: { count: 42 }
}

// Event broadcast
{
  type: 'event',
  event: 'notification',
  data: { message: 'Hello!' }
}
```

## Store API (Server-Side)

```javascript
import { createStore } from './dist/server_session.js';

const store = createStore({
  count: 0,
  users: []
});

// Get value
const count = store.get('count');

// Set value
store.set('count', 42);

// Set multiple
store.set({ count: 0, users: [] });

// Compute
store.compute('userCount', () => store.get('users').length);

// On event
store.on('increment', () => {
  store.set('count', store.get('count') + 1);
});

// Broadcast
store.broadcast('notification', { message: 'New user!' });
```

## Complete Example

### server.js

```javascript
import { createServer } from './dist/server_session.js';

const server = createServer({
  port: 8080,
  component: './dashboard.hjx'
});

// Initialize
server.on('connection', (client) => {
  console.log('Client connected');
});

// Start
server.start();
console.log('Server running on port 8080');
```

### dashboard.hjx

```hjx
component Dashboard

state:
  time = ""
  cpu = 0

script:
  export function init(store) {
    setInterval(() => {
      store.set({
        time: new Date().toLocaleTimeString(),
        cpu: Math.random() * 100
      });
    }, 1000);
  }

layout:
  view:
    text: "Time: {{time}}"
    text: "CPU: {{cpu}}%"
```

### client.js

```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = (event) => {
  const { type, state } = JSON.parse(event.data);
  if (type === 'state-update') {
    updateUI(state);
  }
};

function updateUI(state) {
  document.getElementById('time').textContent = state.time;
  document.getElementById('cpu').textContent = state.cpu;
}
```

## Error Handling

```javascript
try {
  server.start();
} catch (error) {
  if (error.code === 'EADDRINUSE') {
    console.error('Port already in use');
  }
}
```

## Performance

- **Connection pooling** - Reuse connections
- **Message batching** - Group rapid updates
- **Binary protocol** - Optional binary WebSocket

## Production

```javascript
const server = createServer({
  port: process.env.PORT,
  component: process.env.COMPONENT,
  maxConnections: 1000
});

server.start();
```
