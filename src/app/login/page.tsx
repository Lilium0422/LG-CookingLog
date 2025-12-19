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

      if (!response.ok) {
        setPopupMessage("아이디/비밀번호를 다시 확인해주세요.");
        setLoginSuccess(false);
        return;
      }

      const data = await response.json();
      console.log("로그인 응답:", data);

      // 토큰 저장
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // 사용자 정보 저장
      const userInfo = {
        userId: data.user?.userId || data.userId,
        nickname: data.user?.nickname || data.nickname,
        id: data.user?.id,
        phoneNumber: data.user?.phoneNumber,
        bio: data.user?.bio,
        profileImageUrl: data.user?.profileImageUrl,
        role: data.user?.role,
      };

      console.log("저장할 유저 정보:", userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo));

      // 헤더 즉시 갱신 (약간의 지연 추가)
      setTimeout(() => {
        window.dispatchEvent(new Event("userUpdated"));
      }, 100);

      setPopupMessage(`${userInfo.nickname}님, 로그인이 완료되었습니다!`);
      setLoginSuccess(true);
    } catch (error) {
      console.error("로그인 오류:", error);
      setPopupMessage("서버와 연결할 수 없습니다.");
      setLoginSuccess(false);
    }
  };

  const handlePopupClose = () => {
    setPopupMessage(null);

    // 로그인 성공 시에만 홈으로 이동
    if (loginSuccess) {
      router.push("/home");
    }
    // 실패 시에는 현재 페이지 유지
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
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
            onKeyPress={handleKeyPress}
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
            onKeyPress={handleKeyPress}
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
