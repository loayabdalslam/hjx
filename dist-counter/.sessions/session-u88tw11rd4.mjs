


export const handlers = {
  "inc": (ctx) => {
  const s = ctx.store.get();
  let patch = {};
  patch["count"] = (s["count"] + 1);
  ctx.store.set(patch);
},
  "dec": (ctx) => {
  const s = ctx.store.get();
  let patch = {};
  patch["count"] = (s["count"] - 1);
  ctx.store.set(patch);
}
};
