import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { QueryProvider } from "@/lib/query-client";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const thicccboi = localFont({
  variable: "--font-thicccboi",
  src: [
    {
      path: "../public/fonts/thicccboi/THICCCBOI-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/thicccboi/THICCCBOI-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/thicccboi/THICCCBOI-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/thicccboi/THICCCBOI-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/thicccboi/THICCCBOI-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alquenta",
  description: "Property marketplace — browse, list, and offer on properties",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${thicccboi.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <SiteHeader />
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
