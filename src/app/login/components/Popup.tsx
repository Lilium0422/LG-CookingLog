"use client";

import styles from "./Popup.module.css";

export default function Popup({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <p className={styles.text}>{message}</p>
        <button className={styles.button} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
