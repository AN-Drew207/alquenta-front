"use client";

import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useCancelPropertyMutation,
  useMarkPropertyAsRentedOrSoldMutation,
} from "@/hooks/use-properties";
import { translateApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useOperationTypeLabels, usePropertyStatusLabels } from "@/lib/i18n/labels";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";

export function MyPropertyCard({ property }: { property: Property }) {
  const t = useTranslations("myProperties");
  const tCommon = useTranslations("common");
  const tHome = useTranslations("home");
  const format = useFormatter();
  const operationTypeLabels = useOperationTypeLabels();
  const propertyStatusLabels = usePropertyStatusLabels();
  const cancelMutation = useCancelPropertyMutation();
  const markAsRentedOrSoldMutation = useMarkPropertyAsRentedOrSoldMutation();
  const cover = property.images[0];

  function handleCancel() {
    cancelMutation.mutate(property.id, {
      onSuccess: () => toast.success(t("propertyCancelled")),
      onError: (error) =>
        toast.error(translateApiError(error, t("couldNotCancelProperty"))),
    });
  }

  const isSale = property.operationType === "SALE";
  const markAsRentedOrSoldLabel = isSale ? t("markAsSold") : t("markAsRented");

  function handleMarkAsRentedOrSold() {
    markAsRentedOrSoldMutation.mutate(property.id, {
      onSuccess: () =>
        toast.success(isSale ? t("propertyMarkedAsSold") : t("propertyMarkedAsRented")),
      onError: (error) =>
        toast.error(
          translateApiError(error, t("couldNotMarkAsRentedOrSold")),
        ),
    });
  }

  return (
    <div className="flex h-full flex-col gap-0 rounded-2xl border border-border bg-card p-1.5">
      <Link href={`/properties/${property.id}`} className="relative block">
        <div className="aspect-4/3 w-full overflow-hidden rounded-xl bg-muted">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              {tHome("noImage")}
            </div>
          )}
        </div>
        <span
          className={cn(
            "absolute top-2.5 right-2.5 rounded-full px-3 py-1.5 text-xs font-medium text-white",
            property.operationType === "RENT" ? "bg-primary" : "bg-blue-600",
          )}
        >
          {operationTypeLabels[property.operationType]}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 px-2.5 pt-5 pb-2.5">
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <Link
                href={`/properties/${property.id}`}
                className="text-base leading-tight font-medium hover:underline"
              >
                {property.title}
              </Link>
              <span className="text-xs text-muted-foreground">
                {property.municipality}, {property.state}
              </span>
            </div>
            <Badge
              variant={property.status === "AVAILABLE" ? "default" : "secondary"}
              className="shrink-0"
            >
              {propertyStatusLabels[property.status]}
            </Badge>
          </div>

          <span className="text-xl font-bold tracking-wide text-foreground">
            {format.number(property.price, {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          </span>
        </div>

        <div className="flex gap-2">
          {property.status === "RENTED_OR_SOLD" ? (
            <p className="text-sm text-muted-foreground">
              {t("finalizedNotice")}
            </p>
          ) : (
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href={`/my-properties/${property.id}/edit`} />}
              className="flex-1"
            >
              {t("edit")}
            </Button>
          )}
          {property.status !== "CANCELLED" && property.status !== "RENTED_OR_SOLD" && (
            <AlertDialog key="cancel">
              <AlertDialogTrigger render={<Button variant="destructive" size="sm" className="flex-1" />}>
                {t("cancelListing")}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("cancelConfirmTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("cancelConfirmDescription", { title: property.title })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel}>
                    {t("cancelListing")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {property.status === "AVAILABLE" && (
            <AlertDialog key="mark-rented-sold">
              <AlertDialogTrigger
                render={<Button variant="outline" size="sm" className="flex-1" />}
              >
                {markAsRentedOrSoldLabel}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {isSale ? t("markAsSoldConfirmTitle") : t("markAsRentedConfirmTitle")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("markAsRentedOrSoldConfirmDescription", {
                      title: property.title,
                    })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleMarkAsRentedOrSold}>
                    {markAsRentedOrSoldLabel}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
