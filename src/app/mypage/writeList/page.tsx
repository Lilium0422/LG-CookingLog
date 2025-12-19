'use client';

import { useEffect, useState } from 'react';
import Tabs from '../components/Tabs';
import css from './css/writePage.module.css';
import PostingCardList from './component/PostingCardList';
import { fetchProfile } from '../api/profileApi'; // 유저 정보 가져오는 API

const Page = () => {
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [postCount, setPostCount] = useState<number | null>(null); // 총 게시글 수

  useEffect(() => {
    const getProfileAndPostCount = async () => {
      try {
        const data = await fetchProfile(); // 사용자 프로필
        setUserId(data.userId);

        // 총 게시글 수 조회
        const res = await fetch(
          `https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts/userid/${data.userId}`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error('총 게시글 수 조회 실패');
        const posts = await res.json(); // 게시글 배열
        console.log(posts, '게시글 확인'); // 디버깅 용
        setPostCount(posts.length);
      } catch (err) {
        console.error('프로필 또는 게시글 수 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    getProfileAndPostCount();
  }, []);

  if (loading) return <div className={css.loading}>사용자 정보를 불러오는 중...</div>;

  return (
    <div className={css.container}>
      <div className={css.content}>
        <Tabs />

        {/* 총 게시글 수 표시 */}
        {postCount !== null && (
          <div className={css.totalCount}>
            총 게시글 수: <span>{postCount}</span>개
          </div>
        )}

        {userId ? (
          <PostingCardList userId={userId} />
        ) : (
          <div className={css.noData}>사용자 정보를 가져올 수 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default Page;