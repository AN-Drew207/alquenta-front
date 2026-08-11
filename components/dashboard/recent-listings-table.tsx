import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePropertyStatusLabels } from "@/lib/i18n/labels";
import type { Property } from "@/types/property";

const RECENT_LISTINGS_LIMIT = 6;

export function RecentListingsTable({ properties }: { properties: Property[] }) {
  const t = useTranslations("dashboard");
  const tMyProperties = useTranslations("myProperties");
  const format = useFormatter();
  const propertyStatusLabels = usePropertyStatusLabels();

  const recent = [...properties]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, RECENT_LISTINGS_LIMIT);

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
                    <span className="font-medium">{property.title}</span>
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
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={`/my-properties/${property.id}/edit`} />}
                >
                  {tMyProperties("edit")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link
        href="/my-properties"
        className="self-end text-sm text-primary underline-offset-4 hover:underline"
      >
        {t("viewAllProperties")}
      </Link>
    </div>
  );
}
