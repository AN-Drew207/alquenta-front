"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useCreatePropertyMutation } from "@/hooks/use-properties";
import { translateApiError } from "@/lib/api/client";
import {
  PropertyWizard,
  type PropertyFormSubmitValues,
} from "@/components/properties/property-wizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";

export default function NewPropertyPage() {
  const t = useTranslations("myProperties");
  const router = useRouter();
  const createMutation = useCreatePropertyMutation();

  function handleSubmit(values: PropertyFormSubmitValues) {
    createMutation.mutate(values, {
      onSuccess: (property) => {
        toast.success(t("propertyPublished"));
        router.push(`/properties/${property.id}`);
      },
      onError: (error) => {
        toast.error(translateApiError(error, t("couldNotPublishProperty")));
      },
    });
  }

  return (
    <main className="w-full min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <BackButton className="mb-4" label={t("backToHome")} />
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t("newTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyWizard
              onSubmit={handleSubmit}
              isSubmitting={createMutation.isPending}
              submitLabel={t("publish")}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
