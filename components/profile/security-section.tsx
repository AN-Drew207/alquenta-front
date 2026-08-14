"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useFormatter, useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import {
  useChangePasswordMutation,
  useDeactivateAccountMutation,
  useDeleteAccountMutation,
  useRevokeOtherSessionsMutation,
  useRevokeSessionMutation,
  useSessions,
} from "@/hooks/use-profile";
import { translateApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { Profile } from "@/types/auth";

const NEW_PASSWORD_MIN_LENGTH = 8;

function usePasswordSchema(t: ReturnType<typeof useTranslations<"profile">>) {
  return z
    .object({
      currentPassword: z.string().min(1, t("currentPasswordRequired")),
      nextPassword: z.string().min(NEW_PASSWORD_MIN_LENGTH, t("newPasswordMinLength")),
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

function TwoFactorCard({ profile }: { profile: Profile }) {
  const t = useTranslations("profile");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("twoFactorTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <label
          htmlFor="twoFactorEnabled"
          className="flex items-start gap-2 rounded-md border border-border p-3 opacity-60"
        >
          <input
            id="twoFactorEnabled"
            type="checkbox"
            className="mt-0.5 size-4 shrink-0"
            checked={profile.twoFactorEnabled}
            disabled
            readOnly
          />
          <span className="text-sm">
            {t("twoFactorLabel")}{" "}
            <span className="text-muted-foreground">({t("comingSoon")})</span>
          </span>
        </label>
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
    <Card className="border-destructive/40 ring-destructive/20">
      <CardHeader>
        <CardTitle className="text-destructive">{t("dangerZoneTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
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
      </CardContent>
    </Card>
  );
}

export function SecuritySection({ profile }: { profile: Profile }) {
  return (
    <div className="space-y-6">
      <ChangePasswordCard />
      <TwoFactorCard profile={profile} />
      <SessionsCard />
      <DangerZoneCard profile={profile} />
    </div>
  );
}
