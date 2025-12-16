import styles from "../Chat.module.css";

export default function ChatHeader({
  onNewChat,
}: {
  onNewChat: () => void;
}) {
  return (
    <section className={styles.topSection}>
      <div className={styles.botInfo}>
        <img src="/icon/cookingbot.svg" alt="쿠킹봇" />
        <div>
          <p className={styles.subTitle}>
            당신의 요리의 칼로리를 분석드립니다!
          </p>
          <h2 className={styles.title}>쿠킹봇</h2>
        </div>
      </div>

      <button className={styles.newChatBtn} onClick={onNewChat}>
        새 채팅
      </button>
    </section>
  );
}
