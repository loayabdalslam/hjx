
function getFormattedTime() {
  return new Date().toLocaleTimeString();
}

export function init(store) {
  console.log("Dashboard background task started");


  const interval = setInterval(() => {
    const currentUptime = store.get("uptime");
    const currentStatus = store.get("status");

    store.set({
      uptime: currentUptime + 1,
      serverTime: getFormattedTime(),
      cpuUsage: Math.floor(Math.random() * 20) + 30, // Simulate CPU jitter
      statusClass: currentStatus === "Operational" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
    });
  }, 1000);

  store.set({ serverTime: getFormattedTime() });
}


export const handlers = {
  "refresh": (ctx) => {
  const s = ctx.store.get();
  let patch = {};
  console.log("Action: Force Refresh clicked");
  patch["totalSessions"] = (s["totalSessions"] + 1);
  ctx.store.set(patch);
},
  "toggleStatus": (ctx) => {
  const s = ctx.store.get();
  let patch = {};
  console.log("Action: Toggling Status");
  patch["status"] = (s["status"] == "Operational" ? "Maintenance" : "Operational");
  ctx.store.set(patch);
},
  "toggleNotice": (ctx) => {
  const s = ctx.store.get();
  let patch = {};
  console.log("Action: Toggling Maintenance Notice");
  patch["showMaintenanceNotice"] = (!s["showMaintenanceNotice"]);
  ctx.store.set(patch);
},
  "addAlert": (ctx) => {
  const s = ctx.store.get();
  let patch = {};
  console.log("Action: Adding Alert");
  patch["alerts"] = (s["alerts"] + ["System ping timed out"]);
  ctx.store.set(patch);
}
};
