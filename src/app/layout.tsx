import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "쿠킹로그 - CookingLog",
  description: "레시피 공유 및 별점 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = false;
  const username = "사용자";

  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header isLoggedIn={isLoggedIn} username={username} />
        <main style={{ minHeight: "calc(100vh - 140px)" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
