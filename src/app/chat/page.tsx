"use client";

import { useState, useEffect } from "react";
import styles from "./Chat.module.css";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // 페이지 로드 시 스크롤을 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sendMessage = async (text: string, file?: File | null) => {
    if (!text && !file) return;

    const userContent = file
      ? `📷 ${file.name}${text ? `\n${text}` : ""}`
      : text;

    setMessages(prev => [...prev, { role: "user", content: userContent }]);
    setLoading(true);

    let visionResult = null;

    if (file) {
      try {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/google", {
          method: "POST",
          body: formData,
        });

        visionResult = await res.json();
      } catch {
        visionResult = null;
      }
    }

    try {
      const res = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text || "사진만 전송되었습니다.",
          visionResult,
        }),
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "답변 생성 중 문제가 발생했어요 😥" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <ChatHeader onNewChat={() => setMessages([])} />

      <ChatMessages
        messages={messages}
        loading={loading}
        onQuickSend={text => sendMessage(text)}
      />

      <ChatInput onSend={sendMessage} />
    </div>
  );
}
