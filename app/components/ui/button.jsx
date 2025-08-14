import clsx from "clsx";

const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
const variants = {
  default: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
  outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
};
const sizes = {
  sm: "h-9 px-3 py-2",
  md: "h-10 px-4 py-2",
  lg: "h-11 px-6 py-3",
  icon: "h-10 w-10",
};

export function Button({ className, variant = "default", size = "md", ...props }) {
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />
  );
}