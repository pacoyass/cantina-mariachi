import { useState } from "react";

export function Tabs({ tabs, initial, children }) {
  const [active, setActive] = useState(initial ?? tabs?.[0]?.value);
  return (
    <div>
      <div className="flex gap-2 border-b border-border mb-4">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setActive(t.value)}
            className={"px-3 py-2 text-sm " + (active === t.value ? "border-b-2 border-ring" : "text-muted-foreground")}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>
        {typeof children === 'function' ? children(active) : children}
      </div>
    </div>
  );
}