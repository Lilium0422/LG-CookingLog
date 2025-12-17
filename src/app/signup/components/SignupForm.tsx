"use client";

import styles from "../Signup.module.css";

interface SignupFormProps {
  userId: string;
  setUserId: (value: string) => void;
  nickname: string;
  setNickname: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  passwordCheck: string;
  setPasswordCheck: (value: string) => void;
  isUserIdChecked: boolean;
  setIsUserIdChecked: (value: boolean) => void;
  isCheckingUserId: boolean;
  isNicknameChecked: boolean;
  setIsNicknameChecked: (value: boolean) => void;
  isCheckingNickname: boolean;
  passwordMatch: boolean | null;
  setPasswordMatch: (value: boolean | null) => void;
  phoneNumberError: boolean;
  userIdValidation: {
    hasEnglish: boolean;
    isLongEnough: boolean;
    isValid: boolean;
  };
  onCheckUserId: () => void;
  onCheckNickname: () => void;
  onCheckPhoneNumber: () => void;
  onSignup: () => void;
}

export default function SignupForm({
  userId,
  setUserId,
  nickname,
  setNickname,
  phoneNumber,
  setPhoneNumber,
  password,
  setPassword,
  passwordCheck,
  setPasswordCheck,
  isUserIdChecked,
  setIsUserIdChecked,
  isCheckingUserId,
  isNicknameChecked,
  setIsNicknameChecked,
  isCheckingNickname,
  passwordMatch,
  setPasswordMatch,
  phoneNumberError,
  userIdValidation,
  onCheckUserId,
  onCheckNickname,
  onCheckPhoneNumber,
  onSignup,
}: SignupFormProps) {
  return (
    <div className={styles.formBox}>
      {/* 아이디 */}
      <div>
        <div className={styles.row}>
          <div className={styles.inputWrapper} style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="아이디 입력"
              className={styles.input}
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setIsUserIdChecked(false);
              }}
            />
            <img src="/icon/profile-gray-icon.svg" className={styles.icon} alt="" />
          </div>

          <button
            className={`${styles.checkButton} ${
              isUserIdChecked ? styles.checked : ""
            }`}
            onClick={onCheckUserId}
            disabled={isCheckingUserId}
          >
            {isCheckingUserId
              ? "확인 중..."
              : isUserIdChecked
                ? "확인 완료"
                : "중복확인"}
          </button>
        </div>
        {userId && (
          <div className={styles.validationMessages}>
            <div
              className={
                userIdValidation.hasEnglish
                  ? styles.validationSuccess
                  : styles.validationError
              }
            >
              영어 포함
            </div>
            <div
              className={
                userIdValidation.isLongEnough
                  ? styles.validationSuccess
                  : styles.validationError
              }
            >
              5자 이상
            </div>
          </div>
        )}
      </div>

      {/* 닉네임 */}
      <div className={styles.row}>
        <div className={styles.inputWrapper} style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="닉네임 입력"
            className={styles.input}
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setIsNicknameChecked(false);
            }}
          />
          <img src="/icon/profile-gray-icon.svg" className={styles.icon} alt="" />
        </div>

        <button
          className={`${styles.checkButton} ${
            isNicknameChecked ? styles.checked : ""
          }`}
          onClick={onCheckNickname}
          disabled={isCheckingNickname}
        >
          {isCheckingNickname
            ? "확인 중..."
            : isNicknameChecked
              ? "확인 완료"
              : "중복확인"}
        </button>
      </div>

      {/* 전화번호 */}
      <div>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="010-1234-5678"
            className={styles.input}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onBlur={onCheckPhoneNumber}
            maxLength={13}
          />
          <img src="/icon/phone-icon.svg" className={styles.icon} alt="" />
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
            if (newPassword && passwordCheck) {
              setPasswordMatch(newPassword === passwordCheck);
            } else {
              setPasswordMatch(null);
            }
          }}
        />
        <img src="/icon/lock-icon.svg" className={styles.icon} alt="" />
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
              if (password && newPasswordCheck) {
                setPasswordMatch(password === newPasswordCheck);
              } else {
                setPasswordMatch(null);
              }
            }}
          />
          <img src="/icon/lock-icon.svg" className={styles.icon} alt="" />
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

      <button className={styles.signupButton} onClick={onSignup}>
        회원가입
      </button>
    </div>
  );
}
