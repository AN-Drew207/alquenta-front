"use client";

import { useMyConversations } from "@/hooks/use-conversations";
import { ConversationList } from "@/components/conversations/conversation-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConversationsPage() {
  const { data: conversations, isLoading } = useMyConversations();

  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Conversations</h1>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <ConversationList conversations={conversations ?? []} />
      )}
    </main>
  );
}
