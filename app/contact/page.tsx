import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  const channels = [
    {
      icon: Mail,
      label: t("email"),
      value: "hello@alquenta.example",
      href: "mailto:hello@alquenta.example",
    },
    {
      icon: Phone,
      label: t("phone"),
      value: "+1 (555) 010-1234",
      href: "tel:+15550101234",
    },
    {
      icon: MapPin,
      label: t("address"),
      value: "123 Main St, Remote-first",
      href: undefined,
    },
  ];

  return (
    <main className="mx-auto max-w-2xl flex-1 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-10 space-y-3">
        {channels.map((channel) => (
          <Card key={channel.label}>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <channel.icon className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{channel.label}</p>
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="font-medium hover:text-primary hover:underline"
                  >
                    {channel.value}
                  </a>
                ) : (
                  <p className="font-medium">{channel.value}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
