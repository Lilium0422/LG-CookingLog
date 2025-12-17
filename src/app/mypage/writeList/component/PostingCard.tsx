'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from '../css/PostingCard.module.css';

export interface PostingCardProps {
  id: number;
  category: string;
  title: string;
  date: string;
  commentCount: number;
  rating: number;
  likeCount: number;
}

const PostingCard = ({
  id,
  category,
  title,
  date,
  commentCount,
  rating,
  likeCount,
}: PostingCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleRef = useRef<HTMLDivElement>(null);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/post/${id}`
      : '';

  /* 바깥 클릭 닫기 */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toggleRef.current && !toggleRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  /* ESC 닫기 */
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsShareOpen(false);
        (document.activeElement as HTMLElement)?.blur();
      }
    };

    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, []);

  /* 링크 복사 */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsShareOpen(false);
  };

  const handleTwitterShare = async () => {
    await navigator.clipboard.writeText(shareUrl);
    openNewTab(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`
    );
  };

  const handleInstagramShare = async () => {
    await navigator.clipboard.writeText(shareUrl);
    openNewTab('https://www.instagram.com/');
  };

  return (
    <>
      {/* 카드 */}
      <div className={css.cardCon}>
        <div className={css.cardHead}>
          <div className={css.textWrapper}>
            <div className={css.category}>{category}</div>
            <div className={css.title}>{title}</div>
            <div className={css.time}>{date}</div>
          </div>

          <div className={css.toggle} ref={toggleRef}>
            <button
              className={css.togBtn}
              onClick={() => setIsOpen((p) => !p)}
            >
              <img src="/icon/mypageToggle-icon.svg" alt="메뉴" />
            </button>

            {isOpen && (
              <div className={css.actionModal}>
                <button
                  className={css.actionItem}
                  onClick={() => {
                    setIsShareOpen(true);
                    setIsOpen(false);
                  }}
                >
                  공유
                </button>
                <button className={css.actionItem}>수정</button>
                <button className={`${css.actionItem} ${css.delete}`}>
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={css.postMeta}>
          <div className={css.comment}>
            <img src="/icon/comment-icon.svg" />
            <span>{commentCount}</span>
          </div>
          <div className={css.rating}>
            <img src="/icon/star-icon.svg" />
            <span>{rating}</span>
          </div>
          <div className={css.heart}>
            <img src="/icon/heart-icon.svg" />
            <span>{likeCount}</span>
          </div>
        </div>
      </div>

      {/* 공유 모달 */}
      {isShareOpen &&
        createPortal(
          <div
            className={css.backdrop}
            onClick={() => setIsShareOpen(false)}
          >
            <div
              className={css.shareModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={css.shareHeader}>
                <h2>게시글 공유</h2>
                <button
                  className={css.closeBtn}
                  onClick={() => setIsShareOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className={css.shareIcons}>
                <button className={css.iconBtn}>
                  <img src="/images/kakao-logo.png" />
                  <span>카카오톡</span>
                </button>
                <button
                  className={css.iconBtn}
                  onClick={handleTwitterShare}
                >
                  <img src="/images/twitter-logo.png" />
                  <span>트위터</span>
                </button>
                <button
                  className={css.iconBtn}
                  onClick={handleInstagramShare}
                >
                  <img src="/images/instagram-logo.jpeg" />
                  <span>인스타그램</span>
                </button>
              </div>

              <div className={css.linkSection}>
                <span className={css.linkLabel}>링크</span>
                <div className={css.linkBox}>
                  <input readOnly value={shareUrl} />
                  <button onClick={handleCopy}>
                    {copied ? '복사됨' : '복사'}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default PostingCard;
