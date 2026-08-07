"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreatePropertyMutation } from "@/hooks/use-properties";
import { isApiError } from "@/lib/api/client";
import {
  PropertyForm,
  type PropertyFormSubmitValues,
} from "@/components/properties/property-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPropertyPage() {
  const router = useRouter();
  const createMutation = useCreatePropertyMutation();

  function handleSubmit(values: PropertyFormSubmitValues) {
    createMutation.mutate(values, {
      onSuccess: (property) => {
        toast.success("Property published");
        router.push(`/properties/${property.id}`);
      },
      onError: (error) => {
        toast.error(isApiError(error) ? error.message : "Could not publish property");
      },
    });
  }

  return (
    <main className="mx-auto max-w-2xl flex-1 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Publish a property</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyForm
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending}
            submitLabel="Publish"
          />
        </CardContent>
      </Card>
    </main>
  );
}
