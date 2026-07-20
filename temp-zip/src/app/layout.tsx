import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Joka Joki - Jasa Joki Mobile Legends Profesional",
  description: "Jasa Joki MLBB terpercaya, aman, dan profesional. Sistem operasional mabar VIP, live tracking antrean, dan pengerjaan cepat oleh penjoki Mythical Glory/Immortal.",
  keywords: ["Joki ML", "Joki Mobile Legends", "Jasa Joki MLBB", "Mabar VIP ML", "Joki ML Terpercaya", "Jokajoki", "Joki Mythic", "Joki Glory", "Joki Immortal"],
  authors: [{ name: "Joka Joki" }],
  openGraph: {
    title: "Joka Joki - Jasa Joki Mobile Legends Profesional",
    description: "Jasa Joki MLBB terpercaya, aman, dan profesional. Cek antrean live kamu sekarang juga!",
    url: "https://jokajoki.my.id",
    siteName: "Joka Joki",
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  verification: {
    google: "HzY_CVH6eDxsX5qVGPtTMY-_4CdhtNoWBqgwPMtUzrs", // JANGAN DIHAPUS (Untuk Google Search Console)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${barlowCondensed.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
