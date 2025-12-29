import "@/styles/theme.css";
import "@shared/ui/globals.css";

import { type Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import Footer from "@/components/Layout/footer";
import Header from "@/components/Layout/header";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${fontSans.variable}
          ${fontMono.variable}
          font-sans antialiased
        `}
      >
        <NextTopLoader
          color="#6c23d7"
          showSpinner={false}
          easing="ease-in-out"
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
