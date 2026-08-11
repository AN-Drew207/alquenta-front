"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useTranslations, useFormatter } from "next-intl";
import {
  useMyProperties,
  useDeletePropertyMutation,
  useCancelPropertyMutation,
} from "@/hooks/use-properties";
import { isApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { usePropertyStatusLabels, usePropertyTypeLabels } from "@/lib/i18n/labels";

export default function MyPropertiesPage() {
  const t = useTranslations("myProperties");
  const tCommon = useTranslations("common");
  const format = useFormatter();
  const propertyTypeLabels = usePropertyTypeLabels();
  const propertyStatusLabels = usePropertyStatusLabels();
  const { data: properties, isLoading } = useMyProperties();
  const deleteMutation = useDeletePropertyMutation();
  const cancelMutation = useCancelPropertyMutation();

  function handleDelete(id: string) {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success(t("propertyDeleted")),
      onError: (error) =>
        toast.error(isApiError(error) ? error.message : t("couldNotDeleteProperty")),
    });
  }

  function handleCancel(id: string) {
    cancelMutation.mutate(id, {
      onSuccess: () => toast.success(t("propertyCancelled")),
      onError: (error) =>
        toast.error(isApiError(error) ? error.message : t("couldNotCancelProperty")),
    });
  }

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button nativeButton={false} render={<Link href="/my-properties/new" />}>
          {t("publishProperty")}
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : !properties || properties.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">{t("emptyState")}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columnTitle")}</TableHead>
              <TableHead>{t("columnType")}</TableHead>
              <TableHead>{t("columnLocation")}</TableHead>
              <TableHead>{t("columnPrice")}</TableHead>
              <TableHead>{t("columnStatus")}</TableHead>
              <TableHead className="text-right">{t("columnActions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">
                  <Link href={`/properties/${property.id}`} className="hover:underline">
                    {property.title}
                  </Link>
                </TableCell>
                <TableCell>{propertyTypeLabels[property.type]}</TableCell>
                <TableCell>
                  {property.municipality}, {property.state}
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
                    variant={
                      property.status === "AVAILABLE" ? "default" : "secondary"
                    }
                  >
                    {propertyStatusLabels[property.status]}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-2 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`/my-properties/${property.id}/edit`} />}
                  >
                    {t("edit")}
                  </Button>
                  {property.status === "CANCELLED" ? (
                    <AlertDialog>
                      <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
                        {t("delete")}
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("deleteConfirmDescription", { title: property.title })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(property.id)}>
                            {t("delete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
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
                          <AlertDialogAction onClick={() => handleCancel(property.id)}>
                            {t("cancelListing")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
