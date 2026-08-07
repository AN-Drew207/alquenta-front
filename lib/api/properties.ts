import { api } from "./client";
import type {
  CreatePropertyInput,
  Property,
  PropertyFilters,
  UpdatePropertyInput,
} from "@/types/property";

export async function fetchPublicProperties(
  filters: PropertyFilters = {},
): Promise<Property[]> {
  const { data } = await api.get<Property[]>("/properties", { params: filters });
  return data;
}

export async function fetchProperty(id: string): Promise<Property> {
  const { data } = await api.get<Property>(`/properties/${id}`);
  return data;
}

export async function fetchMyProperties(): Promise<Property[]> {
  const { data } = await api.get<Property[]>("/properties/mine");
  return data;
}

export async function createProperty(input: CreatePropertyInput): Promise<Property> {
  const { data } = await api.post<Property>("/properties", input);
  return data;
}

export async function updateProperty(
  id: string,
  input: UpdatePropertyInput,
): Promise<Property> {
  const { data } = await api.patch<Property>(`/properties/${id}`, input);
  return data;
}

export async function deleteProperty(id: string): Promise<void> {
  await api.delete(`/properties/${id}`);
}
