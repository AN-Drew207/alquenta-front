import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function WizardStepsIndicator({
  steps,
  currentStep,
}: {
  steps: readonly string[];
  currentStep: number;
}) {
  return (
    <ol className="flex w-full items-start">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isFirst = index === 0;
        const isLast = index === steps.length - 1;
        const prevIsCompleted = index - 1 < currentStep;
        return (
          <li key={label} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div
                className={cn(
                  "h-px flex-1",
                  isFirst ? "invisible" : prevIsCompleted ? "bg-primary" : "bg-border",
                )}
              />
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary text-primary",
                  !isCompleted && !isCurrent && "border-border text-muted-foreground",
                )}
              >
                {isCompleted ? <Check className="size-4" /> : index + 1}
              </div>
              <div
                className={cn(
                  "h-px flex-1",
                  isLast ? "invisible" : isCompleted ? "bg-primary" : "bg-border",
                )}
              />
            </div>
            <span
              className={cn(
                "mt-1.5 text-xs whitespace-nowrap",
                isCurrent ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
