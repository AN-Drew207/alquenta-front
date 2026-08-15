"use client"

import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function SaveBar({
  visible,
  fieldCount,
  onDiscard,
  onSave,
  saving = false,
  className,
}: {
  visible: boolean
  fieldCount: number
  onDiscard: () => void
  onSave: () => void
  saving?: boolean
  className?: string
}) {
  const t = useTranslations("profile.saveBar")

  return (
    <div
      role="status"
      aria-live="polite"
      data-slot="save-bar"
      data-visible={visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-8 opacity-0",
        className
      )}
    >
      <div className="flex w-full max-w-lg flex-col items-stretch gap-3 rounded-2xl bg-popover/90 p-3 text-popover-foreground shadow-[0_2px_4px_rgba(16,12,8,.05),0_24px_60px_-20px_var(--color-nos-accent-ring)] ring-1 ring-foreground/10 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:py-2 sm:pr-2 sm:pl-4">
        <p className="text-sm font-medium sm:pl-2">
          {t("unsavedChanges", { count: fieldCount })}
        </p>
        <div className="grid grid-cols-[1fr_1.4fr] gap-2 sm:flex sm:shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onDiscard}
            disabled={saving}
          >
            {t("discard")}
          </Button>
          <Button type="button" onClick={onSave} disabled={saving}>
            {saving && <Loader2 className="size-3.5 animate-spin" />}
            {saving ? t("saving") : t("save")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { SaveBar }
