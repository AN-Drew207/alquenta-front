"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAcceptAdminInvitationMutation } from "@/hooks/use-auth-mutations";
import { isApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import alquentaLogoStacked from "@/assets/logo/sin_fondo/Alquenta 4.png";

export default function AdminInvitePage() {
  const t = useTranslations("adminInvite");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const acceptMutation = useAcceptAdminInvitationMutation();

  const acceptInvitationSchema = z
    .object({
      name: z.string().min(1, t("nameRequired")),
      password: z.string().min(8, t("passwordMinLength")),
      confirmPassword: z.string().min(8, t("passwordMinLength")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });
  type AcceptInvitationFormValues = z.infer<typeof acceptInvitationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInvitationFormValues>({
    resolver: zodResolver(acceptInvitationSchema),
  });

  function onSubmit(values: AcceptInvitationFormValues) {
    if (!token) return;

    acceptMutation.mutate(
      { token, name: values.name, password: values.password },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (error) => {
          toast.error(
            isApiError(error) ? error.message : t("couldNotAcceptInvitation"),
          );
        },
      },
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <Image
            src={alquentaLogoStacked}
            alt="Alquenta"
            className="h-28 w-auto"
            priority
          />
        </Link>

        {!token ? (
          <Card className="ring-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {t("invalidLinkTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm text-muted-foreground">
                {t("invalidLinkDescription")}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="ring-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-center text-2xl">{t("title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                {t("subtitle")}
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Input id="password" type="password" {...register("password")} />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="h-auto w-full py-4"
                  disabled={acceptMutation.isPending}
                >
                  {acceptMutation.isPending ? t("submitting") : t("submit")}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
