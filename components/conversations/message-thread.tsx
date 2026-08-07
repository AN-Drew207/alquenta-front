"use client";

import { format } from "date-fns";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/messaging";

export function MessageThread({ messages }: { messages: Message[] }) {
  const { data: user } = useCurrentUser();

  if (messages.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        No messages yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => {
        const isMine = message.authorId === user?.id;
        return (
          <div
            key={message.id}
            className={cn("flex flex-col", isMine ? "items-end" : "items-start")}
          >
            <div
              className={cn(
                "max-w-md rounded-lg px-3 py-2 text-sm",
                isMine
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground",
              )}
            >
              {message.offerAmount !== null && (
                <Badge
                  variant={isMine ? "secondary" : "default"}
                  className="mb-1"
                >
                  Offer: ${message.offerAmount.toLocaleString()}
                </Badge>
              )}
              <p>{message.content}</p>
            </div>
            <span className="mt-1 text-xs text-muted-foreground">
              {format(new Date(message.createdAt), "MMM d, HH:mm")}
            </span>
          </div>
        );
      })}
    </div>
  );
}
