"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useConversationMessages, useMyConversations } from "@/hooks/use-conversations";
import { useProperty } from "@/hooks/use-properties";
import { MessageThread } from "@/components/conversations/message-thread";
import { MessageComposer } from "@/components/conversations/message-composer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ConversationDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: conversations } = useMyConversations();
  const { data: messages, isLoading } = useConversationMessages(params.id);

  const conversation = conversations?.find((c) => c.id === params.id);
  const { data: property } = useProperty(conversation?.propertyId ?? "");

  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-8">
      <Button variant="ghost" size="sm" render={<Link href="/conversations" />}>
        <ArrowLeft className="size-4" />
        Back to conversations
      </Button>

      <h1 className="mb-6 mt-2 text-2xl font-bold">
        {property ? (
          <Link href={`/properties/${property.id}`} className="hover:underline">
            {property.title}
          </Link>
        ) : (
          "Conversation"
        )}
      </h1>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <>
          <MessageThread messages={messages ?? []} />
          <MessageComposer conversationId={params.id} />
        </>
      )}
    </main>
  );
}
