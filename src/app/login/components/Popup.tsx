"use client";

import { useEffect } from "react";
import styles from "./Popup.module.css";

export default function Popup({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  const handleConfirm = () => {
    onClose(); // 팝업만 닫기
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleConfirm();
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

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
