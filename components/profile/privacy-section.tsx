"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { usePatchProfileMutation } from "@/hooks/use-profile";
import { translateApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Profile, PrivacyPrefs } from "@/types/auth";

const privacySchema = z.object({
  publicProfile: z.boolean(),
  showLocation: z.boolean(),
  showLastSeen: z.boolean(),
  showResponseTime: z.boolean(),
  filterSpam: z.boolean(),
  whoCanMessage: z.enum(["ANYONE", "VERIFIED_EMAIL", "FULLY_VERIFIED"]),
});
type PrivacyFormValues = z.infer<typeof privacySchema>;

function CheckboxRow({
  id,
  label,
  register,
}: {
  id: keyof Omit<PrivacyFormValues, "whoCanMessage">;
  label: string;
  register: ReturnType<typeof useForm<PrivacyFormValues>>["register"];
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-2 rounded-md border border-border p-3"
    >
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 size-4 shrink-0"
        {...register(id)}
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

export function PrivacySection({ profile }: { profile: Profile }) {
  const t = useTranslations("profile");
  const patchProfileMutation = usePatchProfileMutation();

  const { register, control, handleSubmit, reset } = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      publicProfile: true,
      showLocation: true,
      showLastSeen: true,
      showResponseTime: true,
      filterSpam: true,
      whoCanMessage: "ANYONE",
    },
  });

  useEffect(() => {
    const prefs = profile.privacyPrefs;
    reset({
      publicProfile: prefs.publicProfile,
      showLocation: prefs.showLocation,
      showLastSeen: prefs.showLastSeen,
      showResponseTime: prefs.showResponseTime,
      filterSpam: prefs.filterSpam,
      whoCanMessage: prefs.whoCanMessage,
    });
  }, [profile, reset]);

  function onSubmit(values: PrivacyFormValues) {
    const privacyPrefs: PrivacyPrefs = {
      publicProfile: values.publicProfile,
      showLocation: values.showLocation,
      showLastSeen: values.showLastSeen,
      showResponseTime: values.showResponseTime,
      filterSpam: values.filterSpam,
      whoCanMessage: values.whoCanMessage,
    };

    patchProfileMutation.mutate(
      { privacyPrefs },
      {
        onSuccess: () => toast.success(t("privacyUpdated")),
        onError: (error) => {
          toast.error(translateApiError(error, t("couldNotUpdatePrivacy")));
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("privacyTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <CheckboxRow
              id="publicProfile"
              label={t("publicProfileLabel")}
              register={register}
            />
            <CheckboxRow id="showLocation" label={t("showLocationLabel")} register={register} />
            <CheckboxRow id="showLastSeen" label={t("showLastSeenLabel")} register={register} />
            <CheckboxRow
              id="showResponseTime"
              label={t("showResponseTimeLabel")}
              register={register}
            />
            <CheckboxRow id="filterSpam" label={t("filterSpamLabel")} register={register} />
          </div>

          <div className="space-y-1.5">
            <Label>{t("whoCanMessageLabel")}</Label>
            <Controller
              control={control}
              name="whoCanMessage"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value: PrivacyFormValues["whoCanMessage"]) =>
                        t(`whoCanMessage${value}`)
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ANYONE">{t("whoCanMessageANYONE")}</SelectItem>
                    <SelectItem value="VERIFIED_EMAIL">
                      {t("whoCanMessageVERIFIED_EMAIL")}
                    </SelectItem>
                    <SelectItem value="FULLY_VERIFIED">
                      {t("whoCanMessageFULLY_VERIFIED")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Button type="submit" disabled={patchProfileMutation.isPending}>
            {patchProfileMutation.isPending ? t("saving") : t("save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
