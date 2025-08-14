import { cloneElement, useState } from "react";
import clsx from "clsx";

export function Sheet({ children }) {
  const [open, setOpen] = useState(false);
  const context = { open, setOpen };
  return (
    <div data-sheet>
      {Array.isArray(children)
        ? children.map((child, i) => cloneElement(child, { key: i, _sheet: context }))
        : cloneElement(children, { _sheet: context })}
    </div>
  );
}

export function SheetTrigger({ children, _sheet }) {
  return cloneElement(children, {
    onClick: () => _sheet.setOpen(true),
  });
}

export function SheetContent({ side = "left", children, className, _sheet }) {
  const { open, setOpen } = _sheet;
  return (
    <div className={clsx(open ? "fixed inset-0 z-50" : "hidden")}
      onClick={() => setOpen(false)}
      aria-hidden="true">
      <div
        className={clsx(
          "absolute inset-0 bg-black/40",
        )}
      />
      <aside
        className={clsx(
          "fixed z-50 w-80 h-full bg-background text-foreground border-r border-border shadow-lg p-4",
          side === "left" ? "left-0 top-0" : "right-0 top-0",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </aside>
    </div>
  );
}