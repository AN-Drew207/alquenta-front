"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useReplyMutation } from "@/hooks/use-conversations";
import { isApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function MessageComposer({ conversationId }: { conversationId: string }) {
  const [content, setContent] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const replyMutation = useReplyMutation(conversationId);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!content.trim()) return;

    replyMutation.mutate(
      { content, offerAmount: offerAmount ? Number(offerAmount) : undefined },
      {
        onSuccess: () => {
          setContent("");
          setOfferAmount("");
        },
        onError: (error) => {
          toast.error(isApiError(error) ? error.message : "Could not send message");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2 border-t border-border pt-4">
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Write a reply..."
        rows={2}
      />
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          value={offerAmount}
          onChange={(event) => setOfferAmount(event.target.value)}
          placeholder="Offer amount (optional)"
          className="w-56"
        />
        <Button type="submit" disabled={replyMutation.isPending}>
          {replyMutation.isPending ? "Sending..." : "Send"}
        </Button>
      </div>
    </form>
  );
}
