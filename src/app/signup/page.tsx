"use client";

import React, { useState } from "react";
import styles from "./Signup.module.css";
import Popup from "../login/components/Popup";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  // 전화번호 하이픈 자동 입력 함수
  const formatPhoneNumber = (value: string) => {
    const onlyNums = value.replace(/[^0-9]/g, "");

    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 8) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
  };

  // 회원가입 요청
  const handleSignup = async () => {
    if (!userId || !nickname || !phoneNumber || !password || !passwordCheck) {
      setPopupMessage("모든 칸을 알맞게 작성해주세요.");
      return;
    }

    if (password !== passwordCheck) {
      setPopupMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    const signupData = {
      userId,
      nickname,
      phoneNumber,
      password,
    };

    console.log("회원가입 요청:", signupData);

    try {
      const response = await fetch(
        "https://after-ungratifying-lilyanna.ngrok-free.dev/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(signupData),
        }
      );

      let responseData = null;

      try {
        responseData = await response.json();
      } catch {
        // JSON 이 아닐 수 있음
      }

      if (response.ok) {
        setPopupMessage("회원가입이 완료되었습니다!");
      } else {
        console.error("회원가입 실패:", response.status, responseData);

        setPopupMessage(
          responseData?.message
            ? `회원가입 실패: ${responseData.message}`
            : "회원가입에 실패했습니다."
        );
      }
    } catch (error) {
      console.error("서버 요청 오류:", error);
      setPopupMessage("서버와 연결할 수 없습니다.");
    }
  };

  const handlePopupClose = () => {
    setPopupMessage(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>회원가입</div>
      <div className={styles.subtitle}>회원정보</div>

      <div className={styles.divider}></div>

      <div className={styles.formBox}>
        {/* 아이디 */}
        <div className={styles.row}>
          <div className={styles.inputWrapper} style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="아이디 입력"
              className={styles.input}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <img src="/icon/profile-gray-icon.svg" className={styles.icon} />
          </div>

          <button className={styles.checkButton} onClick={() => {}}>
            중복확인
          </button>
        </div>

        {/* 닉네임 */}
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="닉네임 입력"
            className={styles.input}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <img src="/icon/profile-gray-icon.svg" className={styles.icon} />
        </div>

        {/* 전화번호 */}
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="010-1234-5678"
            className={styles.input}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
            maxLength={13}
          />
          <img src="/icon/phone-icon.svg" className={styles.icon} />
        </div>

        {/* 비밀번호 */}
        <div className={styles.inputWrapper}>
          <input
            type="password"
            placeholder="비밀번호 입력"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <img src="/icon/lock-icon.svg" className={styles.icon} />
        </div>

        {/* 비밀번호 확인 */}
        <div className={styles.inputWrapper}>
          <input
            type="password"
            placeholder="비밀번호 재입력"
            className={styles.input}
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
          <img src="/icon/lock-icon.svg" className={styles.icon} />
        </div>

        <button className={styles.signupButton} onClick={handleSignup}>
          회원가입
        </button>
      </div>

      {popupMessage && (
        <Popup message={popupMessage} onClose={handlePopupClose} />
      )}
    </div>
  );
}