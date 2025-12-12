"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./LoginPage.module.css";
import Popup from "./components/Popup";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const handleLogin = () => {
    // 예시용: 아이디 test / 비번 1234일 때 성공
    const isValid = id === "test" && pw === "1234";

    if (!isValid) {
      setPopupMessage("아이디/비밀번호를 다시 확인해주세요.");
      return;
    }

    // 성공 → 유저 닉네임 예시 "예린"
    setPopupMessage(`${id}님, 로그인이 완료되었습니다!`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>로그인하기</div>
      <div className={styles.subtitle}>가입한 아이디로 로그인하세요.</div>

      <div className={styles.divider} />

      <div className={styles.formBox}>
        {/* 아이디 */}
        <div className={styles.inputWrapper}>
          <img src="/icon/profile-gray-icon.svg" className={styles.icon} />
          <input
            type="text"
            placeholder="아이디를 입력하시오"
            className={styles.input}
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        {/* 비밀번호 */}
        <div className={styles.inputWrapper}>
          <img src="/icon/lock-icon.svg" className={styles.icon} />
          <input
            type="password"
            placeholder="비밀번호를 입력하시오"
            className={styles.input}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </div>

        {/* 로그인 버튼 */}
        <button className={styles.loginButton} onClick={handleLogin}>
          로그인
        </button>

        {/* 회원가입 */}
        <div className={styles.signupWrapper}>
          <span className={styles.noAccount}>계정이 없으신가요?</span>
          <Link href="/signup" className={styles.signupLink}>
            회원가입
          </Link>
        </div>
      </div>

      {/* 팝업 */}
      {popupMessage && (
        <Popup message={popupMessage} onClose={() => setPopupMessage(null)} />
      )}
    </div>
  );
}
