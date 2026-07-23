import type { Metadata } from "next";
import { Playfair_Display, Inter, Tenor_Sans, Noto_Sans_Arabic } from "next/font/google";
import { ClientProviders } from "@/components/layout/client-providers";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  style: "normal",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const tenorSans = Tenor_Sans({
  variable: "--font-tenor",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lyzane — Classic Tuxedo & Mocassin Shoes",
    template: "%s | Lyzane",
  },
  description:
    "Handcrafted tuxedo and mocassin shoes. Luxury footwear, timeless elegance.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Lyzane",
    title: "Lyzane — Classic Tuxedo & Mocassin Shoes",
    description:
      "Handcrafted tuxedo and mocassin shoes. Luxury footwear, timeless elegance.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyzane — Classic Tuxedo & Mocassin Shoes",
    description:
      "Handcrafted tuxedo and mocassin shoes. Luxury footwear, timeless elegance.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${playfair.variable} ${inter.variable} ${tenorSans.variable} ${notoArabic.variable} h-full antialiased overflow-x-hidden`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
