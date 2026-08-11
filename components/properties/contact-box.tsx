"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useStartConversationMutation } from "@/hooks/use-conversations";
import { isApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ContactBox({
  propertyId,
  adminId,
  available,
}: {
  propertyId: string;
  adminId: string;
  available: boolean;
}) {
  const t = useTranslations("propertyDetail");
  const { data: user, isLoading } = useCurrentUser();
  const [content, setContent] = useState("");
  const startConversation = useStartConversationMutation();

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("interested")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">
            {t("logInToContact")}
          </p>
          <Button
            nativeButton={false}
            render={<Link href={`/login?redirect=/properties/${propertyId}`} />}
          >
            {t("logInToContactButton")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (user.id === adminId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("yourListing")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/my-properties" />}
          >
            {t("managePropertiesButton")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (user.role !== "CLIENT") {
    return null;
  }

  if (!available) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("notAvailable")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t("notAvailableDescription")}
          </p>
        </CardContent>
      </Card>
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!content.trim()) {
      toast.error(t("writeMessageBeforeSending"));
      return;
    }

    startConversation.mutate(
      {
        propertyId,
        content,
      },
      {
        onSuccess: () => {
          toast.success(t("messageSent"));
          setContent("");
        },
        onError: (error) => {
          toast.error(isApiError(error) ? error.message : t("couldNotSendMessage"));
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("contactTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="content">{t("message")}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={t("messagePlaceholder")}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={startConversation.isPending}>
            {startConversation.isPending ? t("sending") : t("send")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
