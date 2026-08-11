"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatPriceDisplay, parsePriceKeystroke } from "@/lib/format/price"

export interface PriceInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> {
  value: string
  onValueChange: (numeric: string) => void
}

export const PriceInput = React.forwardRef<HTMLInputElement, PriceInputProps>(
  function PriceInput({ value, onValueChange, className, ...props }, ref) {
    const [display, setDisplay] = React.useState(() => formatPriceDisplay(value))
    const lastEmitted = React.useRef(value)

    React.useEffect(() => {
      if (value !== lastEmitted.current) {
        setDisplay(formatPriceDisplay(value))
        lastEmitted.current = value
      }
    }, [value])

    return (
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-2.5 text-sm text-muted-foreground">
          $
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          value={display}
          onChange={(event) => {
            const next = parsePriceKeystroke(event.target.value)
            setDisplay(next.display)
            lastEmitted.current = next.numeric
            onValueChange(next.numeric)
          }}
          className={cn("pl-6", className)}
          {...props}
        />
      </div>
    )
  },
)
