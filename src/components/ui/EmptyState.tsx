import * as React from "react"
import { cn } from "@/lib/utils"
import { FolderOpen } from "lucide-react"

export function EmptyState({ title, description, className }: { title: string; description?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center bg-surface-1 border border-border rounded-lg", className)}>
      <div className="bg-surface-2 p-3 rounded-full mb-4">
        <FolderOpen className="h-6 w-6 text-muted" />
      </div>
      <h3 className="text-lg font-heading font-semibold text-text-main mb-1">{title}</h3>
      {description && <p className="text-sm text-muted max-w-sm">{description}</p>}
    </div>
  )
}
