"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./LoginPage.module.css";
import Popup from "./components/Popup";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!id || !pw) {
      setPopupMessage("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    const loginData = {
      userId: id,
      password: pw,
    };

    try {
      const response = await fetch(
        "https://after-ungratifying-lilyanna.ngrok-free.dev/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(loginData),
        }
      );

      console.log("응답 상태:", response.status); // 상태 코드 확인

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.log("응답 에러 데이터:", errorData);
        setPopupMessage("아이디/비밀번호를 다시 확인해주세요.");
        setLoginSuccess(false);
        return;
      }

      const data = await response.json();
      console.log("응답 데이터:", data); // 서버에서 반환된 데이터 확인

      // 로그인 성공 → 응답 데이터 그대로 저장
      localStorage.setItem("user", JSON.stringify(data));

      setPopupMessage(`${id}님, 로그인이 완료되었습니다!`);
      setLoginSuccess(true);
    } catch (error) {
      console.error("로그인 오류:", error);
      setPopupMessage("서버와 연결할 수 없습니다.");
      setLoginSuccess(false);
    }
  };

  const handlePopupClose = () => {
    setPopupMessage(null);

    if (loginSuccess) {
      router.push("/home");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>로그인하기</div>
      <div className={styles.subtitle}>가입한 아이디로 로그인하세요.</div>

      <div className={styles.divider} />

      <div className={styles.formBox}>
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

        <button className={styles.loginButton} onClick={handleLogin}>
          로그인
        </button>

        <div className={styles.signupWrapper}>
          <span className={styles.noAccount}>계정이 없으신가요?</span>
          <Link href="/signup" className={styles.signupLink}>
            회원가입
          </Link>
        </div>
      </div>

      {popupMessage && (
        <Popup message={popupMessage} onClose={handlePopupClose} />
      )}
    </div>
  );
}
