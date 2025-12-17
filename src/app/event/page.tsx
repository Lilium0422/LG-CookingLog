"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Event.module.css";
import EventCard from "./components/EventCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { events } from "./data/eventData";
import { getEventStatus } from "./utils/eventUtils";

export type EventStatus = "전체" | "진행중" | "진행종료";

export default function EventPage() {
  const [selectedTab, setSelectedTab] = useState<EventStatus>("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const eventsPerPage = 6;

  // 초기 로딩 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // 탭에 따라 필터링
  const filteredEvents = events.filter((event) => {
    if (selectedTab === "전체") return true;
    return getEventStatus(event.endDate) === selectedTab;
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  // 페이지 번호 배열 생성 (최대 5개 페이지 버튼 표시)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tab: EventStatus) => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className={styles.eventContainer}>
        <main className={styles.mainContent}>
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.eventContainer}>
      <main className={styles.mainContent}>
        {/* 페이지 헤더 */}
        <div className={styles.pageHeader}>
          <div className={styles.titleSection}>
            <Image
              src="/icon/event-logo.png"
              alt="이벤트"
              width={60}
              height={60}
              className={styles.eventIcon}
            />
            <h1 className={styles.pageTitle}>이벤트</h1>
          </div>

          {/* 탭 버튼 */}
          <div className={styles.tabButtons}>
            <button
              className={`${styles.tabButton} ${
                selectedTab === "전체" ? styles.active : ""
              }`}
              onClick={() => handleTabChange("전체")}
            >
              전체
            </button>
            <button
              className={`${styles.tabButton} ${
                selectedTab === "진행중" ? styles.active : ""
              }`}
              onClick={() => handleTabChange("진행중")}
            >
              진행중
            </button>
            <button
              className={`${styles.tabButton} ${
                selectedTab === "진행종료" ? styles.active : ""
              }`}
              onClick={() => handleTabChange("진행종료")}
            >
              진행종료
            </button>
          </div>
        </div>

        {/* 이벤트 그리드 */}
        <div className={styles.eventGrid}>
          {currentEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              status={getEventStatus(event.endDate)}
            />
          ))}
        </div>

        {/* 검색 결과가 없을 때 */}
        {filteredEvents.length === 0 && (
          <div className={styles.noResults}>
            <p>진행 중인 이벤트가 없습니다.</p>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            {/* 이전 페이지 버튼 */}
            <button
              className={`${styles.pageButton} ${
                currentPage === 1 ? styles.disabled : ""
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            {/* 페이지 번호 버튼들 */}
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                className={`${styles.pageButton} ${
                  currentPage === pageNum ? styles.active : ""
                }`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            {/* 다음 페이지 버튼 */}
            <button
              className={`${styles.pageButton} ${
                currentPage === totalPages ? styles.disabled : ""
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
