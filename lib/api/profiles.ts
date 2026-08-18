import type { PublicProfile } from "@/types/auth";
import { serverFetch } from "./server-fetch";

export async function fetchPublicProfile(id: string): Promise<PublicProfile | null> {
  const res = await serverFetch(`/api/auth/${id}`, "No se pudo cargar el perfil.");

  if (res.status === 404) {
    return null;
  }

  return res.json();
}
