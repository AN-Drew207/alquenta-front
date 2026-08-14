import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function DangerZone({
  className,
  title,
  description,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Card>, "title"> & {
  title: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <Card
      data-slot="danger-zone"
      className={cn("border-destructive/40 ring-destructive/20", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle className="text-destructive">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">{children}</CardContent>
    </Card>
  )
}

export { DangerZone }
