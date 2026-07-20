import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

// Simple Dialog shell for Phase F1. 
// Can be replaced with Radix UI Dialog later.

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[var(--overlay)] flex items-center justify-center p-4">
      <div className="bg-surface-1 border border-border rounded-lg shadow-lg max-w-md w-full relative">
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-muted hover:text-[var(--text-primary)]"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}>{children}</div>
}

export function DialogTitle({ children, className }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-heading font-semibold tracking-tight", className)}>{children}</h2>
}

export function DialogDescription({ children, className }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
}

export function DialogContent({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>
}

export function DialogFooter({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex justify-end space-x-2 p-6 pt-0", className)}>{children}</div>
}
