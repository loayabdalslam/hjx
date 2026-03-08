
export function init(store) {
  const variant = store.get("variant") || "default";
  const variantClasses = {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground text-slate-900",
    secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline"
  };
  store.set({ variantClass: variantClasses[variant] || variantClasses.default });
}


export const handlers = {
  
};
