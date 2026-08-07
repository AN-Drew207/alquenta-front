"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProperty, useUpdatePropertyMutation } from "@/hooks/use-properties";
import { isApiError } from "@/lib/api/client";
import {
  PropertyForm,
  type PropertyFormSubmitValues,
} from "@/components/properties/property-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: property, isLoading } = useProperty(params.id);
  const updateMutation = useUpdatePropertyMutation(params.id);

  function handleSubmit(values: PropertyFormSubmitValues) {
    updateMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Property updated");
        router.push("/my-properties");
      },
      onError: (error) => {
        toast.error(isApiError(error) ? error.message : "Could not update property");
      },
    });
  }

  return (
    <main className="mx-auto max-w-2xl flex-1 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit property</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || !property ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <PropertyForm
              defaultProperty={property}
              onSubmit={handleSubmit}
              isSubmitting={updateMutation.isPending}
              showStatus
              submitLabel="Save changes"
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
