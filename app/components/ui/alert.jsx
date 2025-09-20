import * as React from "react"

import { cn } from "@/lib/utils"

const variants = {
  default: "bg-background text-foreground border",
  destructive: "border-destructive/50 text-destructive dark:border-destructive",
  success: "border-green-500/50 text-green-700 dark:text-green-400",
  warning: "border-yellow-500/50 text-yellow-700 dark:text-yellow-400",
}

function Alert({ className, variant = "default", ...props }) {
  return (
    (<div
      role="alert"
      data-slot="alert"
      className={cn("relative w-full rounded-lg border p-4", variants[variant] || variants.default, className)}
      {...props} />)
  );
}

function AlertDescription({ className, ...props }) {
  return (
    (<div
      data-slot="alert-description"
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props} />)
  );
}

export { Alert, AlertDescription }

