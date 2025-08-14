import clsx from "clsx";

export function Badge({ variant = "default", className, ...props }) {
  const styles = {
    default: "bg-secondary text-secondary-foreground",
    outline: "border border-border",
  };
  return (
    <span className={clsx("inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium", styles[variant], className)} {...props} />
  );
}