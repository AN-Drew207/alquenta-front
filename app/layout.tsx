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

  // Fetches the session server-side so SiteHeader/ContactBox mount already
  // knowing whether there's a user, instead of flashing a loading skeleton
  // until the client-side query resolves. Failures here (network error,
  // API down) are caught and treated as "unknown" — the client just falls
  // back to its own fetch, same as before this existed.
  //
  // Once deployed, front (Vercel) and API (Render) live on different
  // domains — the session cookie is scoped to the API's own host, so
  // `cookies()` here (reading what the browser sent to the FRONT's domain)
  // never sees it, and fetchCurrentUserServer always comes back null, even
  // for a logged-in visitor. Hydrating the client cache with that false
  // `null` used to make useRequireRole redirect a genuinely logged-in user
  // to /login on every reload (and left the old account's cached avatar
  // behind after logging back in as someone else, since that redirect
  // never went through the real logout path). So: only seed the client
  // cache when SSR actually found a user — a negative result is left
  // unseeded, and the client does its own authenticated check (a real
  // cross-origin fetch, which does carry the cookie) instead of trusting a
  // server-side null that may just mean "couldn't see the cookie".
  const queryClient = new QueryClient();
  const ssrUser = await fetchCurrentUserServer().catch(() => null);
  if (ssrUser) {
    queryClient.setQueryData(CURRENT_USER_QUERY_KEY, ssrUser);
  }

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
