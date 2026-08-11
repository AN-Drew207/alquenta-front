"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useCreatePropertyMutation } from "@/hooks/use-properties";
import { isApiError } from "@/lib/api/client";
import {
  PropertyWizard,
  type PropertyFormSubmitValues,
} from "@/components/properties/property-wizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        toast.error(
          isApiError(error) ? error.message : t("couldNotPublishProperty"),
        );
      },
    });
  }

  return (
    <main className="w-full min-h-[calc(100vh-65px)] flex flex-row items-center justify-center px-4 py-8">
      <Card className="max-w-3xl w-full">
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
    </main>
  );
}
