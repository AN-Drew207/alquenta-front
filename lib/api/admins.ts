import { api } from "./client";
import type { AdminSummary, InviteAdminInput } from "@/types/admin";
import type { Property } from "@/types/property";

export async function fetchAdmins(): Promise<AdminSummary[]> {
  const { data } = await api.get<AdminSummary[]>("/superadmin/admins");
  return data;
}

export async function inviteAdmin(input: InviteAdminInput): Promise<{ inviteUrl: string }> {
  const { data } = await api.post<{ inviteUrl: string }>(
    "/superadmin/admins/invite",
    input,
  );
  return data;
}

export async function disableAdmin(id: string): Promise<void> {
  await api.patch(`/superadmin/admins/${id}/disable`);
}

export async function enableAdmin(id: string): Promise<void> {
  await api.patch(`/superadmin/admins/${id}/enable`);
}

export async function deleteAdmin(id: string): Promise<void> {
  await api.delete(`/superadmin/admins/${id}`);
}

export async function fetchAdminProperties(adminId: string): Promise<Property[]> {
  const { data } = await api.get<Property[]>(`/properties/admin/${adminId}`);
  return data;
}

export async function cancelAdminProperty(propertyId: string): Promise<Property> {
  const { data } = await api.patch<Property>(`/properties/${propertyId}/cancel`);
  return data;
}
