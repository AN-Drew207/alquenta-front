"use client";

import { useRequireRole } from "@/hooks/use-require-role";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAllowed } = useRequireRole();

  if (!isAllowed) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Skeleton className="h-64 w-full" />
      </main>
    );
  }

  return <>{children}</>;
}
