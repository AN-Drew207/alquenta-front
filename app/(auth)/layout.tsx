"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { HouseImagePanel } from "@/components/layout/house-image-panel";
import alquentaLogoStacked from "@/assets/logo/con_fondo/con fondo 3.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(user.role === "ADMIN" ? "/dashboard" : "/");
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
              src={alquentaLogoStacked}
              alt="Alquenta"
              className="h-36 w-auto rounded-2xl"
              priority
            />
          </Link>
          {children}
        </div>
      </div>

      <HouseImagePanel className="hidden w-1/2 lg:block" />
    </main>
  );
}
