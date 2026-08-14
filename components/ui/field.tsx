import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

function Field({
  className,
  label,
  htmlFor,
  required,
  hint,
  error,
  labelProps,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  label?: React.ReactNode
  htmlFor?: string
  required?: boolean
  hint?: React.ReactNode
  error?: React.ReactNode
  labelProps?: React.ComponentProps<typeof Label>
}) {
  return (
    <div data-slot="field" className={cn("space-y-1.5", className)} {...props}>
      {label && (
        <Label htmlFor={htmlFor} {...labelProps}>
          {label}
          {required && (
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </Label>
      )}
      {children}
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export { Field }
