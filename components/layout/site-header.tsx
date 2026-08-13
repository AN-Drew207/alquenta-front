"use client";

import Link from "next/link";
import { AlquentaLogo } from "@/components/layout/alquenta-logo";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import {
  Bell,
  ChevronDown,
  LogIn,
  Menu,
  MessageSquare,
  Moon,
  Sun,
  User,
  UserPlus,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLogoutMutation } from "@/hooks/use-auth-mutations";
import { useMyNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePropertyTypeLabels } from "@/lib/i18n/labels";
import type { PropertyType } from "@/types/enums";

function PublicNav({ isAdmin }: { isAdmin: boolean }) {
  const t = useTranslations("nav");
  const propertyTypeLabels = usePropertyTypeLabels();
  const propertyTypes = Object.keys(propertyTypeLabels) as PropertyType[];

  if (isAdmin) {
    return (
      <nav className="hidden items-center gap-1 md:flex">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="nos-nav-link"
          render={<Link href="/dashboard" />}
        >
          {t("dashboard")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="nos-nav-link"
          render={<Link href="/my-properties" />}
        >
          {t("myProperties")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="nos-nav-link"
          render={<Link href="/about" />}
        >
          {t("about")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          className="nos-nav-link"
          render={<Link href="/contact" />}
        >
          {t("contact")}
        </Button>
      </nav>
    );
  }

  return (
    <nav className="hidden items-center gap-1 md:flex">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        className="nos-nav-link"
        render={<Link href="/" />}
      >
        {t("home")}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="nos-nav-link" />}>
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
        className="nos-nav-link"
        render={<Link href="/about" />}
      >
        {t("about")}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        className="nos-nav-link"
        render={<Link href="/contact" />}
      >
        {t("contact")}
      </Button>
    </nav>
  );
}

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function useIsDarkTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  return { isDark: mounted && resolvedTheme === "dark", setTheme };
}

function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("common");
  const { isDark, setTheme } = useIsDarkTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      <span className="sr-only">{t("toggleTheme")}</span>
    </Button>
  );
}

function ThemeMenuItem() {
  const t = useTranslations("common");
  const { isDark, setTheme } = useIsDarkTheme();

  return (
    <DropdownMenuItem onClick={() => setTheme(isDark ? "light" : "dark")}>
      {isDark ? <Sun /> : <Moon />}
      {isDark ? t("lightMode") : t("darkMode")}
    </DropdownMenuItem>
  );
}

function MobileNav() {
  const t = useTranslations("nav");
  const propertyTypeLabels = usePropertyTypeLabels();
  const propertyTypes = Object.keys(propertyTypeLabels) as PropertyType[];
  const { data: user, isLoading } = useCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" />}
      >
        <Menu className="size-5" />
        <span className="sr-only">{t("menu")}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isAdmin ? (
          <>
            <DropdownMenuItem render={<Link href="/dashboard" />}>
              {t("dashboard")}
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/my-properties" />}>
              {t("myProperties")}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem render={<Link href="/" />}>
              {t("home")}
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{t("propertyTypes")}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {propertyTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      render={<Link href={`/?type=${type}`} />}
                    >
                      {propertyTypeLabels[type]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </>
        )}

        <DropdownMenuItem render={<Link href="/about" />}>
          {t("about")}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/contact" />}>
          {t("contact")}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <ThemeMenuItem />

        {!isLoading && !user && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/login" />}>
              <LogIn />
              {t("logIn")}
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/register" />}>
              <UserPlus />
              {t("signUp")}
            </DropdownMenuItem>
          </>
        )}
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
        <Link href="/" className="group flex items-center pt-1">
          <AlquentaLogo
            priority
            className="h-7 w-auto transition-transform duration-500 ease-(--nos-ease-out) group-hover:scale-105"
          />
        </Link>

        <PublicNav isAdmin={user?.role === "ADMIN"} />

        <div className="flex items-center gap-2">
          {user && (
            <>
              <Button
                variant="ghost"
                size="icon"
                nativeButton={false}
                render={<Link href="/conversations" />}
                aria-label={t("conversations")}
              >
                <MessageSquare className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                nativeButton={false}
                render={<Link href="/notifications" />}
                className="relative"
                aria-label={t("notifications")}
              >
                <Bell className="size-4" />
                {hasUnreadNotifications && (
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
                )}
              </Button>
            </>
          )}
          <ThemeToggle className="hidden md:inline-flex" />
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
                  <DropdownMenuItem render={<Link href="/profile" />}>
                    <User />
                    {t("profile")}
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
            <div className="hidden items-center gap-2 md:flex">
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
            </div>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
