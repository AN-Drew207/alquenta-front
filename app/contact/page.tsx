import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactHero } from "@/components/contact/contact-hero";
import { HouseImagePanel } from "@/components/layout/house-image-panel";
import { AuroraBackground } from "@/components/nosotros/aurora-background";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-1">
      <div className="relative isolate flex w-full flex-col justify-center overflow-hidden px-4 py-12 lg:w-1/2 lg:px-16">
        <AuroraBackground />

        <div className="relative z-[2] mx-auto w-full max-w-md">
          <ContactHero />

          <Card className="mt-10 ring-0 shadow-none">
            <CardHeader>
              <CardTitle>{t("formTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>

      <HouseImagePanel className="hidden w-1/2 lg:block" />
    </main>
  );
}
