/**
 * Maps a fixed list of enum values through a translate function. Shared by
 * labels.ts (client, useTranslations) and labels.server.ts (RSC,
 * getTranslations) so the set of keys per enum lives in one place
 * (types/enums.ts's *_VALUES arrays) instead of being re-listed per file.
 */
export function buildLabels<T extends string>(
  values: readonly T[],
  t: (key: T) => string,
): Record<T, string> {
  return Object.fromEntries(values.map((value) => [value, t(value)])) as Record<
    T,
    string
  >;
}
