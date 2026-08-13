"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { usePatchProfileMutation, useRequestEmailChangeMutation } from "@/hooks/use-profile";
import { isApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/types/auth";

const contactSchema = z.object({
  phone: z.string().optional(),
  altPhone: z.string().optional(),
  showPhoneOnListings: z.boolean(),
  allowCalls: z.boolean(),
  showEmail: z.boolean(),
});
type ContactFormValues = z.infer<typeof contactSchema>;

const emailChangeSchema = z.object({
  newEmail: z.email(),
});
type EmailChangeFormValues = z.infer<typeof emailChangeSchema>;

export function ContactSection({ profile }: { profile: Profile }) {
  const t = useTranslations("profile");
  const patchProfileMutation = usePatchProfileMutation();
  const requestEmailChangeMutation = useRequestEmailChangeMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phone: "",
      altPhone: "",
      showPhoneOnListings: false,
      allowCalls: false,
      showEmail: false,
    },
  });

  useEffect(() => {
    reset({
      phone: profile.phone ?? "",
      altPhone: profile.altPhone ?? "",
      showPhoneOnListings: profile.showPhoneOnListings,
      allowCalls: profile.allowCalls,
      showEmail: profile.showEmail,
    });
  }, [profile, reset]);

  function onSubmit(values: ContactFormValues) {
    patchProfileMutation.mutate(
      {
        phone: values.phone || null,
        altPhone: values.altPhone || null,
        showPhoneOnListings: values.showPhoneOnListings,
        allowCalls: values.allowCalls,
        showEmail: values.showEmail,
      },
      {
        onSuccess: () => toast.success(t("contactUpdated")),
        onError: (error) => {
          toast.error(isApiError(error) ? error.message : t("couldNotUpdateContact"));
        },
      },
    );
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
        toast.error(
          isApiError(error) ? error.message : t("couldNotRequestEmailChange"),
        );
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

            <div className="space-y-1.5">
              <Label htmlFor="altPhone">{t("altPhoneLabel")}</Label>
              <Input
                id="altPhone"
                type="tel"
                placeholder={t("altPhonePlaceholder")}
                {...register("altPhone")}
              />
            </div>

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

            <label
              htmlFor="allowCalls"
              className="flex items-start gap-2 rounded-md border border-border p-3"
            >
              <input
                id="allowCalls"
                type="checkbox"
                className="mt-0.5 size-4 shrink-0"
                {...register("allowCalls")}
              />
              <span className="text-sm">{t("allowCallsLabel")}</span>
            </label>

            <label
              htmlFor="showEmail"
              className="flex items-start gap-2 rounded-md border border-border p-3"
            >
              <input
                id="showEmail"
                type="checkbox"
                className="mt-0.5 size-4 shrink-0"
                {...register("showEmail")}
              />
              <span className="text-sm">{t("showEmailLabel")}</span>
            </label>

            <Button type="submit" disabled={patchProfileMutation.isPending}>
              {patchProfileMutation.isPending ? t("saving") : t("save")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
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
              {profile.emailVerified ? t("verifiedBadge") : t("notVerifiedBadge")}
            </Badge>
          </div>

          {profile.pendingEmail && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("pendingEmailLabel")}</p>
                <p className="text-sm text-muted-foreground">{profile.pendingEmail}</p>
              </div>
              <Badge variant="outline">{t("pendingBadge")}</Badge>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t("whatsappLabel")}</p>
              <p className="text-sm text-muted-foreground">
                {profile.phone || t("noneSet")}
              </p>
            </div>
            <Badge variant={profile.phoneVerified ? "default" : "outline"}>
              {profile.phoneVerified ? t("verifiedBadge") : t("notVerifiedBadge")}
            </Badge>
          </div>

          <form
            onSubmit={handleSubmitEmail(onSubmitEmailChange)}
            className="space-y-2 border-t border-border pt-4"
          >
            <Label htmlFor="newEmail">{t("newEmailLabel")}</Label>
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
                disabled={requestEmailChangeMutation.isPending}
              >
                {requestEmailChangeMutation.isPending
                  ? t("sendingVerification")
                  : t("sendVerification")}
              </Button>
            </div>
            {emailErrors.newEmail && (
              <p className="text-sm text-destructive">{t("invalidNewEmail")}</p>
            )}
            <p className="text-sm text-muted-foreground">{t("emailChangeHint")}</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
