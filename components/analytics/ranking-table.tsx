"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAnalyticsRanking } from "@/hooks/use-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { translateApiError } from "@/lib/api/client";

/**
 * PROFESSIONAL+ only — the parent page decides whether to render this at
 * all based on the admin's plan tier, so the query here always runs.
 * Property title links into the per-property drill-down
 * (/analytics/[propertyId]).
 */
export function RankingTable() {
  const t = useTranslations("analytics");
  const { data: ranking, isLoading, isError, error } = useAnalyticsRanking();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("rankingTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : isError ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {translateApiError(error, t("couldNotLoadRanking"))}
          </p>
        ) : !ranking || ranking.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("rankingEmptyState")}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("rankingColumnProperty")}</TableHead>
                <TableHead className="text-right">
                  {t("rankingColumnViews")}
                </TableHead>
                <TableHead className="text-right">
                  {t("rankingColumnContacts")}
                </TableHead>
                <TableHead className="text-right">
                  {t("rankingColumnConversion")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.map((entry) => (
                <TableRow key={entry.propertyId}>
                  <TableCell className="max-w-64 truncate font-medium whitespace-normal">
                    <Link
                      href={`/analytics/${entry.propertyId}`}
                      className="hover:underline"
                    >
                      {entry.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.totalViews.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.totalContacts.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {(entry.conversionRate * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
