"use client";

import { useState } from "react";
import styles from "./Signup.module.css";
import Popup from "../login/components/Popup";
import SignupForm from "./components/SignupForm";
import { useRouter } from "next/navigation";
import {
  formatPhoneNumber,
  checkUserIdDuplicate,
  checkNicknameDuplicate,
  signupUser,
  validateUserId,
} from "./utils/signupUtils";

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
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [userIdValidation, setUserIdValidation] = useState({
    hasEnglish: false,
    isLongEnough: false,
    isValid: false,
  });

  // 아이디 중복 확인
  const handleCheckUserId = async () => {
    if (!userId) {
      setPopupMessage("아이디를 입력해주세요.");
      return;
    }

    // 아이디 유효성 검사
    const validation = validateUserId(userId);
    if (!validation.isValid) {
      setPopupMessage("아이디는 영어를 포함하여 5자 이상이어야 합니다.");
      return;
    }

    setIsCheckingUserId(true);
    const result = await checkUserIdDuplicate(userId);
    setIsCheckingUserId(false);

    setPopupMessage(result.message);
    setIsUserIdChecked(result.success);
  };

  // 아이디 변경 핸들러
  const handleUserIdChange = (value: string) => {
    setUserId(value);
    setIsUserIdChecked(false);
    setUserIdValidation(validateUserId(value));
  };

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (!nickname) {
      setPopupMessage("닉네임을 입력해주세요.");
      return;
    }

    setIsCheckingNickname(true);
    const result = await checkNicknameDuplicate(nickname);
    setIsCheckingNickname(false);

    setPopupMessage(result.message);
    setIsNicknameChecked(result.success);
  };

  // 회원가입 요청
  const handleSignup = async () => {
    if (!userId || !nickname || !phoneNumber || !password || !passwordCheck) {
      setPopupMessage("모든 칸을 알맞게 작성해주세요.");
      return;
    }

    // 아이디 유효성 검사
    const validation = validateUserId(userId);
    if (!validation.isValid) {
      setPopupMessage("아이디는 영어를 포함하여 5자 이상이어야 합니다.");
      return;
    }

    if (!isUserIdChecked) {
      setPopupMessage("아이디 중복 확인을 해주세요.");
      return;
    }

    if (!isNicknameChecked) {
      setPopupMessage("닉네임 중복 확인을 해주세요.");
      return;
    }

    if (password !== passwordCheck) {
      setPopupMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    const result = await signupUser({
      userId,
      nickname,
      phoneNumber,
      password,
    });

    setPopupMessage(result.message);
    setSignupSuccess(result.success);
  };

  const handlePopupClose = () => {
    setPopupMessage(null);

    // 회원가입 성공 시에만 로그인 페이지로 이동
    if (signupSuccess) {
      router.push("/login");
    }
  };

  // 전화번호 유효성 체크
  const handleCheckPhoneNumber = () => {
    if (phoneNumber && phoneNumber.replace(/-/g, "").length < 11) {
      setPhoneNumberError(true);
      setTimeout(() => setPhoneNumberError(false), 3000);
    }
  };

  // 전화번호 포맷 적용
  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(formatPhoneNumber(value));
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>회원가입</div>
      <div className={styles.subtitle}>회원정보</div>

      <div className={styles.divider}></div>

      <SignupForm
        userId={userId}
        setUserId={handleUserIdChange}
        nickname={nickname}
        setNickname={setNickname}
        phoneNumber={phoneNumber}
        setPhoneNumber={handlePhoneNumberChange}
        password={password}
        setPassword={setPassword}
        passwordCheck={passwordCheck}
        setPasswordCheck={setPasswordCheck}
        isUserIdChecked={isUserIdChecked}
        setIsUserIdChecked={setIsUserIdChecked}
        isCheckingUserId={isCheckingUserId}
        isNicknameChecked={isNicknameChecked}
        setIsNicknameChecked={setIsNicknameChecked}
        isCheckingNickname={isCheckingNickname}
        passwordMatch={passwordMatch}
        setPasswordMatch={setPasswordMatch}
        phoneNumberError={phoneNumberError}
        userIdValidation={userIdValidation}
        onCheckUserId={handleCheckUserId}
        onCheckNickname={handleCheckNickname}
        onCheckPhoneNumber={handleCheckPhoneNumber}
        onSignup={handleSignup}
      />

      {popupMessage && (
        <Popup message={popupMessage} onClose={handlePopupClose} />
      )}
    </div>
  );
}