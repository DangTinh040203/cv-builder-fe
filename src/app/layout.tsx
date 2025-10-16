import "@/styles/globals.css";

import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/components/ui/store-provider";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata: Metadata = {
  title: "Cv Builder",
  description:
    "Create your professional CV in minutes with our AI-powered CV builder. Choose from a variety of templates and customize your resume to stand out to employers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <Toaster richColors position="top-right" />
            {children}
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
