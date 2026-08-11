"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMyConversations } from "@/hooks/use-conversations";
import { ConversationList } from "@/components/conversations/conversation-list";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ConversationsLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("conversations");
  const pathname = usePathname();
  const activeId = pathname.startsWith("/conversations/")
    ? pathname.slice("/conversations/".length)
    : undefined;
  const { data: conversations, isLoading } = useMyConversations();

  return (
    <main className="flex h-[calc(100vh-4rem)] w-full flex-1">
      <aside
        className={cn(
          "w-full shrink-0 overflow-y-auto border-r border-border md:w-80 lg:w-96",
          activeId && "hidden md:block",
        )}
      >
        <div className="border-b border-border px-4 py-4">
          <h1 className="text-lg font-bold">{t("title")}</h1>
        </div>
        {isLoading ? (
          <div className="space-y-2 p-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : (
          <ConversationList conversations={conversations ?? []} activeId={activeId} />
        )}
      </aside>

      <div className={cn("min-w-0 flex-1", !activeId && "hidden md:flex")}>{children}</div>
    </main>
  );
}
