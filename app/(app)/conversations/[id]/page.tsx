"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useConversationMessages, useMyConversations } from "@/hooks/use-conversations";
import { useProperty } from "@/hooks/use-properties";
import { MessageThread } from "@/components/conversations/message-thread";
import { MessageComposer } from "@/components/conversations/message-composer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ConversationDetailPage() {
  const t = useTranslations("conversations");
  const params = useParams<{ id: string }>();
  const { data: conversations } = useMyConversations();
  const { data: messages, isLoading } = useConversationMessages(params.id);

  const conversation = conversations?.find((c) => c.id === params.id);
  const { data: property } = useProperty(conversation?.propertyId ?? "");

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          nativeButton={false}
          render={<Link href="/conversations" />}
        >
          <ArrowLeft className="size-4" />
          <span className="sr-only">{t("backToConversations")}</span>
        </Button>
        {property?.images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.images[0]}
            alt=""
            className="size-8 shrink-0 rounded-md object-cover"
          />
        )}
        <h1 className="truncate text-base font-semibold">
          {property ? (
            <Link href={`/properties/${property.id}`} className="hover:underline">
              {property.title}
            </Link>
          ) : (
            t("conversationFallbackTitle")
          )}
        </h1>
      </div>

      {isLoading ? (
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          <Skeleton className="h-16 w-2/3" />
          <Skeleton className="ml-auto h-16 w-2/3" />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4">
            <MessageThread messages={messages ?? []} />
          </div>
          <div className="border-t border-border px-4 pb-4">
            <MessageComposer conversationId={params.id} />
          </div>
        </>
      )}
    </div>
  );
}
