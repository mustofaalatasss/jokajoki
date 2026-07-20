"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-heading font-bold uppercase tracking-widest ring-offset-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-bright focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden clip-slanted",
  {
    variants: {
      variant: {
        default: "bg-red-dark hover:bg-red text-white shadow-[0_0_15px_rgba(226,59,73,0.3)] hover:shadow-[0_0_25px_rgba(226,59,73,0.6)] border border-red-bright/50",
        destructive: "bg-danger text-white hover:bg-danger/90 border border-red-bright/50",
        outline: "border border-red-bright/30 bg-transparent hover:bg-red-dark/20 hover:border-red-bright text-white",
        secondary: "bg-surface-2 text-white hover:bg-surface-3 border border-white/10",
        ghost: "hover:bg-red-dark/20 hover:text-red-bright text-muted hover:border-red-bright/30 border border-transparent",
        link: "text-red underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-10 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref as any}
          {...props}
        />
      )
    }

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...(props as any)}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">{props.children}</span>
        {/* Shimmer effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] hover:animate-[shimmer_1s_forwards]" />
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
