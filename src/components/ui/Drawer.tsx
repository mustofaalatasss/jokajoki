import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

// Simple Drawer shell for Phase F1.

export function Drawer({ open, onClose, children, side = "right" }: { open: boolean; onClose: () => void; children: React.ReactNode; side?: "left" | "right" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[var(--overlay)] flex">
      <div className={cn(
        "bg-surface-1 h-full w-[300px] border-[var(--border-default)] shadow-lg p-6 relative flex flex-col",
        side === "right" ? "ml-auto border-l" : "mr-auto border-r"
      )}>
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-[var(--text-primary)]"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  )
}
