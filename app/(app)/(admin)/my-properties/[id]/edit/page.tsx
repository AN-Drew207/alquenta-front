"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useProperty, useUpdatePropertyMutation } from "@/hooks/use-properties";
import { translateApiError } from "@/lib/api/client";
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

  useEffect(() => {
    if (property?.status === "RENTED_OR_SOLD") {
      toast.error(t("finalizedNotice"));
      router.replace("/my-properties");
    }
  }, [property?.status, router, t]);

  function handleSubmit(values: PropertyFormSubmitValues) {
    updateMutation.mutate(values, {
      onSuccess: () => {
        toast.success(t("propertyUpdated"));
        router.push("/my-properties");
      },
      onError: (error) => {
        toast.error(translateApiError(error, t("couldNotUpdateProperty")));
      },
    });
  }

  return (
    <main className="w-full min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <BackButton className="mb-4" />
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t("editTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading || !property || property.status === "RENTED_OR_SOLD" ? (
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
      </div>
    </main>
  );
}
