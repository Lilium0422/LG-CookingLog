"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import styles from "./HeroSlider.module.css";

export default function HeroSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 초기 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // 애니메이션 시작/정지 로직
  useEffect(() => {
    // 정리 함수 먼저 실행
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 조건 확인
    if (paused || loading) {
      return;
    }

    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

    // 100ms 후에 애니메이션 시작 (Chrome 호환성)
    const startTimer = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (!slider || paused) return;

        slider.scrollLeft += 1;

        // 중간 지점에 도달하면 처음으로 리셋
        const halfWidth = slider.scrollWidth / 2;
        if (slider.scrollLeft >= halfWidth) {
          slider.scrollLeft = 0;
        }
      }, 20);
    }, 100);

    // cleanup 함수
    return () => {
      clearTimeout(startTimer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [paused, loading]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <LoadingSpinner />
      </div>
    );
  }

  // 이미지 배열 (2번 복제하여 무한 루프 효과)
  const slides = Array.from({ length: 10 }).map((_, index) => ({
    src: `/images/hero-slide${index + 1}.jpeg`,
    alt: `hero-slide-${index + 1}`,
  }));

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.pauseBtn}
        onClick={() => {
          setPaused((prev) => !prev);
        }}
      >
        {paused ? "▶ 재생" : "⏸ 정지"}
      </button>

      <div className={styles.slider} ref={sliderRef}>
        {/* 원본 슬라이드 */}
        {slides.map((slide, index) => (
          <Image
            key={`original-${index}`}
            src={slide.src}
            alt={slide.alt}
            width={320}
            height={210}
            className={styles.slide}
            priority={index < 3}
          />
        ))}
        {/* 복제된 슬라이드 (무한 루프용) */}
        {slides.map((slide, index) => (
          <Image
            key={`clone-${index}`}
            src={slide.src}
            alt={`${slide.alt}-clone`}
            width={320}
            height={210}
            className={styles.slide}
          />
        ))}
      </div>
    </div>
  );
}
