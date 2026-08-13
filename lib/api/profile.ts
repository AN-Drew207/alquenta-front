import { api } from "./client";
import type { Profile, Session } from "@/types/auth";

export async function fetchMyFullProfile(): Promise<Profile> {
  const { data } = await api.get<Profile>("/profile");
  return data;
}

export async function patchProfile(input: Partial<Profile>): Promise<Profile> {
  const { data } = await api.patch<Profile>("/profile", input);
  return data;
}

export async function checkUsernameAvailability(
  value: string,
): Promise<{ available: boolean }> {
  const { data } = await api.get<{ available: boolean }>(
    "/profile/username-availability",
    { params: { value } },
  );
  return data;
}

export async function requestEmailChange(newEmail: string): Promise<void> {
  await api.post("/profile/email", { newEmail });
}

export async function confirmEmailChange(token: string): Promise<Profile> {
  const { data } = await api.get<Profile>("/profile/email/confirm", {
    params: { token },
  });
  return data;
}

export async function changePassword(input: {
  currentPassword: string;
  nextPassword: string;
}): Promise<void> {
  await api.patch("/account/password", input);
}

export async function fetchSessions(): Promise<Session[]> {
  const { data } = await api.get<Session[]>("/account/sessions");
  return data;
}

export async function revokeSession(id: string): Promise<void> {
  await api.delete(`/account/sessions/${id}`);
}

export async function revokeOtherSessions(): Promise<void> {
  await api.delete("/account/sessions");
}

export async function deactivateAccount(): Promise<void> {
  await api.post("/account/deactivate");
}

export async function deleteAccount(confirmation: string): Promise<void> {
  await api.delete("/account", { data: { confirmation } });
}
