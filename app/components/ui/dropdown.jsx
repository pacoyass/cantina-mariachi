import clsx from "clsx";

export function Dropdown({ label, children, className }) {
  return (
    <details className={clsx("relative", className)}>
      <summary className="list-none inline-flex items-center gap-2 cursor-pointer rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
        {label}
      </summary>
      <div className="absolute right-0 mt-2 min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
        {children}
      </div>
    </details>
  );
}

export function DropdownItem({ children, onSelect }) {
  return (
    <button onClick={onSelect} className="w-full text-left rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
      {children}
    </button>
  );
}