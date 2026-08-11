"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Bell,
  Building2,
  Check,
  ChevronDown,
  Globe,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLogoutMutation } from "@/hooks/use-auth-mutations";
import { useMyNotifications } from "@/hooks/use-notifications";
import { setLocale } from "@/lib/actions/set-locale";
import type { Locale } from "@/i18n/request";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePropertyTypeLabels } from "@/lib/i18n/labels";
import type { PropertyType } from "@/types/enums";

function PublicNav() {
  const t = useTranslations("nav");
  const propertyTypeLabels = usePropertyTypeLabels();
  const propertyTypes = Object.keys(propertyTypeLabels) as PropertyType[];

  return (
    <nav className="hidden items-center gap-1 md:flex">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/" />}
      >
        {t("home")}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
          {t("propertyTypes")}
          <ChevronDown className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {propertyTypes.map((type) => (
            <DropdownMenuItem
              key={type}
              render={<Link href={`/?type=${type}`} />}
            >
              {propertyTypeLabels[type]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/about" />}
      >
        {t("about")}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/contact" />}
      >
        {t("contact")}
      </Button>
    </nav>
  );
}

function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();

  async function handleSelect(next: Locale) {
    if (next === locale) return;
    await setLocale(next);
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="cursor-pointer" />
        }
      >
        <Globe className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuItem
          onClick={() => handleSelect("es")}
          className="justify-between"
        >
          {t("spanish")}
          {locale === "es" && <Check className="size-3.5" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSelect("en")}
          className="justify-between"
        >
          {t("english")}
          {locale === "en" && <Check className="size-3.5" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const { data: user, isLoading } = useCurrentUser();
  const logoutMutation = useLogoutMutation();
  const { data: notifications } = useMyNotifications(Boolean(user));
  const hasUnreadNotifications = Boolean(
    notifications?.some((notification) => notification.status === "PENDING"),
  );
  const t = useTranslations("nav");

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Building2 className="size-5 text-primary" />
          Alquenta
        </Link>

        <PublicNav />

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                  />
                }
              >
                <Avatar className="size-8 cursor-pointer">
                  <AvatarFallback>
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                  {hasUnreadNotifications && <AvatarBadge />}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {user.role === "ADMIN" && (
                    <>
                      <DropdownMenuItem render={<Link href="/dashboard" />}>
                        <LayoutDashboard />
                        {t("dashboard")}
                      </DropdownMenuItem>
                      <DropdownMenuItem render={<Link href="/my-properties" />}>
                        <Building2 />
                        {t("myProperties")}
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem render={<Link href="/conversations" />}>
                    <MessageSquare />
                    {t("conversations")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    render={<Link href="/notifications" />}
                    className="justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <Bell />
                      {t("notifications")}
                    </span>
                    {hasUnreadNotifications && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  {t("logOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/login" />}
              >
                {t("logIn")}
              </Button>
              <Button
                size="sm"
                nativeButton={false}
                render={<Link href="/register" />}
              >
                {t("signUp")}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
