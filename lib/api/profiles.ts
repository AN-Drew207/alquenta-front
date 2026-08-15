import type { PublicProfile } from "@/types/auth";
import { API_URL } from "@/lib/env";

export async function fetchPublicProfile(id: string): Promise<PublicProfile | null> {
  const res = await fetch(`${API_URL}/api/auth/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error("Failed to load profile");
  }

  return res.json();
}
