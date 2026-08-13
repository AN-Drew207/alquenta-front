"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import logoLight from "@/assets/logo/positivo_negativo/Negativo 1.png";
import logoDark from "@/assets/logo/sin_fondo/Alquenta 1.png";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function AlquentaLogo({
  className,
  priority,
}: {
  className?: string;
  priority?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Image
      src={isDark ? logoDark : logoLight}
      alt="Alquenta"
      className={className}
      priority={priority}
    />
  );
}
