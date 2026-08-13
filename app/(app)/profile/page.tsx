"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUpdateProfileMutation } from "@/hooks/use-auth-mutations";
import { isApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { data: user, isLoading } = useCurrentUser();
  const updateProfileMutation = useUpdateProfileMutation();

  const profileSchema = z.object({
    phone: z.string().optional(),
    showPhoneOnListings: z.boolean(),
  });
  type ProfileFormValues = z.infer<typeof profileSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { phone: "", showPhoneOnListings: false },
  });

  useEffect(() => {
    if (user) {
      reset({
        phone: user.phone ?? "",
        showPhoneOnListings: user.showPhoneOnListings,
      });
    }
  }, [user, reset]);

  function onSubmit(values: ProfileFormValues) {
    updateProfileMutation.mutate(
      {
        phone: values.phone || null,
        showPhoneOnListings: values.showPhoneOnListings,
      },
      {
        onSuccess: () => toast.success(t("profileUpdated")),
        onError: (error) => {
          toast.error(isApiError(error) ? error.message : t("couldNotUpdateProfile"));
        },
      },
    );
  }

  if (isLoading || !user) {
    return (
      <main className="mx-auto w-full max-w-lg px-4 py-8">
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">{t("whatsappLabel")}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t("whatsappPlaceholder")}
                {...register("phone")}
              />
              <p className="text-sm text-muted-foreground">{t("whatsappHint")}</p>
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {user.role === "ADMIN" && (
              <label
                htmlFor="showPhoneOnListings"
                className="flex items-start gap-2 rounded-md border border-border p-3"
              >
                <input
                  id="showPhoneOnListings"
                  type="checkbox"
                  className="mt-0.5 size-4 shrink-0"
                  {...register("showPhoneOnListings")}
                />
                <span className="text-sm">{t("showOnListingsLabel")}</span>
              </label>
            )}

            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? t("saving") : t("save")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
