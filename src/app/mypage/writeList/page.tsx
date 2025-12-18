'use client';

import { useEffect, useState } from 'react';
import Tabs from '../components/Tabs';
import css from './css/writePage.module.css';
import PostingCardList from './component/PostingCardList';
import { fetchProfile } from '../api/profileApi'; // 유저 정보 가져오는 API

const Page = () => {
  const [nickname, setNickname] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [postCount, setPostCount] = useState<number | null>(null); // 총 게시글 수

  useEffect(() => {
    const getProfileAndPostCount = async () => {
      try {
        const data = await fetchProfile(); // 사용자 프로필
        setNickname(data.nickname);

        // 총 게시글 수 조회
        const res = await fetch(
          `https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts/user/${data.nickname}`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error('총 게시글 수 조회 실패');
        const posts = await res.json(); // 게시글 배열
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
            총 게시글 수: {postCount}개
          </div>
        )}

        {nickname ? (
          <PostingCardList nickname={nickname} />
        ) : (
          <div className={css.noData}>사용자 정보를 가져올 수 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default Page;
