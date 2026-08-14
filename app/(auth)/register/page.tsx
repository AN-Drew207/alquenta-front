"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRegisterMutation } from "@/hooks/use-auth-mutations";
import { translateApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? undefined;
  const registerMutation = useRegisterMutation(redirectTo);

  const registerSchema = z.object({
    name: z.string().min(1, t("nameRequired")),
    email: z.email(t("invalidEmail")),
    password: z.string().min(8, t("passwordMinLength")),
    phone: z.string().optional(),
  });
  type RegisterFormValues = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate(values, {
      onError: (error) => {
        toast.error(translateApiError(error, t("couldNotCreateAccount")));
      },
    });
  }

  return (
    <Card className="bg-background ring-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-center text-2xl">{t("createAccount")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">{t("name")}</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
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
          <div className="space-y-1.5">
            <Label htmlFor="phone">{t("phoneOptional")}</Label>
            <Input id="phone" {...register("phone")} />
          </div>
          <Button
            type="submit"
            className="h-auto w-full py-4"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? t("creatingAccount") : t("signUp")}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            {t("logIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
