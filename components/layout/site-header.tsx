"use client";

import Link from "next/link";
import { Building2, ChevronDown } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLogoutMutation } from "@/hooks/use-auth-mutations";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PROPERTY_TYPE_LABELS } from "@/lib/constants";
import type { PropertyType } from "@/types/enums";

const PROPERTY_TYPES = Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[];

function PublicNav() {
  return (
    <nav className="hidden items-center gap-1 md:flex">
      <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/" />}>
        Home
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
          Property Types
          <ChevronDown className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {PROPERTY_TYPES.map((type) => (
            <DropdownMenuItem
              key={type}
              render={<Link href={`/?type=${type}`} />}
            >
              {PROPERTY_TYPE_LABELS[type]}
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
        About
      </Button>
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/contact" />}
      >
        Contact
      </Button>
    </nav>
  );
}

export function SiteHeader() {
  const { data: user, isLoading } = useCurrentUser();
  const logoutMutation = useLogoutMutation();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Building2 className="size-5 text-primary" />
          Alquenta
        </Link>

        <PublicNav />

        <div className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : user ? (
            <>
              {user.role === "ADMIN" && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    nativeButton={false}
                    render={<Link href="/dashboard" />}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    nativeButton={false}
                    render={<Link href="/my-properties" />}
                  >
                    My properties
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/conversations" />}
              >
                Conversations
              </Button>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/notifications" />}
              >
                Notifications
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="icon" className="rounded-full" />
                  }
                >
                  <Avatar className="size-8">
                    <AvatarFallback>
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/login" />}
              >
                Log in
              </Button>
              <Button size="sm" nativeButton={false} render={<Link href="/register" />}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
