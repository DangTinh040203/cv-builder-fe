import "@/styles/theme.css";
import "@shared/ui/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@shared/ui/components/sonner";
import { type Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CVCraft - AI-powered CV builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`
            ${fontSans.variable}
            ${fontMono.variable}
            scrollbar-thin max-w-screen overflow-x-hidden font-sans antialiased
          `}
        >
          <Toaster richColors />
          <NextTopLoader
            color="#6c23d7"
            showSpinner={false}
            easing="ease-in-out"
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
