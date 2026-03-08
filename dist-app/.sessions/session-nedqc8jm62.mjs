


export const handlers = {
  "logout": (ctx) => {
  const s = ctx.store.get();
  let patch = {};
  console.log("Logged out");
  patch["isLoggedIn"] = (false);
  ctx.store.set(patch);
},
  "login": (ctx) => {
  const s = ctx.store.get();
  let patch = {};
  console.log("Logged in");
  patch["isLoggedIn"] = (true);
  ctx.store.set(patch);
},
  "upgradePremium": (ctx) => {
  const s = ctx.store.get();
  let patch = {};
  console.log("Upgraded to premium");
  patch["isPremium"] = (true);
  ctx.store.set(patch);
}
};
