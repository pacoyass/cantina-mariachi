import * as React from "react"
import { cn } from "../../lib/utils"
import { ChevronDown } from "../../lib/lucide-shim.js"

const Select = React.createContext()

const SelectRoot = React.forwardRef(function SelectRoot({ children, value, onValueChange, ...props }, ref) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value || "")

  React.useEffect(() => {
    setSelectedValue(value || "")
  }, [value])

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
    setIsOpen(false)
  }

  return (
    <Select.Provider value={{ 
      isOpen, 
      setIsOpen, 
      selectedValue, 
      handleValueChange 
    }}>
      <div ref={ref} className="relative" {...props}>
        {children}
      </div>
    </Select.Provider>
  )
})

const SelectTrigger = React.forwardRef(function SelectTrigger({ className, children, ...props }, ref) {
  const { isOpen, setIsOpen, selectedValue } = React.useContext(Select)

  return (
    <button
      ref={ref}
      type="button"
      role="combobox"
      aria-expanded={isOpen}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
})

const SelectValue = React.forwardRef(function SelectValue({ placeholder, className, ...props }, ref) {
  const { selectedValue } = React.useContext(Select)
  
  return (
    <span ref={ref} className={className} {...props}>
      {selectedValue || placeholder}
    </span>
  )
})

const SelectContent = React.forwardRef(function SelectContent({ className, children, ...props }, ref) {
  const { isOpen } = React.useContext(Select)

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-full left-0 z-50 w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

const SelectItem = React.forwardRef(function SelectItem({ className, children, value, ...props }, ref) {
  const { handleValueChange, selectedValue } = React.useContext(Select)

  return (
    <div
      ref={ref}
      role="option"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        selectedValue === value && "bg-accent text-accent-foreground",
        className
      )}
      onClick={() => handleValueChange(value)}
      {...props}
    >
      {children}
    </div>
  )
})

export {
  SelectRoot as Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}