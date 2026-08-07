"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProperty,
  deleteProperty,
  fetchMyProperties,
  fetchProperty,
  updateProperty,
} from "@/lib/api/properties";
import type { CreatePropertyInput, UpdatePropertyInput } from "@/types/property";

export function useMyProperties() {
  return useQuery({
    queryKey: ["properties", "mine"],
    queryFn: fetchMyProperties,
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ["properties", id],
    queryFn: () => fetchProperty(id),
    enabled: Boolean(id),
  });
}

export function useCreatePropertyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePropertyInput) => createProperty(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties", "mine"] });
    },
  });
}

export function useUpdatePropertyMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePropertyInput) => updateProperty(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["properties", id] });
    },
  });
}

export function useDeletePropertyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties", "mine"] });
    },
  });
}
