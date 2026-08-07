import { api } from "./client";
import type { AuthenticatedUser, LoginInput, RegisterInput } from "@/types/auth";

export async function fetchCurrentUser(): Promise<AuthenticatedUser | null> {
  try {
    const { data } = await api.get<AuthenticatedUser>("/auth/me");
    return data;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      (error as { statusCode: number }).statusCode === 401
    ) {
      return null;
    }
    throw error;
  }
}

export async function register(input: RegisterInput): Promise<AuthenticatedUser> {
  const { data } = await api.post<AuthenticatedUser>("/auth/register", input);
  return data;
}

export async function login(input: LoginInput): Promise<AuthenticatedUser> {
  const { data } = await api.post<AuthenticatedUser>("/auth/login", input);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
