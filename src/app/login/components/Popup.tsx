"use client";

import styles from "./Popup.module.css";
import { useRouter } from "next/navigation";

export default function Popup({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  const router = useRouter();

  const handleConfirm = () => {
    onClose(); // 팝업 닫기

    // 팝업 닫힌 후 페이지 이동 + 로그인 반영
    setTimeout(() => {
      router.push("/home");

      // 헤더가 마운트된 후 이벤트 전달
      setTimeout(() => {
        window.dispatchEvent(new Event("userUpdated"));
      }, 50);
    }, 0);
  };

  return (
    <div className={styles.overlay} onClick={handleConfirm}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <p className={styles.text}>{message}</p>
        <button className={styles.button} onClick={handleConfirm}>
          확인
        </button>
      </div>
    </div>
  );
}
