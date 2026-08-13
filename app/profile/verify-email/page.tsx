"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { confirmEmailChange } from "@/lib/api/profile";
import { isApiError } from "@/lib/api/client";
import { CURRENT_USER_QUERY_KEY } from "@/hooks/use-current-user";
import { PROFILE_QUERY_KEY } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Status = "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const t = useTranslations("profile");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<Status>(() => (token ? "verifying" : "error"));
  const [errorMessage, setErrorMessage] = useState(() =>
    token ? "" : t("verifyEmailMissingToken"),
  );

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    confirmEmailChange(token)
      .then(() => {
        if (cancelled) return;
        setStatus("success");
        const cachedUser = queryClient.getQueryData(CURRENT_USER_QUERY_KEY);
        if (cachedUser) {
          queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
          queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        }
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus("error");
        setErrorMessage(isApiError(error) ? error.message : t("verifyEmailError"));
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-12">
      <Card className="w-full ring-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {t("verifyEmailTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 text-center">
          {status === "verifying" && (
            <>
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {t("verifyEmailVerifying")}
              </p>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle2 className="size-8 text-primary" />
              <p className="text-sm text-muted-foreground">
                {t("verifyEmailSuccess")}
              </p>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle className="size-8 text-destructive" />
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            </>
          )}
          <Button nativeButton={false} render={<Link href="/" />}>
            {t("verifyEmailBackHome")}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
