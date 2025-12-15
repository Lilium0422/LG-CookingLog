import Image from "next/image";
import HeroSlider from "./HeroSlider";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.headerRow}>
        <div className={styles.centerText}>
          <h2>오늘 먹을 메뉴가 고민이라면?</h2>
          <p>
            최근에 올라온 레시피를 확인해보세요!<br />
            다양한 사람들의 레시피를 참고해봐요
          </p>
        </div>

        {/* 오른쪽 아이콘 */}
        <div className={styles.heroIcon}>
          <Image
            src="/icon/hero-icon.svg"
            alt="hero-icon"
            width={110}
            height={110}
          />
        </div>
      </div>

      {/* 슬라이더 */}
      <HeroSlider />
    </section>
  );
}
