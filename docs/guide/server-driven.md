# Server-Driven Mode

Server-driven mode allows your UI to receive real-time updates from the server via WebSocket.

## How It Works

1. Server maintains the "source of truth" state
2. Server pushes state updates to all connected clients
3. Client renders based on server state
4. Client actions are sent to server for processing

## Basic Example

```hjx
component Dashboard

state:
  time = ""
  cpu = 0
  memory = 0

script:
  export function init(store) {
    setInterval(() => {
      store.set({
        time: new Date().toLocaleTimeString(),
        cpu: Math.random() * 100,
        memory: Math.random() * 100
      });
    }, 1000);
  }

layout:
  view.container:
    text: "Server Time: {{time}}"
    text: "CPU: {{cpu}}%"
    text: "Memory: {{memory}}%"
```

## Starting Server-Driven Mode

```bash
node dist/cli.js dev examples/dashboard.hjx --out dist-app --port 5173 --server
```

The `--server` flag enables WebSocket synchronization.

## Server API

In the `script:` block, you have access to:

### `store.get(key)`

Get a state value:

```js
export function init(store) {
  const count = store.get('count');
}
```

### `store.set(values)`

Set state values:

```js
export function init(store) {
  store.set({ count: 42 });
}
```

### `store.on(event, handler)`

Listen for events:

```js
export function init(store) {
  store.on('increment', () => {
    const count = store.get('count');
    store.set({ count: count + 1 });
  });
}
```

### `store.broadcast(event, data)`

Broadcast to all clients:

```js
export function init(store) {
  store.broadcast('user-joined', { name: 'John' });
}
```

## Handling Client Actions

When a client triggers a handler, it sends a message to the server:

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
    # Handled server-side in server-driven mode
    set count = count + 1
```

The handler executes on the server, then broadcasts the new state to all clients.

## Use Cases

- **Real-time dashboards** - Live metrics, charts, logs
- **Collaborative apps** - Multiple users editing same data
- **IoT dashboards** - Device status updates
- **Live notifications** - Push updates to all clients

## Comparison

| Feature | Vanilla Mode | Server-Driven Mode |
|---------|--------------|-------------------|
| State location | Client | Server |
| Updates | Local only | All clients |
| Latency | Instant | Network dependent |
| Offline support | Yes | No |
| Server required | No | Yes |

## Best Practices

1. **Minimize update frequency** - Don't flood clients with updates
2. **Batch updates** - Group related changes
3. **Handle disconnections** - Client should reconnect gracefully

## Next Steps

- [Component Composition](/guide/components) - Reusable components
- [Production Build](/guide/production) - Deploy your app
- [API Reference](/api/server-session) - Server session API
