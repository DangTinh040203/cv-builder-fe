import "@/styles/globals.css";
import "react-quill-new/dist/quill.snow.css";

import clsx from "clsx";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { type PropsWithChildren } from "react";

import StoreProvider from "@/components/Providers/StorageProvider";
import UserSessionProvider from "@/components/Providers/UserSessionProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata: Metadata = {
  title: "AI-Powered CV Builder",
  description:
    "Create your professional CV in minutes with our AI-powered CV builder. Choose from a variety of templates and customize your resume to stand out to employers.",
};

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={clsx(figtree.className)}>
        <StoreProvider>
          <SessionProvider>
            <UserSessionProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                forcedTheme="light"
              >
                <NextTopLoader
                  showSpinner={false}
                  easing="ease-in-out"
                  color="#4d31ff"
                />
                <Toaster richColors position="bottom-right" />
                {children}
              </ThemeProvider>
            </UserSessionProvider>
          </SessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
