"use client";

import { useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCurrentUser } from "@/hooks/use-current-user";
import { defaultRouteForRole } from "@/hooks/use-auth-mutations";
import { HouseImagePanel } from "@/components/layout/house-image-panel";
import alquentaLogoDark from "@/assets/logo/sin_fondo/Alquenta 4.png";
import alquentaLogoLight from "@/assets/logo/sin_fondo/Alquenta 2.png";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(defaultRouteForRole(user.role));
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return null;
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-1">
      <div className="flex w-full flex-col justify-center px-4 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 flex justify-center">
            <Image
              src={isDark ? alquentaLogoLight : alquentaLogoDark}
              alt="Alquenta"
              className="h-28 w-auto animate-nos-mark-in"
              priority
            />
          </Link>
          <div className="animate-nos-fade-up [animation-delay:150ms]">{children}</div>
        </div>
      </div>

      <HouseImagePanel className="hidden w-1/2 animate-nos-fade-up lg:block" />
    </main>
  );
}
