import { Building2, Handshake, MessagesSquare, Search, ShieldCheck, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { AlquentaLogo } from "@/components/layout/alquenta-logo";

const STEP_ICONS = [Search, MessagesSquare, Handshake, ShieldCheck];

export default async function AboutPage() {
  const t = await getTranslations("about");
  const steps = [1, 2, 3, 4].map((n) => ({
    icon: STEP_ICONS[n - 1],
    title: t(`step${n}Title`),
    description: t(`step${n}Description`),
  }));
  const roles = [
    { icon: Building2, title: t("forOwnersTitle"), description: t("forOwnersDescription") },
    { icon: Users, title: t("forClientsTitle"), description: t("forClientsDescription") },
  ];

  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-12">
      <div className="text-center">
        <AlquentaLogo className="mx-auto h-9 w-auto" />
        <h1 className="mt-6 text-3xl font-bold">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          {t("intro")}
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {roles.map((role) => (
          <Card key={role.title}>
            <CardContent className="flex items-start gap-4 py-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <role.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold">{role.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {role.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mt-16 text-center text-xl font-semibold">
        {t("howItWorksTitle")}
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
