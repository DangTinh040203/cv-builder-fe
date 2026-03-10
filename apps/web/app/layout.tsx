import "@/styles/theme.css";
import "@shared/ui/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@shared/ui/components/sonner";
import { type Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { ScrollToTop } from "@/components/common/scroll-to-top";
import StoreProvider from "@/components/providers/store-provider";

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
  title: {
    default: "CVCraft - AI-Powered Professional CV Builder",
    template: "%s | CVCraft",
  },
  description:
    "Build a stunning, professional, and ATS-optimized CV in minutes with CVCraft. AI-powered content generation, professional templates, and mock interview practice.",
  keywords: [
    "CV builder",
    "resume builder",
    "AI CV",
    "AI resume",
    "professional CV",
    "ATS optimized resume",
    "career builder",
    "mock interview",
    "job search toolkit",
  ],
  authors: [{ name: "CVCraft Team" }],
  creator: "CVCraft",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cvcraft.site",
    title: "CVCraft - AI-Powered Professional CV Builder",
    description:
      "Craft stunning, ATS-friendly resumes in minutes with AI. Join thousands of professionals landing their dream jobs.",
    siteName: "CVCraft",
    images: [
      {
        url: "https://cvcraft.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "CVCraft - AI-Powered CV Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CVCraft - AI-Powered Professional CV Builder",
    description:
      "Craft stunning, ATS-friendly resumes in minutes with AI. Join thousands of professionals landing their dream jobs.",
    images: ["https://cvcraft.site/og-image.png"],
    creator: "@cvcraft",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/builder"
      afterSignOutUrl="/auth/sign-in"
    >
      <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
        <body
          className={`
            ${fontSans.variable}
            ${fontMono.variable}
            scrollbar-thin w-full max-w-screen overflow-x-hidden font-sans
            antialiased
          `}
        >
          <StoreProvider>
            <Toaster richColors />
            <NextTopLoader
              color="#6c23d7"
              showSpinner={false}
              easing="ease-in-out"
            />
            <ScrollToTop />
            {children}
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
