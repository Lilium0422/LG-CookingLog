import type { Metadata } from "next";
import "./globals.css";
import "../fonts/SUIT-Variable.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingChatButton from "@/components/FloatingChatButton";

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
      <body>
        <Header />
        <main style={{ minHeight: "calc(100vh - 140px)" }}>{children}</main>
        <Footer />
        <FloatingChatButton />
      </body>
    </html>
  );
}