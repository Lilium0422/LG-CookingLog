'use client';

import { useEffect, useState } from 'react';
import Tabs from '../components/Tabs';
import css from './css/commentPage.module.css';
import CommentCardList from './component/CommentCardList';
import { fetchProfile } from '../api/profileApi';

const Page = () => {
  const [nickname, setNickname] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState<number | null>(null); // 총 댓글 수

  useEffect(() => {
    const getProfileAndComments = async () => {
      try {
        const data = await fetchProfile(); // 사용자 프로필
        setNickname(data.nickname);

        // 총 댓글 수 조회
        const res = await fetch(
          `https://after-ungratifying-lilyanna.ngrok-free.dev/api/users/${data.nickname}/comments/count`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error('총 댓글 수 조회 실패');
        const countData = await res.json(); // { count: 숫자 }
        setCommentCount(countData.count);
      } catch (err) {
        console.error('프로필 또는 댓글 수 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    getProfileAndComments();
  }, []);

  if (loading) return <div className={css.loading}>사용자 정보를 불러오는 중...</div>;

  return (
    <div className={css.container}>
      <div className={css.content}>
        <Tabs />

        {/* 총 댓글 수 표시 */}
        {commentCount !== null && (
          <div className={css.totalCount}>
            총 댓글 수: {commentCount}개
          </div>
        )}

        {nickname ? (
          <CommentCardList nickname={nickname} />
        ) : (
          <div className={css.noData}>사용자 정보를 가져올 수 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default Page;
