"use client";

import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

export default function Footer() {
  const pathname = usePathname();

  // 로그인 & 마이페이지 Footer 숨김
  if (pathname === "/login" || pathname === "/mypage" || pathname === "/signup") {
    return null;
  }
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        
        {/* Left */}
        <div className={styles.left}>
          <p className={styles.brand}>© 2024 CookingLog</p>
          <p className={styles.desc}>
            CookingLog는 레시피를 공유하고 탐색하며,
            함께 요리 경험을 나누는 커뮤니티 플랫폼입니다.  
            더 나은 요리 경험을 위해 Team 2는 계속 발전하고 있습니다.
          </p>
        </div>

        {/* Right */}
        <div className={styles.right}>
          <p className={styles.teamTitle}>Team 2</p>
          <p className={styles.teamList}>
            김예린 · 류종현 · 이동연 · 이혁준
          </p>
          <p className={styles.program}>LG U+ Ureca Front 3기 프로젝트</p>
        </div>

      </div>
    </footer>
  );
}
