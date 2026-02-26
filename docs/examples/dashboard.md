# Dashboard Example

A real-time server-driven dashboard demonstrating the script block, WebSocket sync, and computed values.

## The Code

```hjx
component Dashboard

state:
  uptime = 0
  serverTime = ""
  cpuUsage = 45
  memoryUsage = 62
  status = "Operational"
  alerts = ["High CPU Usage", "New login from unknown device"]
  users = []

script:
  export function init(store) {
    setInterval(() => {
      store.set({
        uptime: store.get('uptime') + 1,
        serverTime: new Date().toLocaleTimeString(),
        cpuUsage: Math.floor(Math.random() * 20) + 30,
        memoryUsage: Math.floor(Math.random() * 30) + 40
      });
    }, 1000);
    
    store.compute('status', () => {
      const cpu = store.get('cpuUsage');
      if (cpu > 80) return 'Critical';
      if (cpu > 60) return 'Warning';
      return 'Operational';
    });
  }

layout:
  view.min-h-screen.bg-slate-50.p-8:
    view.max-w-6xl.mx-auto.space-y-8:
      view.header:
        text.text-3xl.font-bold: "System Dashboard"
        text.status: "Status: {{status}}"
      
      view.grid.grid-cols-1.md:grid-cols-2.lg:grid-cols-4.gap-4:
        view.metric-card:
          text.label: "Uptime"
          text.value: "{{uptime}}s"
        view.metric-card:
          text.label: "Server Time"
          text.value: "{{serverTime}}"
        view.metric-card:
          text.label: "CPU Usage"
          text.value: "{{cpuUsage}}%"
        view.metric-card:
          text.label: "Memory"
          text.value: "{{memoryUsage}}%"
      
      view.alerts:
        text.title: "Alerts"
        for (alert in alerts):
          view.alert: "{{alert}}"
      
      view.users-section:
        text.title: "Active Users ({{users.length}})"
        if (users.length === 0):
          text.empty: "No active users"
        for (user in users):
          view.user-card:
            text.name: "{{user.name}}"
            text.user-status: "{{user.status}}"

style:
  .min-h-screen { min-height: 100vh; }
  .bg-slate-50 { background: #f8fafc; }
  .p-8 { padding: 32px; }
  .max-w-6xl { max-width: 72rem; }
  .mx-auto { margin-left: auto; margin-right: auto; }
  .space-y-8 > * + * { margin-top: 32px; }
  .grid { display: grid; }
  .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .gap-4 { gap: 16px; }
  @media (min-width: 768px) {
    .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (min-width: 1024px) {
    .lg\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }
  .metric-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
  .label { font-size: 14px; color: #64748b; margin-bottom: 4px; }
  .value { font-size: 28px; font-weight: 700; color: #0f172a; }
  .header { display: flex; justify-content: space-between; align-items: center; }
  .text-3xl { font-size: 30px; }
  .font-bold { font-weight: 700; }
  .alert { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 12px; border-radius: 8px; margin-bottom: 8px; }
  .title { font-size: 18px; font-weight: 600; margin-bottom: 12px; }
  .user-card { background: white; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
```

## Features Demonstrated

### 1. Server-Driven Mode

```hjx
script:
  export function init(store) {
    // Server-side code
  }
```

The script block runs on the server and manages state.

### 2. Periodic Updates

```hjx
setInterval(() => {
  store.set({ cpuUsage: Math.random() * 100 });
}, 1000);
```

Updates every second, broadcast to all clients.

### 3. Computed Values

```hjx
store.compute('status', () => {
  const cpu = store.get('cpuUsage');
  if (cpu > 80) return 'Critical';
  return 'Operational';
});
```

Automatically updates when dependencies change.

### 4. Real-Time Sync

State changes on server automatically sync to all connected clients via WebSocket.

## How It Works

1. **Server starts**: Executes `init(store)` function
2. **Timer runs**: Every second, updates metrics
3. **Broadcast**: New state sent to all clients
4. **Client updates**: UI re-renders with new data

## Try It

```bash
node dist/cli.js dev examples/dashboard.hjx --out dist-app --port 5173 --target server
```

Open http://localhost:5173 in multiple browsers - they'll all update together!

## Architecture

```
┌─────────────┐     WebSocket      ┌─────────────┐
│   Server    │ ◄────────────────► │   Client    │
│             │   state updates    │             │
│  (script)   │                    │  (render)   │
└─────────────┘                    └─────────────┘
```

## Use Cases

- **Monitoring dashboards** - Real-time metrics
- **Live counters** - Vote counts, auction bids
- **Collaborative apps** - Multiple users editing
- **IoT dashboards** - Device status updates
