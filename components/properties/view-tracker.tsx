"use client";

import { useEffect, useRef } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRecordPropertyView } from "@/hooks/use-analytics";

/**
 * Renders nothing — fires a single best-effort view ping on mount. Skips
 * the owner viewing their own listing (client-side-only exclusion,
 * trivially bypassable in incognito — accepted tradeoff, not a bug). Guards
 * against React StrictMode's mount/cleanup/mount dev-only double-invoke
 * with a ref, so the ping only ever fires once per real mount, and waits
 * for the current-user query to resolve before deciding (it's normally
 * already hydrated from app/layout.tsx's server prefetch, but this avoids
 * a race that would otherwise inflate the owner's own view count).
 */
export function ViewTracker({
  propertyId,
  ownerId,
}: {
  propertyId: string;
  ownerId: string;
}) {
  const { data: user, isLoading } = useCurrentUser();
  const recordView = useRecordPropertyView();
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    if (isLoading) return;
    if (user?.id === ownerId) return;

    firedRef.current = true;
    recordView.mutate(propertyId);
    // recordView is a fresh mutation object every render — only the
    // values below should re-trigger this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId, ownerId, user?.id, isLoading]);

  return null;
}
