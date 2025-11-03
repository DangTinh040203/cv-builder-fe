import "@/styles/globals.css";

import clsx from "clsx";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/components/ui/store-provider";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={clsx(figtree.className)}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            forcedTheme="light"
          >
            <StoreProvider>
              <Toaster richColors position="bottom-right" />
              {children}
            </StoreProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
