"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "./use-current-user";
import type { Role } from "@/types/enums";

/**
 * Shared gate for route-group layouts: redirects to /login when there's no
 * session, or to / when there is one but it doesn't have the required role.
 * Omit `role` to just require any authenticated user.
 */
export function useRequireRole(role?: Role) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const isAllowed = !!user && (!role || user.role === role);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (role && user.role !== role) {
      router.replace("/");
    }
  }, [user, isLoading, role, router, pathname]);

  return { user, isLoading, isAllowed };
}
