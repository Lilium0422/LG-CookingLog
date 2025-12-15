"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);

  const isActive = (path: string) =>
    pathname === path ? styles.navActive : styles.navInactive;

  /* 로그인 정보 로드 */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setIsLoggedIn(true);
      setNickname(user.nickname);
    }
  }, []);

  /* 로그인 변경(userUpdated) + storage 변경 감지해서 헤더 즉시 반영 */
  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        setIsLoggedIn(true);
        setNickname(user.nickname);
      } else {
        setIsLoggedIn(false);
        setNickname(null);
      }
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("userUpdated", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  /* PC 화면으로 전환될 때 모바일 메뉴 자동 닫기 */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* 로그아웃 */
  const handleLogout = () => {
    localStorage.removeItem("user");

    // 로그인 정보 변화 알림
    window.dispatchEvent(new Event("userUpdated"));

    router.push("/home");
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>

        {/* 로고 */}
        <Link href="/home" className={styles.logo}>
          <img src="/logo.svg" alt="logo" />
        </Link>

        {/* PC NAV */}
        <nav className={styles.pcNav}>
          <Link href="/home" className={isActive("/home")}>홈</Link>
          <span className={styles.separator}>|</span>

          <div className={styles.navDropdownWrapper}>
            <Link href="/recipes" className={isActive("/recipes")}>레시피</Link>

            <div className={styles.dropdownMenu}>
              <Link href="/recipes">좋아요 한 레시피</Link>
            </div>
          </div>

          <span className={styles.separator}>|</span>

          <Link href="/calorie" className={isActive("/calorie")}>
            칼로리 분석
          </Link>
        </nav>

        {/* RIGHT MENU */}
        <div className={styles.pcMenu}>
          {!isLoggedIn ? (
            <Link href="/login" className={styles.loginBtn}>
              로그인
            </Link>
          ) : (
            <div className={styles.userArea}>
              <Link href="/mypage" className={styles.profileWrapper}>
                <img src="/icon/profile-icon.svg" className={styles.profileIcon} />
                <span className={styles.username}>{nickname}님</span>
              </Link>
              
              <button className={styles.logoutBtn} onClick={handleLogout}>
                로그아웃
              </button>

              <button className={styles.writeBtn}>글쓰기</button>
            </div>
          )}
        </div>

        {/* 햄버거 버튼 */}
        <button
          className={styles.hamburger}
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* 모바일 메뉴 */}
      <div className={`${styles.mobileMenu} ${open ? styles.open : ""}`}>
        <Link href="/home" onClick={() => setOpen(false)}>홈</Link>
        <Link href="/recipes" onClick={() => setOpen(false)}>레시피</Link>
        <Link href="/recipes" onClick={() => setOpen(false)}>좋아요 한 레시피</Link>
        <Link href="/calorie" onClick={() => setOpen(false)}>칼로리 분석</Link>

        {!isLoggedIn ? (
          <Link href="/login" onClick={() => setOpen(false)}>로그인</Link>
        ) : (
          <>
            <Link href="/mypage" onClick={() => setOpen(false)}>마이페이지</Link>
            <Link href="/mypage">글쓰기</Link>
            <button className={styles.mobileLogout} onClick={handleLogout}>
              로그아웃
            </button>

          </>
        )}
      </div>
    </header>
  );
}