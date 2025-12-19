'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import css from '../css/PostingCard.module.css';

export interface PostingCardProps {
  id: number;
  category: string;
  title: string;
  date: string;
  rating: number;
  onDelete?: (id: number) => void;
}

// 1. window 객체에 Kakao 타입 선언 (에러 방지)
declare global {
  interface Window {
    Kakao: any;
  }
}

const PostingCard = ({ id, category, title, date, rating, onDelete }: PostingCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(0);
  const toggleRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/recipes/${id}`
      : '';

  // 댓글 수 조회
  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const res = await fetch(
          `https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts/${id}/comments/count`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error('댓글 수 조회 실패');
        const data = await res.json();
        setCommentCount(data.count || 0);
      } catch (err) {
        console.error(err);
        setCommentCount(0);
      }
    };
    fetchCommentCount();
  }, [id]);

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

  // 2. 카카오 SDK 초기화
  useEffect(() => {
    const initKakao = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('1e7ad2c4862b5aa8a001a85e82d0af98'); // 여기에 키 입력
      }
    };
    initKakao();
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

  // 3. 카카오톡 공유 핸들러 함수
  const handleKakaoShare = () => {
    if (!window.Kakao) {
      alert('카카오 SDK가 아직 로드되지 않았습니다.');
      return;
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: title, // 게시글 제목
        description: `${category} 레시피를 확인해보세요!`, // 상세 설명
        imageUrl: 'https://cdn.pixabay.com/photo/2014/12/21/23/28/recipe-575434_1280.png', // 임시 테스트용 이미지
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '자세히 보기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
  };

  return (
    <>
      {/* 카드 */}
      <div
        className={css.cardCon}
        onClick={() => router.push(`/recipes/${id}`)}
        style={{ cursor: 'pointer' }}
      >
        <div className={css.cardHead}>
          {/* 카드 헤드 부분 */}
          <div className={css.textWrapper}>
            <div className={css.category}>{category}</div>
            <div className={css.title}>{title}</div>
            <div className={css.time}>{date}</div>
          </div>
          {/* 카드 토글 부분 */}
          <div className={css.toggle} ref={toggleRef}>
            <button
              className={css.togBtn}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen((p) => !p);
              }}
            >
              <img src="/icon/mypageToggle-icon.svg" alt="메뉴" />
            </button>
            {/* 카드 토글 모달창 부분 */}
            {isOpen && (
              <div className={css.actionModal}>
                <button
                  className={css.actionItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsShareOpen(true);
                    setIsOpen(false);
                  }}
                >
                  공유
                </button>

                <button
                  className={css.actionItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/recipes/${id}/edit`);
                  }}
                >
                  수정
                </button>

                <button
                  className={`${css.actionItem} ${css.delete}`}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (confirm('정말 삭제하시겠습니까?')) {
                      try {
                        const res = await fetch(
                          `https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts/${id}`,
                          {
                            method: 'DELETE',
                            credentials: 'include',
                          }
                        );
                        if (!res.ok) throw new Error('삭제 실패');
                        alert('삭제 완료');
                        onDelete?.(id); // 부모 상태 갱신
                      } catch (err) {
                        console.error(err);
                        alert('삭제 중 오류가 발생했습니다.');
                      }
                    }
                  }}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
        {/* 카드 밑부분 */}
        <div className={css.postMeta}>
          <div className={css.comment}>
            <img src="/icon/comment-icon.svg" alt="댓글" />
            <span>{commentCount}</span>
          </div>
          <div className={css.rating}>
            <img src="/icon/star-icon.svg" alt="평점" />
            <span>{rating}</span>
          </div>
        </div>
      </div>

      {/* 토글 모달창의 공유 모달창 부분 */}
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
                <button 
                  className={css.iconBtn}
                  onClick={handleKakaoShare}  
                >
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
