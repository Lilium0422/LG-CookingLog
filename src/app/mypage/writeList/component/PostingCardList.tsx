'use client';

import { useEffect, useState } from 'react';
import PostingCard from './PostingCard';
import css from '../css/PostingCardList.module.css';

interface Post {
  id: number;
  category: string;
  title: string;
  date: string;
  commentCount: number;
  rating: number;
  likeCount: number;
}

interface PostingCardListProps {
  nickname: string; // 조회할 사용자 닉네임
}

const PostingCardList = ({ nickname }: PostingCardListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `https://after-ungratifying-lilyanna.ngrok-free.dev/api/posts/user/${nickname}`;

  /** 사용자별 게시글 조회 */
  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        credentials: 'include', // 쿠키/세션 인증 포함
      });

      if (!res.ok) {
        console.error('사용자 게시글 조회 실패, status:', res.status);
        setPosts([]);
        setLoading(false);
        return;
      }

      const data: Post[] = await res.json();
      setPosts(data || []);
      console.log(posts);
    } catch (err) {
      console.error('사용자 게시글 조회 에러:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nickname) {
      fetchUserPosts();
    }
  }, [nickname]);

  if (loading) return <div className={css.loading}>게시글을 불러오는 중...</div>;

  if (posts.length === 0)
    return <div className={css.noData}>작성한 게시글이 없습니다.</div>;

  return (
    <section className={css.listContainer}>
      {posts.map((post) => (
        <PostingCard
          key={post.id}
          id={post.id}
          category={post.category}
          title={post.title}
          date={post.date}
          rating={post.rating}
        />
      ))}
    </section>
  );
};

export default PostingCardList;