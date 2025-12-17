"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import styles from "./HeroSlider.module.css";

export default function HeroSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (paused || loading) return;

    const slider = sliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      slider.scrollLeft += 0.5;

      // 끝까지 가면 다시 처음처럼
      if (
        slider.scrollLeft >=
        slider.scrollWidth - slider.clientWidth
      ) {
        slider.scrollLeft = 0;
      }
    }, 18);

    return () => clearInterval(interval);
  }, [paused, loading]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.pauseBtn}
        onClick={() => setPaused((prev) => !prev)}
      >
        {paused ? "▶ 재생" : "⏸ 정지"}
      </button>

      <div className={styles.slider} ref={sliderRef}>
        {Array.from({ length: 10 }).map((_, index) => (
          <Image
            key={index}
            src={`/images/hero-slide${index + 1}.jpeg`}
            alt={`hero-slide-${index}`}
            width={300}
            height={200}
            className={styles.slide}
          />
        ))}
      </div>
    </div>
  );
}
