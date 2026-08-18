import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Generic, content-driven banner — reused unchanged across analytics
 * Fases 2-4, each phase just passes its own copy. Never hardcode
 * phase-specific text in here.
 */
export function TierUpsellBanner({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <Card className="border-2 border-dashed border-primary/25 bg-muted/30">
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="size-5" />
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
