import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import enMessages from "../messages/en.json";
import esMessages from "../messages/es.json";

export const SUPPORTED_LOCALES = ["en", "es"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";
export const LOCALE_COOKIE = "NEXT_LOCALE";

const MESSAGES_BY_LOCALE: Record<Locale, typeof enMessages> = {
  en: enMessages,
  es: esMessages,
};

function isSupportedLocale(value: string | undefined): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = isSupportedLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  return {
    locale,
    messages: MESSAGES_BY_LOCALE[locale],
  };
});
