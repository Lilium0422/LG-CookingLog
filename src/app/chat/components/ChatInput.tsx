"use client";

import { useRef, useState } from "react";
import styles from "../Chat.module.css";

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string, file?: File) => void;
}) {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (!input && !file) return;
    onSend(input, file || undefined);
    setInput("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <section className={styles.inputSection}>
      <div className={styles.inputBox}>
        {/* 사진 첨부 */}
        <label className={styles.plusBtn}>
          <img src="/icon/plus-button.svg" alt="추가" />
          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/*"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) setFile(f);
              e.target.value = "";
            }}
          />
        </label>

        {/* 📷 첨부된 파일 표시 */}
        {file && (
          <div className={styles.attached}>
            <span>📷 {file.name}</span>
            <button onClick={() => setFile(null)}>✕</button>
          </div>
        )}

        <input
          type="text"
          placeholder="음식 관련 질문을 물어보세요"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") submit();
          }}
        />

        <button onClick={submit}>
          <img src="/icon/send-button.svg" alt="전송" />
        </button>
      </div>

      <p className={styles.notice}>
        쿠킹봇의 답변은 참고용입니다. 실제와 다를 수 있어요.
      </p>
    </section>
  );
}
