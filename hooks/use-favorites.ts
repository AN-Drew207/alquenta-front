"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  fetchFavoriteIds,
  fetchFavorites,
  removeFavorite,
} from "@/lib/api/favorites";
import { useCurrentUser } from "./use-current-user";

const FAVORITE_IDS_KEY = ["favorites", "ids"];
const FAVORITES_KEY = ["favorites"];

export function useFavoriteIds() {
  const { data: user } = useCurrentUser();
  return useQuery({
    queryKey: FAVORITE_IDS_KEY,
    queryFn: fetchFavoriteIds,
    enabled: Boolean(user),
  });
}

export function useFavorites() {
  const { data: user } = useCurrentUser();
  return useQuery({
    queryKey: FAVORITES_KEY,
    queryFn: fetchFavorites,
    enabled: Boolean(user),
  });
}

function useInvalidateFavorites() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: FAVORITE_IDS_KEY });
    queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
  };
}

export function useAddFavoriteMutation() {
  const invalidate = useInvalidateFavorites();
  return useMutation({
    mutationFn: addFavorite,
    onSuccess: invalidate,
  });
}

export function useRemoveFavoriteMutation() {
  const invalidate = useInvalidateFavorites();
  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: invalidate,
  });
}
