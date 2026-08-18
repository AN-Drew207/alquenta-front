import { api } from "./client";
import type { Property } from "@/types/property";

export async function fetchFavorites(): Promise<Property[]> {
  const { data } = await api.get<Property[]>("/favorites");
  return data;
}

export async function fetchFavoriteIds(): Promise<string[]> {
  const { data } = await api.get<string[]>("/favorites/ids");
  return data;
}

export async function addFavorite(propertyId: string): Promise<void> {
  await api.post(`/favorites/${propertyId}`);
}

export async function removeFavorite(propertyId: string): Promise<void> {
  await api.delete(`/favorites/${propertyId}`);
}
