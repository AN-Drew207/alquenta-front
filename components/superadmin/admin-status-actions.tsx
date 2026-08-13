"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Ban, CheckCircle2, Trash2 } from "lucide-react";
import {
  useDeleteAdminMutation,
  useDisableAdminMutation,
  useEnableAdminMutation,
} from "@/hooks/use-admins";
import { isApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
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
import type { AdminSummary } from "@/types/admin";

export function AdminStatusActions({
  admin,
  onDeleted,
}: {
  admin: AdminSummary;
  onDeleted?: () => void;
}) {
  const t = useTranslations("superadmin");
  const tCommon = useTranslations("common");
  const disableMutation = useDisableAdminMutation();
  const enableMutation = useEnableAdminMutation();
  const deleteMutation = useDeleteAdminMutation();
  const isActive = !admin.deactivatedAt;

  function handleDisable() {
    disableMutation.mutate(admin.id, {
      onSuccess: () => toast.success(t("adminDisabled")),
      onError: (error) =>
        toast.error(isApiError(error) ? error.message : t("couldNotDisableAdmin")),
    });
  }

  function handleEnable() {
    enableMutation.mutate(admin.id, {
      onSuccess: () => toast.success(t("adminEnabled")),
      onError: (error) =>
        toast.error(isApiError(error) ? error.message : t("couldNotEnableAdmin")),
    });
  }

  function handleDelete() {
    deleteMutation.mutate(admin.id, {
      onSuccess: () => {
        toast.success(t("adminDeleted"));
        onDeleted?.();
      },
      onError: (error) =>
        toast.error(isApiError(error) ? error.message : t("couldNotDeleteAdmin")),
    });
  }

  return (
    <div className="flex justify-end gap-1.5">
      {isActive ? (
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={t("disableAdmin")}
                title={t("disableAdmin")}
              />
            }
          >
            <Ban className="size-3.5" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("disableConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("disableConfirmDescription", { name: admin.name })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDisable}>
                {t("disableAdmin")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={t("enableAdmin")}
                title={t("enableAdmin")}
              />
            }
          >
            <CheckCircle2 className="size-3.5" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("enableConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("enableConfirmDescription", { name: admin.name })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleEnable}>
                {t("enableAdmin")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              variant="destructive"
              size="icon-sm"
              aria-label={t("deleteAdmin")}
              title={t("deleteAdmin")}
            />
          }
        >
          <Trash2 className="size-3.5" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmDescription", { name: admin.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t("deleteAdmin")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
