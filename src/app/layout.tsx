import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MainLayout } from "@/components/layout/MainLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deriverse | Trading Analytics Dashboard",
  description: "Professional trading analytics dashboard for Solana perpetual futures. Track your PnL, analyze risk metrics, and optimize your trading strategy.",
  keywords: ["trading", "analytics", "solana", "perpetuals", "derivatives", "crypto"],
  authors: [{ name: "Deriverse Team" }],
  openGraph: {
    title: "Deriverse | Trading Analytics Dashboard",
    description: "Professional trading analytics for Solana perpetual futures",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
