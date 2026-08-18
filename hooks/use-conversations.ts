"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchConversationMessages,
  fetchMyConversations,
  replyToConversation,
  startConversation,
} from "@/lib/api/conversations";
import { track } from "@/lib/analytics";
import { useCurrentUser } from "./use-current-user";
import type { ReplyInput, StartConversationInput } from "@/types/messaging";

/**
 * Self-gated on session presence (same pattern as useFavoriteIds) — needed
 * because this is now also called from ContactBox on the public property
 * page, reachable by anonymous visitors, not just the already
 * session-gated (app)/conversations/* routes.
 */
export function useMyConversations() {
  const { data: user } = useCurrentUser();
  return useQuery({
    queryKey: ["conversations"],
    queryFn: fetchMyConversations,
    enabled: Boolean(user),
  });
}

export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: ["conversations", conversationId, "messages"],
    queryFn: () => fetchConversationMessages(conversationId),
    enabled: Boolean(conversationId),
  });
}

export function useStartConversationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StartConversationInput) => startConversation(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      track("contact_initiated", { propertyId: variables.propertyId });
    },
  });
}

export function useReplyMutation(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReplyInput) => replyToConversation(conversationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", conversationId, "messages"],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
