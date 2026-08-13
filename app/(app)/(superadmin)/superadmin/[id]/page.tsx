"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeft, Ban } from "lucide-react";
import {
  useAdminProperties,
  useAdmins,
  useCancelAdminPropertyMutation,
} from "@/hooks/use-admins";
import { isApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { AdminStatusActions } from "@/components/superadmin/admin-status-actions";
import { useOperationTypeLabels, usePropertyStatusLabels } from "@/lib/i18n/labels";
import { cn } from "@/lib/utils";

export default function SuperAdminAdminDetailPage() {
  const t = useTranslations("superadmin");
  const tCommon = useTranslations("common");
  const format = useFormatter();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: admins, isLoading: isLoadingAdmins } = useAdmins();
  const { data: properties, isLoading: isLoadingProperties } = useAdminProperties(
    params.id,
  );
  const cancelMutation = useCancelAdminPropertyMutation(params.id);
  const propertyStatusLabels = usePropertyStatusLabels();
  const operationTypeLabels = useOperationTypeLabels();

  const admin = admins?.find((item) => item.id === params.id);

  function handleCancel(propertyId: string) {
    cancelMutation.mutate(propertyId, {
      onSuccess: () => toast.success(t("propertyCancelled")),
      onError: (error) =>
        toast.error(isApiError(error) ? error.message : t("couldNotCancelProperty")),
    });
  }

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        nativeButton={false}
        render={<Link href="/superadmin" />}
      >
        <ArrowLeft className="size-4" />
        {t("backToAdmins")}
      </Button>

      {isLoadingAdmins ? (
        <Skeleton className="h-32 w-full" />
      ) : !admin ? (
        <p className="py-12 text-center text-muted-foreground">{t("emptyState")}</p>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl">{admin.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{admin.email}</p>
              </div>
              <AdminStatusActions
                admin={admin}
                onDeleted={() => router.push("/superadmin")}
              />
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-6 text-sm">
            <div>
              <p className="text-muted-foreground">{t("columnPhone")}</p>
              <p className="font-medium">{admin.phone ?? t("phoneNotProvided")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("columnCreatedAt")}</p>
              <p className="font-medium">
                {format.dateTime(new Date(admin.createdAt), { dateStyle: "medium" })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("columnStatus")}</p>
              <Badge variant={admin.deactivatedAt ? "secondary" : "default"}>
                {admin.deactivatedAt ? t("statusDisabled") : t("statusActive")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("propertiesTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingProperties ? (
            <Skeleton className="h-48 w-full" />
          ) : !properties || properties.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              {t("propertiesEmptyState")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("columnProperty")}</TableHead>
                  <TableHead>{t("columnPrice")}</TableHead>
                  <TableHead>{t("columnPropertyStatus")}</TableHead>
                  <TableHead className="text-right">{t("columnActions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <Link
                        href={`/properties/${property.id}`}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <div className="size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                          {property.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1.5 font-medium">
                            {property.title}
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-medium text-white",
                                property.operationType === "RENT"
                                  ? "bg-primary"
                                  : "bg-blue-600",
                              )}
                            >
                              {operationTypeLabels[property.operationType]}
                            </span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {property.municipality}, {property.state}
                          </span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {format.number(property.price, {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={property.status === "AVAILABLE" ? "default" : "secondary"}
                      >
                        {propertyStatusLabels[property.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {property.status === "AVAILABLE" && (
                        <div className="flex justify-end">
                          <AlertDialog>
                            <AlertDialogTrigger
                              render={
                                <Button
                                  variant="destructive"
                                  size="icon-sm"
                                  aria-label={t("cancelProperty")}
                                  title={t("cancelProperty")}
                                />
                              }
                            >
                              <Ban className="size-3.5" />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {t("cancelPropertyConfirmTitle")}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t("cancelPropertyConfirmDescription", {
                                    title: property.title,
                                  })}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancel(property.id)}
                                >
                                  {t("cancelProperty")}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
