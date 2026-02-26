# Script Block

The `script:` block allows server-side initialization and logic in server-driven mode.

## Overview

In server-driven mode, the `script:` block runs on the server and has access to the reactive store.

## Basic Syntax

```hjx
script:
  export function init(store) {
    // Server-side code
  }
```

## The Store API

### store.get(key)

Get a state value:

```hjx
script:
  export function init(store) {
    const count = store.get('count');
    const name = store.get('name');
  }
```

### store.set(values)

Set state values:

```hjx
script:
  export function init(store) {
    store.set({ count: 0, name: 'Initial' });
  }
```

### store.set(key, value)

Set a single value:

```hjx
script:
  export function init(store) {
    store.set('count', 42);
  }
```

### store.compute(key, fn)

Create a computed value:

```hjx
script:
  export function init(store) {
    store.compute('fullName', () => {
      const first = store.get('firstName');
      const last = store.get('lastName');
      return first + ' ' + last;
    });
  }
```

### store.on(event, handler)

Listen for client events:

```hjx
script:
  export function init(store) {
    store.on('increment', () => {
      const count = store.get('count');
      store.set('count', count + 1);
    });
  }
```

### store.broadcast(event, data)

Broadcast to all clients:

```hjx
script:
  export function init(store) {
    store.broadcast('user-joined', { name: 'John' });
  }
```

## Common Patterns

### Periodic Updates

```hjx
script:
  export function init(store) {
    setInterval(() => {
      store.set({
        time: new Date().toISOString(),
        users: getOnlineUsers()
      });
    }, 1000);
  }
```

### Event Handling

```hjx
script:
  export function init(store) {
    store.on('add-item', (data) => {
      const items = store.get('items');
      store.set('items', [...items, data.item]);
    });
    
    store.on('remove-item', (data) => {
      const items = store.get('items');
      store.set('items', items.filter(i => i !== data.item));
    });
  }
```

### Initial Setup

```hjx
script:
  export function init(store) {
    // Set initial state
    store.set({
      users: fetchUsers(),
      settings: loadSettings(),
      connected: true
    });
    
    // Start background tasks
    startSync(store);
  }
  
  function startSync(store) {
    setInterval(() => {
      store.set({ lastSync: Date.now() });
    }, 30000);
  }
```

## Complete Example

```hjx
component RealTimeDashboard

state:
  time = ""
  cpu = 0
  memory = 0
  users = []
  notifications = []

script:
  export function init(store) {
    // Initialize
    updateMetrics(store);
    
    // Update metrics every second
    setInterval(() => {
      updateMetrics(store);
    }, 1000);
    
    // Listen for client events
    store.on('clear-notifications', () => {
      store.set('notifications', []);
    });
    
    // Simulate notifications
    setInterval(() => {
      const notifications = store.get('notifications');
      if (notifications.length < 5) {
        const newNotif = {
          id: Date.now(),
          message: 'New event at ' + new Date().toLocaleTimeString()
        };
        store.set('notifications', [...notifications, newNotif]);
      }
    }, 5000);
  }
  
  function updateMetrics(store) {
    store.set({
      time: new Date().toLocaleTimeString(),
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      users: [
        { id: 1, name: 'Alice', status: 'online' },
        { id: 2, name: 'Bob', status: 'away' },
        { id: 3, name: 'Charlie', status: 'online' }
      ]
    });
  }

layout:
  view.dashboard:
    view.header:
      text.title: "Real-Time Dashboard"
      text.time: "{{time}}"
    
    view.metrics:
      view.metric:
        text.label: "CPU"
        text.value: "{{cpu.toFixed(1)}}%"
      view.metric:
        text.label: "Memory"
        text.value: "{{memory.toFixed(1)}}%"
    
    view.users:
      text.section-title: "Online Users"
      for (user in users):
        view.user:
          text.name: "{{user.name}}"
          text.status: "{{user.status}}"
    
    view.notifications:
      text.section-title: "Notifications ({{notifications.length}})"
      for (notif in notifications):
        view.notif: "{{notif.message}}"
      if (notifications.length > 0):
        button (on click -> clear): "Clear All"

style:
  .dashboard { padding: 20px; font-family: system-ui; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .title { font-size: 24px; font-weight: bold; }
  .metrics { display: flex; gap: 20px; margin-bottom: 24px; }
  .metric { padding: 16px; border: 1px solid #ddd; border-radius: 8px; min-width: 120px; }
  .label { font-size: 14px; color: #666; }
  .value { font-size: 28px; font-weight: bold; color: #007bff; }

handlers:
  clear:
    set notifications = []
```

## Best Practices

1. **Clean up timers** - Return cleanup function if needed
2. **Debounce updates** - Don't flood clients
3. **Handle errors** - Wrap async operations in try/catch
4. **Keep state minimal** - Only store what's needed for rendering
