import { api } from "./client";
import type {
  Conversation,
  Message,
  ReplyInput,
  StartConversationInput,
  StartConversationResponse,
} from "@/types/messaging";

export async function startConversation(
  input: StartConversationInput,
): Promise<StartConversationResponse> {
  const { data } = await api.post<StartConversationResponse>("/conversations", input);
  return data;
}

export async function fetchMyConversations(): Promise<Conversation[]> {
  const { data } = await api.get<Conversation[]>("/conversations");
  return data;
}

export async function fetchConversationMessages(
  conversationId: string,
): Promise<Message[]> {
  const { data } = await api.get<Message[]>(
    `/conversations/${conversationId}/messages`,
  );
  return data;
}

export async function replyToConversation(
  conversationId: string,
  input: ReplyInput,
): Promise<Message> {
  const { data } = await api.post<Message>(
    `/conversations/${conversationId}/messages`,
    input,
  );
  return data;
}
