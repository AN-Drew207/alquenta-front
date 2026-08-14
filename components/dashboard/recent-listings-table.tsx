import { useMemo, useState } from "react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Ban, Handshake, Pencil, Search } from "lucide-react";
import {
  useCancelPropertyMutation,
  useMarkPropertyAsRentedOrSoldMutation,
} from "@/hooks/use-properties";
import { translateApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useOperationTypeLabels, usePropertyStatusLabels } from "@/lib/i18n/labels";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";

const RECENT_LISTINGS_LIMIT = 6;

export function RecentListingsTable({ properties }: { properties: Property[] }) {
  const t = useTranslations("dashboard");
  const tMyProperties = useTranslations("myProperties");
  const tCommon = useTranslations("common");
  const format = useFormatter();
  const propertyStatusLabels = usePropertyStatusLabels();
  const operationTypeLabels = useOperationTypeLabels();
  const cancelMutation = useCancelPropertyMutation();
  const markAsRentedOrSoldMutation = useMarkPropertyAsRentedOrSoldMutation();

  function handleCancel(id: string) {
    cancelMutation.mutate(id, {
      onSuccess: () => toast.success(tMyProperties("propertyCancelled")),
      onError: (error) =>
        toast.error(translateApiError(error, tMyProperties("couldNotCancelProperty"))),
    });
  }

  function handleMarkAsRentedOrSold(id: string) {
    markAsRentedOrSoldMutation.mutate(id, {
      onSuccess: () => toast.success(tMyProperties("propertyMarkedAsRentedOrSold")),
      onError: (error) =>
        toast.error(
          translateApiError(error, tMyProperties("couldNotMarkAsRentedOrSold")),
        ),
    });
  }

  const [search, setSearch] = useState("");

  const sorted = useMemo(
    () =>
      [...properties].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [properties],
  );

  const query = search.trim().toLowerCase();
  const recent = query
    ? sorted.filter((property) => property.title.toLowerCase().includes(query))
    : sorted.slice(0, RECENT_LISTINGS_LIMIT);

  if (properties.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        {t("emptyState")}{" "}
        <Link href="/my-properties/new" className="text-primary underline-offset-4 hover:underline">
          {t("publishFirstOne")}
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={tMyProperties("searchPlaceholder")}
          className="pl-9"
        />
      </div>

      {recent.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          {tMyProperties("noSearchResults")}
        </p>
      ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{tMyProperties("columnTitle")}</TableHead>
            <TableHead>{tMyProperties("columnPrice")}</TableHead>
            <TableHead>{tMyProperties("columnStatus")}</TableHead>
            <TableHead className="text-right">{tMyProperties("columnActions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recent.map((property) => (
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
                          property.operationType === "RENT" ? "bg-primary" : "bg-blue-600",
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
                <Badge variant={property.status === "AVAILABLE" ? "default" : "secondary"}>
                  {propertyStatusLabels[property.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1.5">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    nativeButton={false}
                    render={<Link href={`/my-properties/${property.id}/edit`} />}
                    aria-label={tMyProperties("edit")}
                    title={tMyProperties("edit")}
                  >
                    <Pencil className="size-3.5" />
                  </Button>

                  {property.status === "AVAILABLE" && (
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="outline"
                            size="icon-sm"
                            aria-label={tMyProperties("markAsRentedOrSold")}
                            title={tMyProperties("markAsRentedOrSold")}
                          />
                        }
                      >
                        <Handshake className="size-3.5" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {tMyProperties("markAsRentedOrSoldConfirmTitle")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {tMyProperties("markAsRentedOrSoldConfirmDescription", {
                              title: property.title,
                            })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleMarkAsRentedOrSold(property.id)}
                          >
                            {tMyProperties("markAsRentedOrSold")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {property.status !== "CANCELLED" && (
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            aria-label={tMyProperties("cancelListing")}
                            title={tMyProperties("cancelListing")}
                          />
                        }
                      >
                        <Ban className="size-3.5" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {tMyProperties("cancelConfirmTitle")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {tMyProperties("cancelConfirmDescription", {
                              title: property.title,
                            })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleCancel(property.id)}>
                            {tMyProperties("cancelListing")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}
      <Link
        href="/my-properties"
        className="self-end text-sm text-primary underline-offset-4 hover:underline"
      >
        {t("viewAllProperties")}
      </Link>
    </div>
  );
}
