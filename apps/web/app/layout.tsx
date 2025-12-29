import "@/styles/theme.css";
import "@shared/ui/globals.css";

import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Footer from "@/components/Layout/footer";
import Header from "@/components/Layout/header";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${fontSans.variable}
          ${fontMono.variable}
          font-sans antialiased
        `}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
