"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  changePassword,
  checkUsernameAvailability,
  deactivateAccount,
  deleteAccount,
  deleteAvatar,
  exportAccountData,
  fetchMyFullProfile,
  fetchSessions,
  patchProfile,
  requestEmailChange,
  revokeOtherSessions,
  revokeSession,
} from "@/lib/api/profile";
import type { Profile } from "@/types/auth";
import { CURRENT_USER_QUERY_KEY } from "./use-current-user";

export const PROFILE_QUERY_KEY = ["profile", "me"] as const;
export const SESSIONS_QUERY_KEY = ["profile", "sessions"] as const;

export function useMyFullProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchMyFullProfile,
  });
}

export function usePatchProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Partial<Profile>) => patchProfile(input),
    onSuccess: (profile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, profile);
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
  });
}

export function useDeleteAvatarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAvatar,
    onSuccess: (profile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, profile);
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
  });
}

export function useUsernameAvailability(value: string, enabled: boolean) {
  return useQuery({
    queryKey: ["profile", "username-availability", value],
    queryFn: () => checkUsernameAvailability(value),
    enabled,
    staleTime: 0,
    retry: false,
  });
}

export function useRequestEmailChangeMutation() {
  return useMutation({
    mutationFn: (newEmail: string) => requestEmailChange(newEmail),
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (input: { currentPassword: string; nextPassword: string }) =>
      changePassword(input),
  });
}

export function useSessions() {
  return useQuery({
    queryKey: SESSIONS_QUERY_KEY,
    queryFn: fetchSessions,
  });
}

export function useRevokeSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => revokeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
    },
  });
}

export function useRevokeOtherSessionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeOtherSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY });
    },
  });
}

export function useDeactivateAccountMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deactivateAccount,
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
      router.push("/");
    },
  });
}

export function useExportAccountDataMutation() {
  return useMutation({
    mutationFn: exportAccountData,
  });
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (confirmation: string) => deleteAccount(confirmation),
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, null);
      router.push("/");
    },
  });
}
