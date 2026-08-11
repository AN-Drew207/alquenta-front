export interface Conversation {
  id: string;
  propertyId: string;
  clientId: string;
  adminId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  authorId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface StartConversationInput {
  propertyId: string;
  content: string;
}

export interface StartConversationResponse {
  conversation: Conversation;
  message: Message;
}

export interface ReplyInput {
  content: string;
}
