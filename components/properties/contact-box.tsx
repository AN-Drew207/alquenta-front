"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Ban, Handshake, Pencil } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useStartConversationMutation } from "@/hooks/use-conversations";
import {
  useCancelPropertyMutation,
  useMarkPropertyAsRentedOrSoldMutation,
} from "@/hooks/use-properties";
import { translateApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { PropertyStatus } from "@/types/enums";

export function ContactBox({
  propertyId,
  propertyTitle,
  adminId,
  available,
  status,
}: {
  propertyId: string;
  propertyTitle: string;
  adminId: string;
  available: boolean;
  status: PropertyStatus;
}) {
  const t = useTranslations("propertyDetail");
  const tMyProperties = useTranslations("myProperties");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const [content, setContent] = useState("");
  const startConversation = useStartConversationMutation();
  const cancelMutation = useCancelPropertyMutation();
  const markAsRentedOrSoldMutation = useMarkPropertyAsRentedOrSoldMutation();

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
    function handleCancel() {
      cancelMutation.mutate(propertyId, {
        onSuccess: () => {
          toast.success(tMyProperties("propertyCancelled"));
          router.refresh();
        },
        onError: (error) =>
          toast.error(translateApiError(error, tMyProperties("couldNotCancelProperty"))),
      });
    }

    function handleMarkAsRentedOrSold() {
      markAsRentedOrSoldMutation.mutate(propertyId, {
        onSuccess: () => {
          toast.success(tMyProperties("propertyMarkedAsRentedOrSold"));
          router.refresh();
        },
        onError: (error) =>
          toast.error(
            translateApiError(error, tMyProperties("couldNotMarkAsRentedOrSold")),
          ),
      });
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("yourListing")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/my-properties/${propertyId}/edit`} />}
          >
            <Pencil />
            {tMyProperties("edit")}
          </Button>

          {status === "AVAILABLE" && (
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline" />}>
                <Handshake />
                {tMyProperties("markAsRentedOrSold")}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {tMyProperties("markAsRentedOrSoldConfirmTitle")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {tMyProperties("markAsRentedOrSoldConfirmDescription", {
                      title: propertyTitle,
                    })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleMarkAsRentedOrSold}>
                    {tMyProperties("markAsRentedOrSold")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {status !== "CANCELLED" && (
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive" />}>
                <Ban />
                {tMyProperties("cancelListing")}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{tMyProperties("cancelConfirmTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {tMyProperties("cancelConfirmDescription", { title: propertyTitle })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel}>
                    {tMyProperties("cancelListing")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
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
          toast.error(translateApiError(error, t("couldNotSendMessage")));
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
