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
  metadataBase: new URL("https://lyzane.co"),
  title: {
    default: "Lyzane — Handcrafted Tuxedo & Mocassin Shoes | Luxury Footwear",
    template: "%s | Lyzane",
  },
  description:
    "Lyzane crafts handcrafted tuxedo and mocassin shoes in Fez, Morocco. Premium Italian leather, timeless elegance. Free delivery on orders over 1000 DH.",
  keywords: [
    "tuxedo shoes",
    "mocassin shoes",
    "handcrafted shoes",
    "luxury footwear",
    "Italian leather shoes",
    "classic shoes",
    "dress shoes",
    "Moroccan craftsmanship",
    "Lyzane",
    "formal shoes",
    "men's shoes Morocco",
    "black tie shoes",
    "wedding shoes",
    "handmade loafers",
  ],
  authors: [{ name: "Lyzane" }],
  creator: "Lyzane",
  publisher: "Lyzane",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lyzane.co",
    siteName: "Lyzane",
    title: "Lyzane — Handcrafted Tuxedo & Mocassin Shoes",
    description:
      "Handcrafted tuxedo and mocassin shoes. Premium Italian leather, timeless elegance. Free delivery on orders over 1000 DH.",
    images: [
      {
        url: "https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804012/lyzane/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Lyzane — Classic Tuxedo & Mocassin Shoes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyzane — Handcrafted Tuxedo & Mocassin Shoes",
    description:
      "Handcrafted tuxedo and mocassin shoes. Premium Italian leather, timeless elegance.",
    images: ["https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804012/lyzane/logo.jpg"],
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
  alternates: {
    canonical: "https://lyzane.co",
    languages: {
      "en": "https://lyzane.co",
      "ar": "https://lyzane.co",
      "fr": "https://lyzane.co",
    },
  },
  icons: {
    icon: "https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804013/lyzane/logo1v1.png",
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
        <link rel="icon" href="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804013/lyzane/logo1v1.png" type="image/png" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804013/lyzane/logo1v1.png" />
        <meta name="theme-color" content="#0d0c0a" />
        <meta name="google-site-verification" content="yPkYViTQP1IcX5oemeMg5XdsXgMdQP5V0eTwiLPLeTM" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ShoeStore",
              name: "Lyzane",
              description: "Handcrafted tuxedo and mocassin shoes. Premium Italian leather, timeless elegance.",
              url: "https://lyzane.co",
              logo: "https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804013/lyzane/logo1v1.png",
              image: "https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804012/lyzane/logo.jpg",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Fez",
                addressCountry: "MA",
              },
              sameAs: [
                "https://www.instagram.com/lyzane.co",
                "https://www.facebook.com/share/1BvUC9CRxt",
              ],
              priceRange: "$$",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
