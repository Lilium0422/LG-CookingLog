"use client";

import { useState } from "react";
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
  const [isUserIdChecked, setIsUserIdChecked] = useState(false);
  const [isCheckingUserId, setIsCheckingUserId] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // 아이디 중복 확인
  const handleCheckUserId = async () => {
    if (!userId) {
      setPopupMessage("아이디를 입력해주세요.");
      return;
    }

    setIsCheckingUserId(true);

    try {
      const response = await fetch(
        `https://after-ungratifying-lilyanna.ngrok-free.dev/api/users/check-userid/${userId}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      console.log("중복 확인 응답 상태:", response.status);
      const data = await response.json();
      console.log("중복 확인 응답 데이터:", data);

      if (response.ok) {
        // isDuplicate가 false면 사용 가능, true면 중복
        if (data.isDuplicate === false) {
          setPopupMessage("사용 가능한 아이디입니다!");
          setIsUserIdChecked(true);
        } else if (data.isDuplicate === true) {
          setPopupMessage("이미 사용 중인 아이디입니다.");
          setIsUserIdChecked(false);
        } else {
          // 예전 API 형식 (available) 지원
          if (data.available) {
            setPopupMessage("사용 가능한 아이디입니다!");
            setIsUserIdChecked(true);
          } else {
            setPopupMessage("이미 사용 중인 아이디입니다.");
            setIsUserIdChecked(false);
          }
        }
      } else {
        console.error("중복 확인 실패 - 상태 코드:", response.status, "데이터:", data);
        setPopupMessage("중복 확인에 실패했습니다.");
        setIsUserIdChecked(false);
      }
    } catch (error) {
      console.error("아이디 중복 확인 오류:", error);
      setPopupMessage("서버와 연결할 수 없습니다.");
      setIsUserIdChecked(false);
    } finally {
      setIsCheckingUserId(false);
    }
  };

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

    if (!isUserIdChecked) {
      setPopupMessage("아이디 중복 확인을 해주세요.");
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
        setSignupSuccess(true);
      } else {
        console.error("회원가입 실패:", response.status, responseData);

        setPopupMessage(
          responseData?.message
            ? `회원가입 실패: ${responseData.message}`
            : "회원가입에 실패했습니다."
        );
        setSignupSuccess(false);
      }
    } catch (error) {
      console.error("서버 요청 오류:", error);
      setPopupMessage("서버와 연결할 수 없습니다.");
    }
  };

  const handlePopupClose = () => {
    setPopupMessage(null);
    
    // 회원가입 성공 시에만 로그인 페이지로 이동
    if (signupSuccess) {
      router.push("/login");
    }
    // 실패 시에는 현재 페이지 유지
  };

  // 전화번호 유효성 체크
  const checkPhoneNumber = () => {
    if (phoneNumber && phoneNumber.replace(/-/g, "").length < 11) {
      setPhoneNumberError(true);
      setTimeout(() => setPhoneNumberError(false), 3000);
    }
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
              onChange={(e) => {
                setUserId(e.target.value);
                setIsUserIdChecked(false); // 아이디 변경 시 중복 확인 초기화
              }}
            />
            <img src="/icon/profile-gray-icon.svg" className={styles.icon} />
          </div>

          <button
            className={`${styles.checkButton} ${
              isUserIdChecked ? styles.checked : ""
            }`}
            onClick={handleCheckUserId}
            disabled={isCheckingUserId}
          >
            {isCheckingUserId ? "확인 중..." : isUserIdChecked ? "확인 완료" : "중복확인"}
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
        <div>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="010-1234-5678"
              className={styles.input}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
              onBlur={checkPhoneNumber}
              maxLength={13}
            />
            <img src="/icon/phone-icon.svg" className={styles.icon} />
          </div>
          {phoneNumberError && (
            <div className={styles.errorMessage}>11자리 모두 입력해주세요</div>
          )}
        </div>

        {/* 비밀번호 */}
        <div className={styles.inputWrapper}>
          <input
            type="password"
            placeholder="비밀번호 입력"
            className={styles.input}
            value={password}
            onChange={(e) => {
              const newPassword = e.target.value;
              setPassword(newPassword);
              // 비밀번호 변경 시 일치 여부 체크 (새 값으로 직접 비교)
              if (newPassword && passwordCheck) {
                setPasswordMatch(newPassword === passwordCheck);
              } else {
                setPasswordMatch(null);
              }
            }}
          />
          <img src="/icon/lock-icon.svg" className={styles.icon} />
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <div className={styles.inputWrapper}>
            <input
              type="password"
              placeholder="비밀번호 재입력"
              className={styles.input}
              value={passwordCheck}
              onChange={(e) => {
                const newPasswordCheck = e.target.value;
                setPasswordCheck(newPasswordCheck);
                // 비밀번호 확인 변경 시 일치 여부 체크 (새 값으로 직접 비교)
                if (password && newPasswordCheck) {
                  setPasswordMatch(password === newPasswordCheck);
                } else {
                  setPasswordMatch(null);
                }
              }}
            />
            <img src="/icon/lock-icon.svg" className={styles.icon} />
          </div>
          {passwordMatch !== null && (
            <div
              className={
                passwordMatch ? styles.successMessage : styles.errorMessage
              }
            >
              {passwordMatch
                ? "비밀번호가 일치합니다"
                : "비밀번호가 일치하지 않습니다"}
            </div>
          )}
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