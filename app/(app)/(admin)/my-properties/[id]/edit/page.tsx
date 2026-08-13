"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useProperty, useUpdatePropertyMutation } from "@/hooks/use-properties";
import { isApiError } from "@/lib/api/client";
import {
  PropertyWizard,
  type PropertyFormSubmitValues,
} from "@/components/properties/property-wizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/ui/back-button";

export default function EditPropertyPage() {
  const t = useTranslations("myProperties");
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: property, isLoading } = useProperty(params.id);
  const updateMutation = useUpdatePropertyMutation(params.id);

  function handleSubmit(values: PropertyFormSubmitValues) {
    updateMutation.mutate(values, {
      onSuccess: () => {
        toast.success(t("propertyUpdated"));
        router.push("/my-properties");
      },
      onError: (error) => {
        toast.error(isApiError(error) ? error.message : t("couldNotUpdateProperty"));
      },
    });
  }

  return (
    <main className="mx-auto max-w-5xl flex-1 px-4 py-8">
      <BackButton className="mb-4" />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("editTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || !property ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <PropertyWizard
              defaultProperty={property}
              onSubmit={handleSubmit}
              isSubmitting={updateMutation.isPending}
              showStatus
              submitLabel={t("saveChanges")}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
