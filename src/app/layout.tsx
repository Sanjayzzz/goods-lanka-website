import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "GODS LANKA Tours & Travels | Premium Sri Lanka Tourism",
  description: "Discover the pearl of the Indian Ocean with GODS LANKA Tours & Travels. Luxury tours, exotic destinations, cultural experiences, and unforgettable adventures across Sri Lanka.",
  keywords: "Sri Lanka tours, Sri Lanka tourism, Sri Lanka travel packages, best places in Sri Lanka, luxury Sri Lanka travel, Sri Lanka holidays",
  openGraph: {
    title: "GODS LANKA Tours & Travels | Premium Sri Lanka Tourism",
    description: "Discover the pearl of the Indian Ocean. Luxury tours, exotic destinations, and unforgettable adventures across Sri Lanka.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
