export interface Conversation {
  id: string;
  propertyId: string;
  clientId: string;
  clientName: string;
  adminId: string;
  adminName: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  authorId: string;
  authorName: string;
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

// Maps to AdminResponseStatsResponseDto (`GET /conversations/admins/:adminId/response-stats`, public).
export interface AdminResponseStats {
  responseRate: number;
  averageResponseMinutes: number | null;
  sampleSize: number;
}
