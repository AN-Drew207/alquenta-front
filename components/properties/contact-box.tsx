"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useStartConversationMutation } from "@/hooks/use-conversations";
import { isApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  const { data: user, isLoading } = useCurrentUser();
  const [content, setContent] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const startConversation = useStartConversationMutation();

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Interested in this property?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">
            Log in as a client to contact the owner or make an offer.
          </p>
          <Button
            nativeButton={false}
            render={<Link href={`/login?redirect=/properties/${propertyId}`} />}
          >
            Log in to contact
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (user.id === adminId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">This is your listing</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/my-properties" />}
          >
            Manage my properties
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
          <CardTitle className="text-base">Not available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This property is no longer available for contact or offers.
          </p>
        </CardContent>
      </Card>
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!content.trim()) {
      toast.error("Write a message before sending");
      return;
    }

    startConversation.mutate(
      {
        propertyId,
        content,
        offerAmount: offerAmount ? Number(offerAmount) : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Message sent to the property owner");
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
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Contact or make an offer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="content">Message</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Hi, is this still available?"
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="offerAmount">Offer amount (optional)</Label>
            <Input
              id="offerAmount"
              type="number"
              min={0}
              value={offerAmount}
              onChange={(event) => setOfferAmount(event.target.value)}
              placeholder="e.g. 500"
            />
          </div>
          <Button type="submit" disabled={startConversation.isPending}>
            {startConversation.isPending ? "Sending..." : "Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
