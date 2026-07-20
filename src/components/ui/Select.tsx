import * as React from "react"
import { cn } from "@/lib/utils"

// A simple Select shell for the MVP phase since we don't have Radix UI Select yet.
// We can use a native select element with custom styling.

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "appearance-none bg-no-repeat flex h-12 w-full border-b-2 border-l border-r border-t border-[var(--border-default)] border-b-[var(--border-strong)] bg-[var(--input-bg)] px-4 py-2 pr-10 text-sm text-[var(--text-primary)] transition-all focus-visible:outline-none focus-visible:border-b-[var(--red-bright)] focus-visible:bg-[var(--input-focus-bg)] focus-visible:shadow-[0_10px_20px_-10px_var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-50 clip-slanted",
          className
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%23888888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundPosition: 'right 1rem center',
          backgroundSize: '1.2em 1.2em'
        }}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }
