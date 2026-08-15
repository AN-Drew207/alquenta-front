import { APP_ENV, IS_PRODUCTION } from "@/lib/env";

const ENV_LABELS: Record<string, string> = {
  development: "DESARROLLO",
  test: "PRUEBAS",
};

export function EnvironmentBanner() {
  if (IS_PRODUCTION) return null;

  const label = ENV_LABELS[APP_ENV] ?? APP_ENV.toUpperCase();

  return (
    <div className="flex h-7 items-center justify-center bg-amber-500 text-xs font-bold tracking-wide text-amber-950">
      ENTORNO DE {label} — esto no es producción
    </div>
  );
}
