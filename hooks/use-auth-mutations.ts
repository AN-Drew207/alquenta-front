"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  acceptAdminInvitation,
  login,
  logout,
  reactivateAccount,
  register,
  updateProfile,
} from "@/lib/api/auth";
import type {
  AuthenticatedUser,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "@/types/auth";
import type { AcceptAdminInvitationInput } from "@/types/admin";
import { CURRENT_USER_QUERY_KEY } from "./use-current-user";

export function defaultRouteForRole(role: AuthenticatedUser["role"]): string {
  if (role === "SUPERADMIN") return "/superadmin";
  if (role === "ADMIN") return "/dashboard";
  return "/";
}

function redirectAfterAuth(
  router: ReturnType<typeof useRouter>,
  user: AuthenticatedUser,
  redirectTo?: string,
) {
  router.push(redirectTo || defaultRouteForRole(user.role));
}

// Identity-establishing mutations (login/register/reactivate/invite-accept)
// all clear the cache before seeding the new user: without it, any data
// cached under a previous session in this same tab (profile, avatar,
// favorites, notifications...) keeps rendering under the new account until
// each query happens to refetch on its own. setQueryData with the response
// we already have avoids an extra round trip to /auth/me for the common
// case, unlike invalidateQueries.
export function useLoginMutation(redirectTo?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (user) => {
      queryClient.clear();
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
      redirectAfterAuth(router, user, redirectTo);
    },
  });
}

export function useReactivateAccountMutation(redirectTo?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: LoginInput) => reactivateAccount(input),
    onSuccess: (user) => {
      queryClient.clear();
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
      redirectAfterAuth(router, user, redirectTo);
    },
  });
}

export function useRegisterMutation(redirectTo?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: (user) => {
      queryClient.clear();
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
      redirectAfterAuth(router, user, redirectTo);
    },
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
    onSuccess: (user) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
    },
  });
}

export function useAcceptAdminInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AcceptAdminInvitationInput) => acceptAdminInvitation(input),
    onSuccess: (user) => {
      queryClient.clear();
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
      router.push("/");
    },
  });
}
