"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchConversationMessages,
  fetchMyConversations,
  replyToConversation,
  startConversation,
} from "@/lib/api/conversations";
import type { ReplyInput, StartConversationInput } from "@/types/messaging";

export function useMyConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: fetchMyConversations,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
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
