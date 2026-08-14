"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useFormatter, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Trash2 } from "lucide-react";
import {
  useChangePasswordMutation,
  useDeactivateAccountMutation,
  useDeleteAccountMutation,
  useExportAccountDataMutation,
  usePatchProfileMutation,
  useRevokeOtherSessionsMutation,
  useRevokeSessionMutation,
  useSessions,
} from "@/hooks/use-profile";
import { newPasswordSchema } from "@/lib/validations/profile";
import { translateApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DangerZone } from "@/components/ui/danger-zone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { GeneralPrefs, Profile } from "@/types/auth";

function usePasswordSchema(t: ReturnType<typeof useTranslations<"profile">>) {
  return z
    .object({
      currentPassword: z.string().min(1, t("currentPasswordRequired")),
      nextPassword: newPasswordSchema,
      confirmPassword: z.string(),
    })
    .refine((values) => values.nextPassword === values.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    });
}
type PasswordFormValues = z.infer<ReturnType<typeof usePasswordSchema>>;

function ChangePasswordCard() {
  const t = useTranslations("profile");
  const changePasswordMutation = useChangePasswordMutation();
  const passwordSchema = usePasswordSchema(t);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", nextPassword: "", confirmPassword: "" },
  });

  function onSubmit(values: PasswordFormValues) {
    changePasswordMutation.mutate(
      { currentPassword: values.currentPassword, nextPassword: values.nextPassword },
      {
        onSuccess: () => {
          toast.success(t("passwordChanged"));
          reset({ currentPassword: "", nextPassword: "", confirmPassword: "" });
        },
        onError: (error) => {
          toast.error(translateApiError(error, t("couldNotChangePassword")));
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("changePasswordTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">{t("currentPasswordLabel")}</Label>
            <PasswordInput
              id="currentPassword"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-sm text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nextPassword">{t("newPasswordLabel")}</Label>
            <PasswordInput id="nextPassword" {...register("nextPassword")} />
            {errors.nextPassword && (
              <p className="text-sm text-destructive">{errors.nextPassword.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">{t("confirmPasswordLabel")}</Label>
            <PasswordInput
              id="confirmPassword"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? t("saving") : t("save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

const preferencesSchema = z.object({
  locale: z.enum(["es", "en", "pt"]),
  theme: z.enum(["light", "dark", "system"]),
});
type PreferencesFormValues = z.infer<typeof preferencesSchema>;

function PreferencesCard({ profile }: { profile: Profile }) {
  const t = useTranslations("profile");
  const patchProfileMutation = usePatchProfileMutation();
  const { setTheme } = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      locale: profile.generalPrefs.locale,
      theme: profile.generalPrefs.theme,
    },
  });

  useEffect(() => {
    reset({
      locale: profile.generalPrefs.locale,
      theme: profile.generalPrefs.theme,
    });
  }, [profile, reset]);

  const localeLabels: Record<GeneralPrefs["locale"], string> = {
    es: t("localeEs"),
    en: t("localeEn"),
    pt: t("localePt"),
  };
  const themeLabels: Record<GeneralPrefs["theme"], string> = {
    light: t("themeLight"),
    dark: t("themeDark"),
    system: t("themeSystem"),
  };

  function onSubmit(values: PreferencesFormValues) {
    patchProfileMutation.mutate(
      { generalPrefs: values },
      {
        onSuccess: () => {
          toast.success(t("preferencesUpdated"));
          reset(values);
        },
        onError: (error) => {
          toast.error(translateApiError(error, t("couldNotUpdatePreferences")));
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("preferencesTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t("localeLabel")} htmlFor="locale">
              <Controller
                control={control}
                name="locale"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="locale" className="w-full">
                      <SelectValue>
                        {(value: GeneralPrefs["locale"]) => localeLabels[value]}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">{localeLabels.es}</SelectItem>
                      <SelectItem value="en">{localeLabels.en}</SelectItem>
                      <SelectItem value="pt">{localeLabels.pt}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field label={t("themeLabel")} htmlFor="theme">
              <Controller
                control={control}
                name="theme"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value: GeneralPrefs["theme"] | null) => {
                      if (!value) return;
                      field.onChange(value);
                      setTheme(value);
                    }}
                  >
                    <SelectTrigger id="theme" className="w-full">
                      <SelectValue>
                        {(value: GeneralPrefs["theme"]) => themeLabels[value]}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{themeLabels.light}</SelectItem>
                      <SelectItem value="dark">{themeLabels.dark}</SelectItem>
                      <SelectItem value="system">{themeLabels.system}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <Button
            type="submit"
            disabled={!isDirty || patchProfileMutation.isPending}
          >
            {patchProfileMutation.isPending ? t("saving") : t("save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ExportDataCard() {
  const t = useTranslations("profile");
  const exportAccountDataMutation = useExportAccountDataMutation();

  function handleExport() {
    exportAccountDataMutation.mutate(undefined, {
      onSuccess: () => toast.success(t("exportRequested")),
      onError: (error) => {
        toast.error(translateApiError(error, t("couldNotRequestExport")));
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("exportDataTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {t("exportDataDescription")}
        </p>
        <Button
          type="button"
          variant="outline"
          className="shrink-0"
          onClick={handleExport}
          disabled={exportAccountDataMutation.isPending}
        >
          {exportAccountDataMutation.isPending ? t("exporting") : t("exportData")}
        </Button>
      </CardContent>
    </Card>
  );
}

function SessionsCard() {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const format = useFormatter();
  const { data: sessions, isLoading } = useSessions();
  const revokeSessionMutation = useRevokeSessionMutation();
  const revokeOtherSessionsMutation = useRevokeOtherSessionsMutation();

  function handleRevoke(id: string) {
    revokeSessionMutation.mutate(id, {
      onSuccess: () => toast.success(t("sessionRevoked")),
      onError: (error) => {
        toast.error(translateApiError(error, t("couldNotRevokeSession")));
      },
    });
  }

  function handleRevokeOthers() {
    revokeOtherSessionsMutation.mutate(undefined, {
      onSuccess: () => toast.success(t("otherSessionsRevoked")),
      onError: (error) => {
        toast.error(translateApiError(error, t("couldNotRevokeOtherSessions")));
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("sessionsTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : !sessions || sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("sessionsEmpty")}</p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="flex flex-col gap-2 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">
                      {session.userAgent ?? t("unknownDevice")}
                    </span>
                    {session.current && <Badge>{t("thisDevice")}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {session.ip ?? t("unknownIp")} ·{" "}
                    {t("lastActive", {
                      date: format.dateTime(new Date(session.lastActiveAt), {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }),
                    })}
                  </p>
                </div>
                {!session.current && (
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button variant="destructive" size="sm" className="shrink-0" />
                      }
                    >
                      {t("revoke")}
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("revokeSessionConfirmTitle")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("revokeSessionConfirmDescription")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRevoke(session.id)}>
                          {t("revoke")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </li>
            ))}
          </ul>
        )}

        {sessions && sessions.length > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleRevokeOthers}
            disabled={revokeOtherSessionsMutation.isPending}
          >
            {t("signOutOtherDevices")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function DangerZoneCard({ profile }: { profile: Profile }) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const deactivateAccountMutation = useDeactivateAccountMutation();
  const deleteAccountMutation = useDeleteAccountMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const requiredConfirmation = (profile.username || profile.email).toLowerCase();
  const canDelete = confirmationText.trim().toLowerCase() === requiredConfirmation;

  function handleDeactivate() {
    deactivateAccountMutation.mutate(undefined, {
      onSuccess: () => toast.success(t("accountDeactivated")),
      onError: (error) => {
        toast.error(translateApiError(error, t("couldNotDeactivateAccount")));
      },
    });
  }

  function handleDelete() {
    if (!canDelete) return;
    deleteAccountMutation.mutate(confirmationText.trim(), {
      onSuccess: () => toast.success(t("accountDeleted")),
      onError: (error) => {
        toast.error(translateApiError(error, t("couldNotDeleteAccount")));
      },
    });
  }

  return (
    <DangerZone title={t("dangerZoneTitle")}>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive" />}>
          {t("deactivateAccount")}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deactivateConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deactivateConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              disabled={deactivateAccountMutation.isPending}
            >
              {t("deactivateAccount")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setConfirmationText("");
        }}
      >
        <AlertDialogTrigger render={<Button variant="destructive" />}>
          <Trash2 />
          {t("deleteAccount")}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteAccountTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteAccountDescription", { value: requiredConfirmation })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-1.5 px-4">
            <Label htmlFor="deleteConfirmation">
              {t("deleteAccountConfirmLabel")}
            </Label>
            <Input
              id="deleteConfirmation"
              value={confirmationText}
              onChange={(event) => setConfirmationText(event.target.value)}
              placeholder={t("deleteAccountConfirmPlaceholder", {
                value: requiredConfirmation,
              })}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={!canDelete || deleteAccountMutation.isPending}
            >
              {t("deleteAccount")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DangerZone>
  );
}

export function SecuritySection({ profile }: { profile: Profile }) {
  return (
    <div className="space-y-6">
      <ChangePasswordCard />
      <PreferencesCard profile={profile} />
      <ExportDataCard />
      <SessionsCard />
      <DangerZoneCard profile={profile} />
    </div>
  );
}
