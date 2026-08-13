"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelAdminProperty,
  deleteAdmin,
  disableAdmin,
  enableAdmin,
  fetchAdminProperties,
  fetchAdmins,
  inviteAdmin,
} from "@/lib/api/admins";

export function useAdmins() {
  return useQuery({
    queryKey: ["admins"],
    queryFn: fetchAdmins,
  });
}

export function useInviteAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => inviteAdmin(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}

export function useDisableAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => disableAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}

export function useEnableAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => enableAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}

export function useDeleteAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}

export function useAdminProperties(adminId: string) {
  return useQuery({
    queryKey: ["admins", adminId, "properties"],
    queryFn: () => fetchAdminProperties(adminId),
    enabled: Boolean(adminId),
  });
}

export function useCancelAdminPropertyMutation(adminId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (propertyId: string) => cancelAdminProperty(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins", adminId, "properties"] });
    },
  });
}
