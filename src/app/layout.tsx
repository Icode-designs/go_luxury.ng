import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import WrapperLayout from "./wrapperLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.goluxuryhair.ng";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Go_LuxuryHair.NG | Luxury Hair. Worth Every Penny.",
    template: "%s | Go_LuxuryHair.NG",
  },
  description:
    "100% authentic donor hair wigs and bundles, ethically sourced. Shipping to Nigeria, the UK, USA, Canada and Europe.",
  keywords: [
    "luxury hair",
    "donor hair wigs",
    "human hair bundles",
    "Nigeria hair vendor",
  ],
  openGraph: {
    title: "Go_LuxuryHair.NG | Luxury Hair. Worth Every Penny.",
    description:
      "100% authentic donor hair wigs and bundles, ethically sourced. Shipping to Nigeria, the UK, USA, Canada and Europe.",
    url: siteUrl,
    siteName: "Go_LuxuryHair.NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Go_LuxuryHair.NG | Luxury Hair. Worth Every Penny.",
    description:
      "100% authentic donor hair wigs and bundles, ethically sourced.",
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
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body>
        <WrapperLayout>{children}</WrapperLayout>
      </body>
    </html>
  );
}
