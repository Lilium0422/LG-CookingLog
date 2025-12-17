import Image from "next/image";
import styles from "./CtaSection.module.css";

export default function HomeCtaSection() {
  return (
    <section className={styles.cta}>
      <p className={styles.text}>
        요리마스터가 되는 날까지!<br/>
        <span className={styles.highlight}>쿠킹로그</span>와 함께해요
      </p>

      <div className={styles.iconWrapper}>
        <Image
          src="/icon/home-footer-icon.svg"
          alt="cookinglog-home-icon"
          width={150}
          height={150}
        />
      </div>
    </section>
  );
}
