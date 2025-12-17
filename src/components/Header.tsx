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

  /* 로그인 정보 로드 + 변경 감지 */
  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("user");

      if (!stored) {
        setIsLoggedIn(false);
        setNickname(null);
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        console.log("헤더에서 파싱한 유저 정보:", parsed);

        const userNickname = parsed.nickname || parsed.user?.nickname;

        if (userNickname) {
          setIsLoggedIn(true);
          setNickname(userNickname);
          console.log("로그인 상태 업데이트:", userNickname);
        } else {
          setIsLoggedIn(false);
          setNickname(null);
        }
      } catch (error) {
        console.error("유저 정보 파싱 실패:", error);
        setIsLoggedIn(false);
        setNickname(null);
      }
    };

    // 최초 실행
    syncUser();

    // 이벤트 리스너 등록
    window.addEventListener("storage", syncUser);
    window.addEventListener("userUpdated", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  /* PC 화면 전환 시 모바일 메뉴 닫기 */
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
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setNickname(null);
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

          <Link href="/chat" className={isActive("/chat")}>쿠킹봇</Link>

          <span className={styles.separator}>|</span>

          <Link href="/event" className={isActive("/event")}>이벤트</Link>
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
                <img
                  src="/icon/profile-icon.svg"
                  className={styles.profileIcon}
                  alt="profile"
                />
                <span className={styles.username}>
                  {nickname} 님
                </span>
              </Link>

              <button
                className={styles.logoutBtn}
                onClick={handleLogout}
              >
                로그아웃
              </button>

              <Link href="/recipes/write" className={styles.writeBtn}>
                글쓰기
              </Link>
            </div>
          )}
        </div>

        {/* 햄버거 */}
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
        <Link href="/evnet" onClick={() => setOpen(false)}>이벤트</Link>

        {!isLoggedIn ? (
          <Link href="/login" onClick={() => setOpen(false)}>
            로그인
          </Link>
        ) : (
          <>
            <Link href="/mypage" onClick={() => setOpen(false)}>
              마이페이지
            </Link>
            <Link href="/recipes/write" onClick={() => setOpen(false)}>
              글쓰기
            </Link>
            <button
              className={styles.mobileLogout}
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </header>
  );
}
