import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingChatButton from "@/components/FloatingChatButton";

//폰트 적용 (나중에 suite variable 바꿔야함)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"], //기본 영어권 글자셋만
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//브라우저 탭 제목
export const metadata: Metadata = {
  title: "쿠킹로그 - CookingLog",
  description: "레시피 공유 및 별점 플랫폼",
  icons: {
    icon: "/tab-logo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <main style={{ minHeight: "calc(100vh - 140px)" }}>{children}</main>
        <Footer />
        <FloatingChatButton />
      </body>
    </html>
  );
}