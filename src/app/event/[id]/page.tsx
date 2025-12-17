"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./detail.module.css";
import LoadingSpinner from "@/components/LoadingSpinner";
import { events } from "../data/eventData";
import { getEventStatus } from "../utils/eventUtils";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params.id);
  const [loading, setLoading] = useState(true);

  const event = events.find((e) => e.id === eventId);

  // 초기 로딩 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={styles.detailContainer}>
        <div className={styles.detailContent}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={styles.detailContainer}>
        <div className={styles.detailContent}>
          <p>이벤트를 찾을 수 없습니다.</p>
          <button
            className={styles.backButton}
            onClick={() => router.push("/event")}
          >
            목록으로
          </button>
        </div>
      </div>
    );
  }

  const status = getEventStatus(event.endDate);

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailContent}>
        {/* 이벤트 헤더 */}
        <header className={styles.eventHeader}>
          <h1 className={styles.eventTitle}>{event.title}</h1>
          <div className={styles.eventMeta}>
            <span
              className={`${styles.statusBadge} ${
                status === "진행중" ? styles.ongoing : styles.ended
              }`}
            >
              {status}
            </span>
            <span className={styles.eventDate}>
              {event.startDate} ~ {event.endDate}
            </span>
          </div>
        </header>

        {/* 이벤트 이미지 */}
        <div className={styles.imageSection}>
          <Image
            src={event.image}
            alt={event.title}
            width={600}
            height={300}
            className={styles.eventImage}
          />
        </div>

        {/* 이벤트 설명 */}
        <div className={styles.descriptionSection}>
          <p className={styles.description}>{event.description}</p>
        </div>

        {/* 이벤트 상세 내용 */}
        <div className={styles.contentSection}>
          <div className={styles.eventContent}>
            {event.details.split("\n").map((line, index) => (
              <p key={index} className={styles.contentLine}>
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className={styles.actionSection}>
          <button
            className={styles.backButton}
            onClick={() => router.push("/event")}
          >
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}
