"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  usePatchProfileMutation,
  useRequestEmailChangeMutation,
} from "@/hooks/use-profile";
import { useDirtyState } from "@/hooks/use-dirty-state";
import {
  contactSchema,
  type ContactFormValues,
} from "@/lib/validations/profile";
import { translateApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { SaveBar } from "@/components/ui/save-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/types/auth";

const emailChangeSchema = z.object({
  newEmail: z.email(),
});
type EmailChangeFormValues = z.infer<typeof emailChangeSchema>;

interface ContactSectionProps {
  profile: Profile;
  onDirtyChange?: (dirty: boolean) => void;
}

export function ContactSection({
  profile,
  onDirtyChange,
}: ContactSectionProps) {
  const t = useTranslations("profile");
  const patchProfileMutation = usePatchProfileMutation();
  const requestEmailChangeMutation = useRequestEmailChangeMutation();

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phone: profile.phone ?? "",
      altPhone: profile.altPhone ?? "",
      showWhatsapp: profile.showWhatsapp,
      allowCalls: profile.allowCalls,
      showEmail: profile.showEmail,
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = form;
  const { isDirty, dirtyCount, discard } = useDirtyState(form);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    reset({
      phone: profile.phone ?? "",
      altPhone: profile.altPhone ?? "",
      showWhatsapp: profile.showWhatsapp,
      allowCalls: profile.allowCalls,
      showEmail: profile.showEmail,
    });
  }, [profile, reset]);

  function onSubmit(values: ContactFormValues) {
    const patch: Partial<Profile> = {};
    if (dirtyFields.phone) patch.phone = values.phone;
    if (dirtyFields.altPhone) patch.altPhone = values.altPhone;
    if (dirtyFields.showWhatsapp) patch.showWhatsapp = values.showWhatsapp;
    if (dirtyFields.allowCalls) patch.allowCalls = values.allowCalls;
    if (dirtyFields.showEmail) patch.showEmail = values.showEmail;

    patchProfileMutation.mutate(patch, {
      onSuccess: () => toast.success(t("contactUpdated")),
      onError: (error) => {
        toast.error(translateApiError(error, t("couldNotUpdateContact")));
      },
    });
  }

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    reset: resetEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailChangeFormValues>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: { newEmail: "" },
  });

  function onSubmitEmailChange(values: EmailChangeFormValues) {
    requestEmailChangeMutation.mutate(values.newEmail, {
      onSuccess: () => {
        toast.success(t("emailChangeRequested"));
        resetEmail({ newEmail: "" });
      },
      onError: (error) => {
        toast.error(translateApiError(error, t("couldNotRequestEmailChange")));
      },
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("contactTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field
              label={t("whatsappLabel")}
              htmlFor="phone"
              hint={t("whatsappHint")}
              error={errors.phone?.message}
            >
              <Input
                id="phone"
                type="tel"
                placeholder={t("whatsappPlaceholder")}
                {...register("phone")}
              />
            </Field>

            <Field
              label={t("altPhoneLabel")}
              htmlFor="altPhone"
              error={errors.altPhone?.message}
            >
              <Input
                id="altPhone"
                type="tel"
                placeholder={t("altPhonePlaceholder")}
                {...register("altPhone")}
              />
            </Field>

            <div className="rounded-md border border-border p-3">
              <Switch
                id="showWhatsapp"
                label={t("showOnListingsLabel")}
                {...register("showWhatsapp")}
              />
            </div>

            <div className="rounded-md border border-border p-3">
              <Switch
                id="allowCalls"
                label={t("allowCallsLabel")}
                {...register("allowCalls")}
              />
            </div>

            <div className="rounded-md border border-border p-3">
              <Switch
                id="showEmail"
                label={t("showEmailLabel")}
                {...register("showEmail")}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>{t("verificationTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t("currentEmailLabel")}</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
            <Badge variant={profile.emailVerified ? "default" : "outline"}>
              {profile.emailVerified
                ? t("verifiedBadge")
                : t("notVerifiedBadge")}
            </Badge>
          </div>

          {profile.pendingEmail && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("pendingEmailLabel")}</p>
                <p className="text-sm text-muted-foreground">
                  {profile.pendingEmail}
                </p>
              </div>
              <Badge variant="outline">{t("pendingBadge")}</Badge>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t("idDocumentLabel")}</p>
            </div>
            <Badge variant="muted">{t("idDocumentComingSoon")}</Badge>
          </div>

          <form
            onSubmit={handleSubmitEmail(onSubmitEmailChange)}
            className="space-y-2 border-t border-border pt-4"
          >
            <Field
              label={t("newEmailLabel")}
              htmlFor="newEmail"
              hint={t("emailChangeHint")}
              error={emailErrors.newEmail && t("invalidNewEmail")}
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="newEmail"
                  type="email"
                  placeholder={t("newEmailPlaceholder")}
                  {...registerEmail("newEmail")}
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="h-11"
                  disabled={requestEmailChangeMutation.isPending}
                >
                  {requestEmailChangeMutation.isPending
                    ? t("sendingVerification")
                    : t("sendVerification")}
                </Button>
              </div>
            </Field>
          </form>
        </CardContent>
      </Card> */}

      <SaveBar
        visible={isDirty}
        fieldCount={dirtyCount}
        onDiscard={discard}
        onSave={handleSubmit(onSubmit)}
        saving={patchProfileMutation.isPending}
      />
    </div>
  );
}
