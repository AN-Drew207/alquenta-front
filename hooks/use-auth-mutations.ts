"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login, logout, register } from "@/lib/api/auth";
import type { AuthenticatedUser, LoginInput, RegisterInput } from "@/types/auth";
import { CURRENT_USER_QUERY_KEY } from "./use-current-user";

function redirectAfterAuth(
  router: ReturnType<typeof useRouter>,
  user: AuthenticatedUser,
  redirectTo?: string,
) {
  if (redirectTo) {
    router.push(redirectTo);
    return;
  }
  router.push(user.role === "ADMIN" ? "/dashboard" : "/");
}

export function useLoginMutation(redirectTo?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: async (user) => {
      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      redirectAfterAuth(router, user, redirectTo);
    },
  });
}

export function useRegisterMutation(redirectTo?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: async (user) => {
      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      redirectAfterAuth(router, user, redirectTo);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
      queryClient.clear();
      router.push("/");
    },
  });
}
