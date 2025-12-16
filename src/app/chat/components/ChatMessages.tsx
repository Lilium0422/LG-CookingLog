"use client";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import styles from "../Chat.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK = [
  "오늘의 추천 메뉴",
  "성인 권장 칼로리",
  "쿠킹봇이 뭐야?",
  "최근 인기 음식",
];

export default function ChatMessages({
  messages,
  loading,
  onQuickSend,
}: {
  messages: Message[];
  loading: boolean;
  onQuickSend: (msg: string) => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <section className={styles.chatArea}>
      {messages.length === 0 && (
        <div className={styles.emptyState}>
          <p>
            무엇을 도와드릴까요?
            <br />
            <span>오늘 먹은 음식 사진을 쿠킹봇</span>에 분석해보세요
          </p>

          <div className={styles.quickButtons}>
            {QUICK.map(q => (
              <button key={q} onClick={() => onQuickSend(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg, i) => (
        <div
          key={i}
          className={
            msg.role === "user"
              ? styles.userBubble
              : styles.botBubble
          }
        >
          {msg.role === "assistant" ? (
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          ) : (
            msg.content
          )}
        </div>
      ))}

      {loading && <div className={styles.spinner} />}
      <div ref={endRef} />
    </section>
  );
}
