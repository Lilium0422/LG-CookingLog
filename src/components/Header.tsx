"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "./Header.css";

interface HeaderProps {
  isLoggedIn: boolean;
  username?: string;
}

export default function Header({ isLoggedIn, username }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) =>
    pathname === path ? "nav-active" : "nav-inactive";

  return (
    <header className="header">
      <div className="header-inner">
        
        {/* 로고 */}
        <Link href="/home" className="logo">
          <img src="/logo.svg" alt="logo" />
        </Link>

        {/* PC 네비게이션 */}
        <nav className="nav pc-nav">
          <Link href="/home" className={isActive("/home")}>
            홈
          </Link>

          <span className="separator">|</span>

          <div className="nav-dropdown-wrapper">
            <Link href="/recipes" className={isActive("/recipe")}>
              레시피
            </Link>

            <div className="dropdown-menu">
              <Link href="/recipes">좋아요 한 레시피</Link>
            </div>
          </div>

          <span className="separator">|</span>

          <Link href="/calorie" className={isActive("/calorie")}>
            칼로리 분석
          </Link>
        </nav>

        {/* 우측 메뉴 (PC 버전) */}
        <div className="right-menu pc-menu">
          {!isLoggedIn ? (
            <Link href="/login" className="login-btn">
              로그인
            </Link>
          ) : (
            <div className="user-area">
              <img src="/profile-icon.svg" className="profile-icon" />
              <span className="username">{username}</span>
              <button className="logout-btn">로그아웃</button>
              <button className="write-btn">글쓰기</button>
            </div>
          )}
        </div>

        {/* 모바일 햄버거 */}
        <button className="hamburger" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* 모바일 메뉴 */}
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <Link href="/" onClick={() => setOpen(false)}>
          홈
        </Link>

        <Link href="/recipes" onClick={() => setOpen(false)}>
          레시피
        </Link>

        <Link href="/recipes" onClick={() => setOpen(false)}>
          좋아요 한 레시피
        </Link>

        <Link href="/calorie" onClick={() => setOpen(false)}>
          칼로리 분석
        </Link>

        {!isLoggedIn ? (
          <Link href="/login" onClick={() => setOpen(false)}>
            로그인
          </Link>
        ) : (
          <>
            <span className="mobile-username">{username}님</span>
            <Link
                href="/mypage"
                className="mobile-mypage"
                onClick={() => setOpen(false)}
                >
                마이페이지
            </Link>
            <button className="mobile-logout">로그아웃</button>
            <button className="mobile-write">글쓰기</button>
          </>
        )}
      </div>
    </header>
  );
}
