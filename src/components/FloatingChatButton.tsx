"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./FloatingChatButton.module.css";

export default function FloatingChatButton() {
  const pathname = usePathname();
  const router = useRouter();

  // 챗봇 버튼을 숨길 페이지들
  const hiddenPages = ["/chat", "/recipes/write", "/mypage", "/signup", "/login"];
  
  // 현재 경로가 숨김 페이지에 포함되는지 확인
  const shouldHide = hiddenPages.some(page => pathname.startsWith(page));

  if (shouldHide) {
    return null;
  }

  return (
    <button
      className={styles.floatingButton}
      onClick={() => router.push("/chat")}
      aria-label="챗봇으로 이동"
    >
      <Image
        src="/icon/cookingbot.svg"
        alt="쿠킹봇"
        width={80}
        height={80}
        className={styles.chatIcon}
      />
    </button>
  );
}
