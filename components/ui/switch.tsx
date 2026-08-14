"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Switch({
  className,
  id,
  label,
  description,
  disabled,
  onChange,
  onCheckedChange,
  ...props
}: Omit<React.ComponentProps<"input">, "type" | "size"> & {
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
}) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
    onCheckedChange?.(event.target.checked);
  }

  return (
    <label
      htmlFor={inputId}
      data-slot="switch"
      className={cn(
        "group/switch inline-flex items-center gap-3",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
    >
      <span className="relative inline-flex h-[26px] w-11 shrink-0 items-center">
        <input
          id={inputId}
          type="checkbox"
          role="switch"
          disabled={disabled}
          onChange={handleChange}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full border border-input bg-input/50 transition-colors motion-reduce:transition-none",
            "peer-checked:border-transparent peer-checked:bg-linear-to-r peer-checked:from-primary peer-checked:to-[color-mix(in_oklch,var(--primary),var(--foreground)_12%)]",
            "peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
            "dark:bg-input/30",
          )}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0.5 size-[22px] rounded-full bg-background shadow-sm ring-1 ring-black/5 transition-transform motion-reduce:transition-none peer-checked:translate-x-[18px]"
        />
      </span>
      {(label || description) && (
        <span className="flex flex-col justify-center gap-0.5">
          {label && (
            <span className="text-sm font-medium leading-none">{label}</span>
          )}
          {description && (
            <span className="text-sm text-muted-foreground">{description}</span>
          )}
        </span>
      )}
    </label>
  );
}

export { Switch };
