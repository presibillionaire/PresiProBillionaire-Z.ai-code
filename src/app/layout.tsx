import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PresiProBillionaire - AI-Powered Deriv Trading Signals",
  description: "AI-powered Deriv trading signals for smarter Rise/Fall entries with dual-thread simultaneous contract deployment.",
  keywords: ["PresiProBillionaire", "Deriv", "AI", "Trading Signals", "Binary Options"],
  authors: [{ name: "PresiProBillionaire" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "PresiProBillionaire",
    description: "AI-Powered Deriv Trading Signals",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PresiProBillionaire",
    description: "AI-Powered Deriv Trading Signals",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#030712] text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
