import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border px-3 py-1 text-[10px] font-heading tracking-[0.2em] uppercase font-black transition-colors focus:outline-none focus:ring-2 focus:ring-red-bright focus:ring-offset-2 clip-slanted",
  {
    variants: {
      variant: {
        default: "border-red-bright/50 bg-red-dark/80 text-white shadow-[0_0_10px_rgba(226,59,73,0.3)]",
        secondary: "border-white/20 bg-surface-2 text-white",
        destructive: "border-red-bright/50 bg-danger text-white",
        outline: "text-muted border-white/20 hover:text-white hover:border-red-bright/50",
        success: "border-success/50 bg-success/20 text-success shadow-[0_0_10px_rgba(54,184,115,0.2)]",
        warning: "border-warning/50 bg-warning/20 text-warning shadow-[0_0_10px_rgba(226,163,59,0.2)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
