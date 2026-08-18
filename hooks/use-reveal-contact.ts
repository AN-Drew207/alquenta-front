"use client";

import { useMutation } from "@tanstack/react-query";
import { revealPropertyContact } from "@/lib/api/properties";

export function useRevealContactMutation() {
  return useMutation({
    mutationFn: ({ propertyId, token }: { propertyId: string; token: string }) =>
      revealPropertyContact(propertyId, token),
  });
}
