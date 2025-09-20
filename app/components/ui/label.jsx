import * as React from "react"

import { cn } from "@/lib/utils"

const Label = React.forwardRef(function Label({ className, ...props }, ref) {
  return (
    (<label
      ref={ref}
      data-slot="label"
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props} />)
  );
})

export { Label }

