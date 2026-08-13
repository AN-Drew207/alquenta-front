import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";
import { AlquentaLogo } from "@/components/layout/alquenta-logo";
import { HouseImagePanel } from "@/components/layout/house-image-panel";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-1">
      <div className="flex w-full flex-col justify-center px-4 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <AlquentaLogo className="mx-auto h-9 w-auto" />
          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>

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
