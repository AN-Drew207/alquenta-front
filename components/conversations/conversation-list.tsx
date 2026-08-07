"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useProperty } from "@/hooks/use-properties";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Conversation } from "@/types/messaging";

function ConversationRow({ conversation }: { conversation: Conversation }) {
  const { data: property, isLoading } = useProperty(conversation.propertyId);

  return (
    <Link href={`/conversations/${conversation.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="flex items-center justify-between py-4">
          {isLoading ? (
            <Skeleton className="h-5 w-48" />
          ) : (
            <span className="font-medium">
              {property?.title ?? "Property no longer available"}
            </span>
          )}
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(conversation.createdAt), {
              addSuffix: true,
            })}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

export function ConversationList({
  conversations,
}: {
  conversations: Conversation[];
}) {
  const { data: user } = useCurrentUser();

  if (conversations.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        {user?.role === "CLIENT"
          ? "You haven't contacted any property owners yet."
          : "No one has contacted you about your properties yet."}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <ConversationRow key={conversation.id} conversation={conversation} />
      ))}
    </div>
  );
}
