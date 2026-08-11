import { Handshake, MessagesSquare, Search, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";

const STEP_ICONS = [Search, MessagesSquare, Handshake, ShieldCheck];

export default async function AboutPage() {
  const t = await getTranslations("about");
  const steps = [1, 2, 3, 4].map((n) => ({
    icon: STEP_ICONS[n - 1],
    title: t(`step${n}Title`),
    description: t(`step${n}Description`),
  }));

  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          {t("intro")}
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {steps.map((step) => (
          <Card key={step.title}>
            <CardContent className="flex items-start gap-4 py-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <step.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
