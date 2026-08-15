"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  useLoginMutation,
  useReactivateAccountMutation,
} from "@/hooks/use-auth-mutations";
import { isApiError, translateApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? undefined;
  const loginMutation = useLoginMutation(redirectTo);
  const reactivateMutation = useReactivateAccountMutation(redirectTo);

  const loginSchema = z.object({
    email: z.email(t("invalidEmail")),
    password: z.string().min(1, t("passwordRequired")),
  });
  type LoginFormValues = z.infer<typeof loginSchema>;

  const [deactivatedCredentials, setDeactivatedCredentials] =
    useState<LoginFormValues | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(values: LoginFormValues) {
    setDeactivatedCredentials(null);
    loginMutation.mutate(values, {
      onError: (error) => {
        if (isApiError(error) && error.error === "AccountDeactivatedException") {
          setDeactivatedCredentials(values);
          return;
        }
        toast.error(translateApiError(error, t("couldNotLogIn")));
      },
    });
  }

  function handleReactivate() {
    if (!deactivatedCredentials) return;
    reactivateMutation.mutate(deactivatedCredentials, {
      onError: (error) => {
        toast.error(translateApiError(error, t("couldNotReactivateAccount")));
      },
    });
  }

  return (
    <Card className="bg-background ring-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-center text-2xl">{t("logIn")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">{t("password")}</Label>
            <PasswordInput id="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="h-auto w-full py-4"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? t("loggingIn") : t("logIn")}
          </Button>
        </form>

        {deactivatedCredentials && (
          <div className="mt-4 space-y-3 rounded-lg border border-border bg-muted/50 p-4 text-center">
            <p className="text-sm">{t("accountDeactivatedNotice")}</p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleReactivate}
              disabled={reactivateMutation.isPending}
            >
              {reactivateMutation.isPending
                ? t("reactivatingAccount")
                : t("reactivateAccount")}
            </Button>
          </div>
        )}

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-primary underline-offset-4 hover:underline">
            {t("signUp")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
