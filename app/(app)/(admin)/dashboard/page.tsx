"use client";

import Link from "next/link";
import { Building2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useMyProperties } from "@/hooks/use-properties";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: properties, isLoading } = useMyProperties();

  const total = properties?.length ?? 0;
  const available = properties?.filter((p) => p.status === "AVAILABLE").length ?? 0;
  const rentedOrSold =
    properties?.filter((p) => p.status === "RENTED_OR_SOLD").length ?? 0;
  const cancelled = properties?.filter((p) => p.status === "CANCELLED").length ?? 0;

  const stats = [
    { label: "Total listings", value: total, icon: Building2 },
    { label: "Available", value: available, icon: CheckCircle2 },
    { label: "Rented / Sold", value: rentedOrSold, icon: Clock },
    { label: "Cancelled", value: cancelled, icon: XCircle },
  ];

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your property listings.
          </p>
        </div>
        <Button render={<Link href="/my-properties/new" />}>
          Publish a property
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && total === 0 && (
        <p className="mt-8 text-center text-muted-foreground">
          You haven&apos;t published any properties yet.{" "}
          <Link href="/my-properties/new" className="text-primary underline-offset-4 hover:underline">
            Publish your first one
          </Link>
          .
        </p>
      )}
    </main>
  );
}
