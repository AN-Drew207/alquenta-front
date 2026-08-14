"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useReplyMutation } from "@/hooks/use-conversations";
import { translateApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function MessageComposer({ conversationId }: { conversationId: string }) {
  const t = useTranslations("conversations");
  const [content, setContent] = useState("");
  const replyMutation = useReplyMutation(conversationId);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!content.trim()) return;

    replyMutation.mutate(
      { content },
      {
        onSuccess: () => {
          setContent("");
        },
        onError: (error) => {
          toast.error(translateApiError(error, t("couldNotSendMessage")));
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 pt-4">
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={t("replyPlaceholder")}
        rows={2}
      />
      <div className="flex items-center justify-end gap-2">
        <Button type="submit" disabled={replyMutation.isPending}>
          {replyMutation.isPending ? t("sending") : t("send")}
        </Button>
      </div>
    </form>
  );
}
