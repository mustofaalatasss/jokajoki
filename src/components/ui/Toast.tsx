import * as React from "react"
import { cn } from "@/lib/utils"

// Simple Toast shell for F1.
export function Toast({ title, description, variant = "default", onClose }: { title: string; description?: string; variant?: "default" | "success" | "warning" | "danger"; onClose: () => void }) {
  const variantStyles = {
    default: "bg-surface-2 border-border text-text-main",
    success: "bg-success/10 border-success text-success",
    warning: "bg-warning/10 border-warning text-warning",
    danger: "bg-danger/10 border-danger text-danger",
  }

  return (
    <div className={cn("fixed bottom-4 right-4 z-50 flex flex-col gap-1 rounded-md border p-4 shadow-lg min-w-[300px]", variantStyles[variant])}>
      <div className="flex justify-between items-start">
        <h4 className="font-semibold">{title}</h4>
        <button onClick={onClose} className="opacity-50 hover:opacity-100">✕</button>
      </div>
      {description && <p className="text-sm opacity-90">{description}</p>}
    </div>
  )
}
