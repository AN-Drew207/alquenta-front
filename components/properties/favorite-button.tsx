"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  useAddFavoriteMutation,
  useFavoriteIds,
  useRemoveFavoriteMutation,
} from "@/hooks/use-favorites";
import { translateApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

/**
 * Renders nothing for anonymous visitors instead of prompting login on
 * click — matches how SiteHeader only shows conversations/notifications
 * once there's a session.
 */
export function FavoriteButton({
  propertyId,
  className,
}: {
  propertyId: string;
  className?: string;
}) {
  const t = useTranslations("home");
  const { data: user } = useCurrentUser();
  const { data: favoriteIds } = useFavoriteIds();
  const addMutation = useAddFavoriteMutation();
  const removeMutation = useRemoveFavoriteMutation();
  const isFavorited = favoriteIds?.includes(propertyId) ?? false;
  const isPending = addMutation.isPending || removeMutation.isPending;

  if (!user) return null;

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const mutation = isFavorited ? removeMutation : addMutation;
    mutation.mutate(propertyId, {
      onError: (error) =>
        toast.error(translateApiError(error, t("couldNotUpdateFavorite"))),
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "rounded-full bg-white/90 backdrop-blur-sm hover:bg-white",
        className,
      )}
      aria-label={isFavorited ? t("removeFavorite") : t("addFavorite")}
    >
      <Heart
        className={cn(
          "size-4 text-neutral-700",
          isFavorited && "fill-primary text-primary",
        )}
      />
    </Button>
  );
}
