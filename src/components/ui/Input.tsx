import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full border-b-2 border-l border-r border-t border-[var(--border-default)] border-b-[var(--border-strong)] bg-[var(--input-bg)] px-4 py-2 text-sm text-[var(--text-primary)] transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:border-b-[var(--red-bright)] focus-visible:bg-[var(--input-focus-bg)] focus-visible:shadow-[0_10px_20px_-10px_var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-50 clip-slanted",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
