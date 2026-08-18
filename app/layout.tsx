import { Geist_Mono, Manrope } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { QueryProvider } from "@/lib/query-client";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { EnvironmentBanner } from "@/components/layout/environment-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { fetchCurrentUserServer } from "@/lib/api/auth.server";
import { CURRENT_USER_QUERY_KEY } from "@/lib/api/query-keys";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-brand",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const t = await getTranslations("meta");
  return {
    title: "Alquenta",
    description: t("description"),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const messages = await getMessages();

  // Prefetches the session server-side so SiteHeader/ContactBox mount
  // already knowing whether there's a user, instead of flashing a loading
  // skeleton until the client-side query resolves (see front/CLAUDE.md's
  // F-00 note). Failures here are swallowed by prefetchQuery — the client
  // just falls back to its own fetch, same as before this existed.
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: fetchCurrentUserServer,
  });

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <QueryProvider>
              <HydrationBoundary state={dehydrate(queryClient)}>
                <EnvironmentBanner />
                <SiteHeader />
                {children}
                <SiteFooter />
                <Toaster />
              </HydrationBoundary>
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
