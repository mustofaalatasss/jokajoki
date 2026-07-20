import * as React from "react"
import { cn } from "@/lib/utils"
import { Minus, Plus } from "lucide-react"

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function NumberInput({ 
  className, 
  value, 
  onChange, 
  min = 1, 
  max = 10,
  ...props 
}: NumberInputProps) {
  
  const handleDecrement = () => {
    if (value > min) onChange(value - 1)
  }

  const handleIncrement = () => {
    if (value < max) onChange(value + 1)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    if (!isNaN(val)) {
      if (val >= min && val <= max) {
        onChange(val)
      } else if (val > max) {
        onChange(max)
      } else if (val < min) {
        onChange(min)
      }
    } else {
      onChange(min) // Fallback for invalid input
    }
  }

  return (
    <div className={cn("flex h-12 w-full border-b-2 border-l border-r border-t border-[var(--border-default)] border-b-[var(--border-strong)] bg-[var(--input-bg)] clip-slanted", className)}>
      <button 
        type="button" 
        onClick={handleDecrement}
        disabled={value <= min}
        className="flex h-full w-10 items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] disabled:opacity-50 disabled:hover:bg-transparent transition-colors focus:outline-none focus-visible:bg-[var(--surface-hover)]"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        className="flex h-full w-full bg-transparent px-2 text-center text-sm text-[var(--text-primary)] font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        {...props}
      />
      <button 
        type="button" 
        onClick={handleIncrement}
        disabled={value >= max}
        className="flex h-full w-10 items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] disabled:opacity-50 disabled:hover:bg-transparent transition-colors focus:outline-none focus-visible:bg-[var(--surface-hover)]"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
